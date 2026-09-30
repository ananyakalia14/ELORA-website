# Microsoft Fabric Setup Guide — OmniMart

Step-by-step instructions to configure the Fabric workspace for OmniMart's analytics pipeline.

## Prerequisites

- Microsoft Fabric capacity (F2 or higher, or Fabric trial)
- Azure Event Hubs namespace (for Kafka endpoint) OR direct Fabric Eventstream Kafka connector
- Local stack running (`docker-compose up -d` with Debezium + Redpanda active)

---

## Step 1: Create Fabric Workspace

1. Go to [app.fabric.microsoft.com](https://app.fabric.microsoft.com)
2. Click **Workspaces** → **New workspace**
3. Name: `OmniMart-DataEstate`
4. Select your Fabric capacity
5. Enable **Workspace identity** under Settings → Workspace identity (required for Eventstream auth)

---

## Step 2: Create Lakehouse

1. In the workspace, click **+ New** → **Lakehouse**
2. Name: `omnimart_lakehouse`
3. This creates OneLake storage with a SQL analytics endpoint automatically

### Create folder structure

In the Lakehouse explorer, create these Delta table folders (they'll be auto-created when notebooks write to them, but pre-creating helps organization):

```
Tables/
├── bronze/
│   ├── users
│   ├── products
│   ├── orders
│   ├── order_items
│   └── clickstream_events
├── silver/
│   ├── users
│   ├── products
│   ├── orders
│   ├── order_items
│   └── clickstream_events
├── gold/
│   ├── dim_user
│   ├── dim_product
│   ├── dim_date
│   ├── fact_orders
│   └── fact_clickstream
└── ml/
    └── embeddings/
        ├── user_factors
        └── item_factors
```

---

## Step 3: Set Up Eventstream

### 3a: Create Eventhouse (KQL Database)

1. **+ New** → **Eventhouse**
2. Name: `omnimart_realtime`
3. A KQL database is automatically created inside

### 3b: Create Eventstream

1. **+ New** → **Eventstream**
2. Name: `omnimart_stream`
3. **Add source** → **Azure Event Hubs** (or **Custom app** with Kafka endpoint)
   - If using Redpanda locally, you'll need a tunnel (e.g., ngrok) or Azure Event Hubs as a bridge:
     ```bash
     # Option A: Use Azure Event Hubs as Kafka endpoint
     # Configure Redpanda/Debezium to produce to Event Hubs instead of local Kafka
     # Event Hubs connection string goes in Debezium connector config
     
     # Option B: For dev/demo, export Bronze data manually
     # Upload Kafka topic data as Parquet to OneLake Files/
     ```

4. **Add destination** → **KQL Database**
   - Select `omnimart_realtime`
   - Map to table: `ClickstreamEvents`
   - Data format: JSON

5. **Add destination** → **Lakehouse**
   - Select `omnimart_lakehouse`
   - Target: `Tables/bronze/` (one stream per table, or a single stream with routing)

### 3c: Configure KQL Table Schema

In the Eventhouse KQL database, create the ingestion table:

```kql
.create table ClickstreamEvents (
    Id: long,
    UserId: int,
    EventType: string,
    ProductId: int,
    Metadata: dynamic,
    Timestamp: datetime
)

.create table ClickstreamEvents ingestion json mapping 'ClickstreamMapping'
    '[{"column":"Id","path":"$.id"},{"column":"UserId","path":"$.user_id"},{"column":"EventType","path":"$.event_type"},{"column":"ProductId","path":"$.product_id"},{"column":"Metadata","path":"$.metadata"},{"column":"Timestamp","path":"$.created_at"}]'
```

---

## Step 4: Import Notebooks

1. In the workspace, click **+ New** → **Import notebook**
2. Upload these files from the repo:
   - `fabric/notebooks/bronze_to_silver.py`
   - `fabric/notebooks/silver_to_gold.py`
   - `fabric/ml/train_als.py`
3. In each notebook, attach to the `omnimart_lakehouse` as the default lakehouse

### Update paths if needed

The notebooks use relative Lakehouse paths (`Tables/bronze/`, `Tables/silver/`, etc.). These resolve automatically when a Lakehouse is attached as the notebook's default lakehouse.

---

## Step 5: Create Data Factory Pipeline

1. **+ New** → **Data pipeline**
2. Name: `omnimart_etl_pipeline`
3. Add activities in sequence:

```
[Notebook: bronze_to_silver] → [Notebook: silver_to_gold] → [Notebook: train_als (optional)]
```

4. Configure schedule:
   - **Bronze → Silver**: Every 15 minutes (or event-driven via Eventstream)
   - **Silver → Gold**: Every hour
   - **ALS training**: Weekly (Sunday 2 AM)

5. Add retry policy: 2 retries, 5-minute interval

---

## Step 6: KQL Querysets

1. In the Eventhouse, click **+ New** → **KQL Queryset**
2. Create two querysets:
   - `active_viewers` — paste contents of `fabric/kql/active_viewers.kql`
   - `abandonment_candidates` — paste contents of `fabric/kql/abandonment_candidates.kql`
3. Pin frequently-used queries to the queryset dashboard

---

## Step 7: Data Activator Alert

1. In the workspace, click **+ New** → **Reflex** (Data Activator)
2. **Source**: Connect to `omnimart_realtime` KQL database
3. **Trigger**: 
   - Name: `abandonment_discount_trigger`
   - Condition: User viewed same product ≥ 3 times in 10 minutes without purchasing
   - Use the KQL from `abandonment_candidates.kql` Query 1
4. **Action**: 
   - Type: **Custom action (webhook)**
   - URL: `https://your-api.com/webhooks/discount` (or Teams/email for demo)
   - Payload: `{"user_id": ..., "product_id": ..., "discount_pct": 10}`

---

## Step 8: Power BI DirectLake

### 8a: Create Semantic Model

1. In the Lakehouse SQL analytics endpoint, click **New semantic model**
2. Name: `OmniMart Analytics`
3. Select Gold tables: `fact_orders`, `fact_clickstream`, `dim_user`, `dim_product`, `dim_date`
4. The model auto-detects relationships from naming conventions, verify:
   - `fact_orders.user_id` → `dim_user.user_id`
   - `fact_orders.product_id` → `dim_product.product_id`
   - `fact_orders.order_date_key` → `dim_date.date_key`
   - `fact_clickstream.user_id` → `dim_user.user_id`
   - `fact_clickstream.product_id` → `dim_product.product_id`
   - `fact_clickstream.event_date_key` → `dim_date.date_key`

### 8b: Add DAX Measures

In the semantic model editor, add these measures:

```dax
Total Revenue = SUM(fact_orders[line_total])

Order Count = DISTINCTCOUNT(fact_orders[order_id])

AOV = DIVIDE([Total Revenue], [Order Count])

Conversion Rate = 
    DIVIDE(
        DISTINCTCOUNT(fact_orders[user_id]),
        DISTINCTCOUNT(fact_clickstream[user_id])
    )

Daily Active Users = DISTINCTCOUNT(fact_clickstream[user_id])
```

### 8c: Create Report

1. **+ New** → **Report** → Select `OmniMart Analytics` semantic model
2. Build 3 pages:

| Page | Visuals |
|------|---------|
| **Executive** | Revenue line chart (by date), AOV card, Order volume bar chart, Top 10 products table |
| **Real-Time** | Embed KQL tile (active viewers), Cart abandonment rate, Trending products |
| **Product** | Category treemap, Stock levels gauge, Search-to-purchase funnel |

### 8d: Row-Level Security

1. In the semantic model, go to **Security** → **New role**
2. Name: `SellerView`
3. DAX filter on `dim_product`: `[seller_id] = USERPRINCIPALNAME()`
4. Assign seller users to this role

> Note: This requires a `seller_id` column in `dim_product`. Add it to the products table and Silver/Gold pipelines when multi-seller support is implemented.

---

## Step 9: Verify End-to-End

1. **Generate traffic**: Hit the local API with some orders and clickstream events
2. **Check Debezium**: `curl http://localhost:8083/connectors/omnimart-postgres-cdc/status`
3. **Check Kafka topics**: 
   ```bash
   docker exec -it e_com-redpanda-1 rpk topic list
   docker exec -it e_com-redpanda-1 rpk topic consume omnimart.public.orders --num 5
   ```
4. **Check Eventstream**: Verify events flowing in Fabric Eventstream monitor
5. **Check Bronze**: Query Bronze tables in Lakehouse SQL endpoint
6. **Run pipeline**: Trigger `omnimart_etl_pipeline` manually
7. **Check Gold**: Verify star schema tables populated
8. **Check Power BI**: Open report, confirm DirectLake refresh
9. **Check KQL**: Run `active_viewers.kql` in Eventhouse

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Debezium can't connect to PG | Ensure `wal_level=logical` in PG config, check `docker-compose` network |
| Eventstream shows no data | Verify Event Hubs connection string, check Redpanda topic has messages |
| Bronze tables empty | Check Eventstream destination config, verify Lakehouse is attached |
| Silver dedup produces 0 rows | Check Bronze data format (CDC envelope vs raw JSON) |
| DirectLake slow | Run `OPTIMIZE ... VORDER` on Gold tables |
| ALS training fails | Ensure Gold fact tables have sufficient data (need interactions to train) |
