# Bronze → Silver PySpark Notebook
# Run in: Microsoft Fabric PySpark Notebook
# ponytail: SCD Type 1 (upsert/overwrite); add Type 2 when historical tracking is required

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, to_timestamp, current_timestamp, row_number
from pyspark.sql.window import Window
from pyspark.sql.types import (
    StructType, StructField, StringType, IntegerType, DoubleType, LongType, TimestampType
)
from delta.tables import DeltaTable

# In Fabric, spark session is pre-configured
# spark = SparkSession.builder.getOrCreate()

BRONZE_PATH = "Tables/bronze"
SILVER_PATH = "Tables/silver"


# ── Schema Definitions ───────────────────────────────────────────────────

orders_schema = StructType([
    StructField("id", IntegerType()),
    StructField("user_id", IntegerType()),
    StructField("status", StringType()),
    StructField("total", DoubleType()),
    StructField("created_at", StringType()),
])

order_items_schema = StructType([
    StructField("id", IntegerType()),
    StructField("order_id", IntegerType()),
    StructField("product_id", IntegerType()),
    StructField("quantity", IntegerType()),
    StructField("price", DoubleType()),
])

users_schema = StructType([
    StructField("id", IntegerType()),
    StructField("email", StringType()),
    StructField("name", StringType()),
    StructField("skin_type", StringType()),
    StructField("created_at", StringType()),
])

products_schema = StructType([
    StructField("id", IntegerType()),
    StructField("name", StringType()),
    StructField("brand", StringType()),
    StructField("category", StringType()),
    StructField("shade", StringType()),
    StructField("price", DoubleType()),
    StructField("stock", IntegerType()),
    StructField("image_url", StringType()),
    StructField("description", StringType()),
    StructField("created_at", StringType()),
])

clickstream_schema = StructType([
    StructField("id", LongType()),
    StructField("user_id", IntegerType()),
    StructField("event_type", StringType()),
    StructField("product_id", IntegerType()),
    StructField("metadata", StringType()),
    StructField("created_at", StringType()),
])


# ── Generic Bronze → Silver Transform ────────────────────────────────────

def bronze_to_silver(table_name: str, schema: StructType, key_col: str = "id"):
    """Read raw CDC JSON from Bronze, deduplicate, enforce schema, write to Silver.
    ponytail: one function handles all tables; add per-table logic only when needed."""

    bronze_path = f"{BRONZE_PATH}/{table_name}"
    silver_path = f"{SILVER_PATH}/{table_name}"

    print(f"Processing {table_name}: {bronze_path} → {silver_path}")

    # Read raw Bronze data (Debezium CDC format)
    bronze_df = spark.read.format("delta").load(bronze_path)

    # Extract the 'after' payload from CDC envelope
    # Debezium wraps changes in {"before": ..., "after": ..., "op": ...}
    if "after" in bronze_df.columns:
        # CDC envelope format
        parsed = bronze_df.select(
            from_json(col("after"), schema).alias("data"),
            col("__timestamp").alias("cdc_timestamp")
        ).select("data.*", "cdc_timestamp")
    elif "value" in bronze_df.columns:
        # Raw JSON string format
        parsed = bronze_df.select(
            from_json(col("value"), schema).alias("data")
        ).select("data.*")
    else:
        # Already structured (e.g., from Eventstream direct ingestion)
        parsed = bronze_df

    # Deduplicate: keep latest record per key
    # ponytail: row_number window dedup — standard PySpark pattern
    if "cdc_timestamp" in parsed.columns:
        window = Window.partitionBy(key_col).orderBy(col("cdc_timestamp").desc())
    else:
        window = Window.partitionBy(key_col).orderBy(col("created_at").desc())

    deduped = (
        parsed
        .withColumn("_rn", row_number().over(window))
        .filter(col("_rn") == 1)
        .drop("_rn")
    )

    # Cast timestamp strings
    if "created_at" in deduped.columns:
        deduped = deduped.withColumn("created_at", to_timestamp("created_at"))

    # Add processing metadata
    deduped = deduped.withColumn("_silver_loaded_at", current_timestamp())

    # Write as Delta (SCD Type 1 — full overwrite per key)
    # ponytail: overwrite mode for simplicity; switch to merge/upsert for incremental
    if DeltaTable.isDeltaTable(spark, silver_path):
        delta_table = DeltaTable.forPath(spark, silver_path)
        delta_table.alias("target").merge(
            deduped.alias("source"),
            f"target.{key_col} = source.{key_col}"
        ).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()
        print(f"  Merged into existing Silver table")
    else:
        deduped.write.format("delta").mode("overwrite").save(silver_path)
        print(f"  Created new Silver table")

    count = spark.read.format("delta").load(silver_path).count()
    print(f"  Silver {table_name}: {count} rows")


# ── Execute ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    tables = [
        ("users", users_schema, "id"),
        ("products", products_schema, "id"),
        ("orders", orders_schema, "id"),
        ("order_items", order_items_schema, "id"),
        ("clickstream_events", clickstream_schema, "id"),
    ]

    for table_name, schema, key in tables:
        try:
            bronze_to_silver(table_name, schema, key)
        except Exception as e:
            print(f"  ERROR on {table_name}: {e}")
            continue

    print("\nBronze → Silver complete.")
