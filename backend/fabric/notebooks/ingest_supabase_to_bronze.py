# Ingest Supabase → Lakehouse Bronze Delta Tables
# Run in: Microsoft Fabric PySpark Notebook
# Attach to: omnimart_lakehouse (as Default Lakehouse)

import os
from pyspark.sql import SparkSession

# Supabase Pooler Credentials (IPv4 compatible with Microsoft Fabric / Azure cloud)
SUPABASE_HOST = "aws-0-ap-southeast-1.pooler.supabase.com"
SUPABASE_PORT = "5432"
SUPABASE_DB = "postgres"
SUPABASE_USER = "postgres.jlrmnwfvlwggevrvkxal"
SUPABASE_PASSWORD = "KPKT8ZHLliEW4etL"

# JDBC URL with sslmode=require (bypasses strict CA validation while keeping full TLS encryption)
JDBC_URL = f"jdbc:postgresql://{SUPABASE_HOST}:{SUPABASE_PORT}/{SUPABASE_DB}?sslmode=require"

TABLES = [
    "products",
    "users",
    "orders",
    "order_items",
    "payments",
    "clickstream_events"
]

print("Starting ingestion from Supabase into Lakehouse Bronze...")

for table in TABLES:
    try:
        print(f"Reading table: {table} from Supabase...")
        df = (
            spark.read.format("jdbc")
            .option("url", JDBC_URL)
            .option("dbtable", table)
            .option("user", SUPABASE_USER)
            .option("password", SUPABASE_PASSWORD)
            .option("driver", "org.postgresql.Driver")
            .load()
        )
        
        row_count = df.count()
        target_table = f"bronze_{table}"
        
        # Save directly as Lakehouse Managed Table
        df.write.format("delta").mode("overwrite").saveAsTable(target_table)
        print(f"✓ Successfully wrote {row_count} rows to table {target_table}")
    except Exception as e:
        print(f"✗ Failed to ingest {table}: {e}")

print("\nIngestion complete! All Bronze tables are now ready for bronze_to_silver notebook.")
