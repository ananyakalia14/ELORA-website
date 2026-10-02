# Silver → Gold PySpark Notebook
# Run in: Microsoft Fabric PySpark Notebook
# Builds a dimensional star schema from cleansed Silver tables

from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, lit, date_format, dayofweek, dayofmonth, month, year, quarter,
    weekofyear, current_timestamp, expr, coalesce, when, sum as spark_sum,
    count as spark_count, avg as spark_avg
)
from pyspark.sql.types import DateType

SILVER_PATH = "Tables/silver"
GOLD_PATH = "Tables/gold"


# ── Dimension Tables ─────────────────────────────────────────────────────

def build_dim_user():
    """dim_user from silver_users."""
    try:
        silver = spark.read.table("silver_users")
    except Exception:
        silver = spark.read.format("delta").load(f"{SILVER_PATH}/users")

    dim = silver.select(
        col("id").alias("user_key"),
        col("id").alias("user_id"),
        col("email"),
        col("name"),
        col("skin_type"),
        col("created_at").alias("registered_at"),
        current_timestamp().alias("_gold_loaded_at"),
    )

    dim.write.format("delta").mode("overwrite").option("overwriteSchema", "true").saveAsTable("gold_dim_user")
    print(f"✓ gold_dim_user: {dim.count()} rows")


def build_dim_product():
    """dim_product from silver_products."""
    try:
        silver = spark.read.table("silver_products")
    except Exception:
        silver = spark.read.format("delta").load(f"{SILVER_PATH}/products")

    dim = silver.select(
        col("id").alias("product_key"),
        col("id").alias("product_id"),
        col("name"),
        col("brand"),
        col("category"),
        col("shade"),
        col("price").alias("current_price"),
        col("stock").alias("current_stock"),
        col("image_url"),
        col("description"),
        col("created_at").alias("listed_at"),
        current_timestamp().alias("_gold_loaded_at"),
    )

    dim.write.format("delta").mode("overwrite").option("overwriteSchema", "true").saveAsTable("gold_dim_product")
    print(f"✓ gold_dim_product: {dim.count()} rows")


def build_dim_date():
    """dim_date — generated calendar table covering 2024–2028."""
    dates = spark.sql("""
        SELECT explode(sequence(
            to_date('2024-01-01'),
            to_date('2028-12-31'),
            interval 1 day
        )) as date
    """)

    dim = dates.select(
        date_format("date", "yyyyMMdd").cast("int").alias("date_key"),
        col("date"),
        year("date").alias("year"),
        quarter("date").alias("quarter"),
        month("date").alias("month"),
        date_format("date", "MMMM").alias("month_name"),
        weekofyear("date").alias("week_of_year"),
        dayofmonth("date").alias("day_of_month"),
        dayofweek("date").alias("day_of_week"),
        date_format("date", "EEEE").alias("day_name"),
        when(dayofweek("date").isin(1, 7), lit(True)).otherwise(lit(False)).alias("is_weekend"),
    )

    dim.write.format("delta").mode("overwrite").option("overwriteSchema", "true").saveAsTable("gold_dim_date")
    print(f"✓ gold_dim_date: {dim.count()} rows")


# ── Fact Tables ──────────────────────────────────────────────────────────

def build_fact_orders():
    """fact_orders — one row per order item, with denormalized order-level fields."""
    try:
        orders = spark.read.table("silver_orders")
        items = spark.read.table("silver_order_items")
    except Exception:
        orders = spark.read.format("delta").load(f"{SILVER_PATH}/orders")
        items = spark.read.format("delta").load(f"{SILVER_PATH}/order_items")

    fact = (
        items.alias("i")
        .join(orders.alias("o"), col("i.order_id") == col("o.id"), "inner")
        .select(
            col("i.id").alias("order_item_key"),
            col("o.id").alias("order_id"),
            col("o.user_id"),
            col("i.product_id"),
            date_format(col("o.created_at"), "yyyyMMdd").cast("int").alias("order_date_key"),
            col("o.status").alias("order_status"),
            col("i.quantity"),
            col("i.price").alias("unit_price"),
            (col("i.quantity") * col("i.price")).alias("line_total"),
            col("o.total").alias("order_total"),
            col("o.created_at").alias("order_timestamp"),
            current_timestamp().alias("_gold_loaded_at"),
        )
    )

    fact.write.format("delta").mode("overwrite").option("overwriteSchema", "true").saveAsTable("gold_fact_orders")
    print(f"✓ gold_fact_orders: {fact.count()} rows")


def build_fact_clickstream():
    """fact_clickstream — one row per event."""
    try:
        silver = spark.read.table("silver_clickstream_events")
    except Exception:
        silver = spark.read.format("delta").load(f"{SILVER_PATH}/clickstream_events")

    fact = silver.select(
        col("id").alias("event_key"),
        col("user_id"),
        col("product_id"),
        date_format(col("created_at"), "yyyyMMdd").cast("int").alias("event_date_key"),
        col("event_type"),
        col("metadata").alias("event_metadata"),
        col("created_at").alias("event_timestamp"),
        current_timestamp().alias("_gold_loaded_at"),
    )

    fact.write.format("delta").mode("overwrite").option("overwriteSchema", "true").saveAsTable("gold_fact_clickstream")
    print(f"✓ gold_fact_clickstream: {fact.count()} rows")


# ── Optimization ─────────────────────────────────────────────────────────

def optimize_gold_tables():
    """Apply OPTIMIZE + V-Order on Gold tables for DirectLake performance."""
    gold_tables = ["gold_dim_user", "gold_dim_product", "gold_dim_date", "gold_fact_orders", "gold_fact_clickstream"]
    for table in gold_tables:
        try:
            spark.sql(f"OPTIMIZE {table} VORDER")
            print(f"  Optimized {table}")
        except Exception as e:
            print(f"  OPTIMIZE {table} skipped: {e}")


# ── Execute ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Building Gold dimensions...")
    build_dim_user()
    build_dim_product()
    build_dim_date()

    print("\nBuilding Gold facts...")
    build_fact_orders()
    build_fact_clickstream()

    print("\nOptimizing Gold tables...")
    optimize_gold_tables()

    print("\nSilver → Gold complete.")
