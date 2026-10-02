# ALS Recommendation Model Training
# Run in: Microsoft Fabric PySpark Notebook
# ponytail: ALS matrix factorization — simplest collaborative filtering that works

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, lit, log as spark_log, when
from pyspark.ml.recommendation import ALS
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.tuning import ParamGridBuilder, CrossValidator
import mlflow

GOLD_PATH = "Tables/gold"
MODEL_OUTPUT = "Tables/ml/als_model"
EMBEDDINGS_OUTPUT = "Tables/ml/embeddings"


def build_implicit_interactions():
    """Build implicit feedback matrix from Gold facts.
    
    Scoring:
      - purchase: 5 points per item
      - add_to_cart: 3 points
      - page_view: 1 point
    
    ponytail: hardcoded weights; tune with A/B test data when available.
    """
    # Purchase interactions from fact_orders
    orders = spark.read.format("delta").load(f"{GOLD_PATH}/fact_orders")
    purchase_scores = (
        orders
        .filter(col("order_status") != "cancelled")
        .groupBy("user_id", "product_id")
        .agg(count("*").alias("purchase_count"))
        .withColumn("purchase_score", col("purchase_count") * 5)
        .select("user_id", "product_id", "purchase_score")
    )

    # Clickstream interactions from fact_clickstream
    clicks = spark.read.format("delta").load(f"{GOLD_PATH}/fact_clickstream")

    view_scores = (
        clicks
        .filter(col("event_type") == "page_view")
        .filter(col("product_id").isNotNull())
        .groupBy("user_id", "product_id")
        .agg(count("*").alias("view_count"))
        .withColumn("view_score", col("view_count") * 1)
        .select("user_id", "product_id", "view_score")
    )

    cart_scores = (
        clicks
        .filter(col("event_type") == "add_to_cart")
        .filter(col("product_id").isNotNull())
        .groupBy("user_id", "product_id")
        .agg(count("*").alias("cart_count"))
        .withColumn("cart_score", col("cart_count") * 3)
        .select("user_id", "product_id", "cart_score")
    )

    # Combine all signals
    # ponytail: full outer join + coalesce — standard implicit feedback aggregation
    combined = (
        purchase_scores.alias("p")
        .join(view_scores.alias("v"), ["user_id", "product_id"], "full_outer")
        .join(cart_scores.alias("c"), ["user_id", "product_id"], "full_outer")
        .fillna(0)
        .selectExpr(
            "user_id",
            "product_id",
            "coalesce(purchase_score, 0) + coalesce(view_score, 0) + coalesce(cart_score, 0) as implicit_score"
        )
        .filter(col("user_id").isNotNull())
        .filter(col("product_id").isNotNull())
    )

    # Apply log dampening to avoid score explosion
    combined = combined.withColumn(
        "implicit_score", spark_log(col("implicit_score") + 1)
    )

    return combined


def train_als(interactions):
    """Train ALS model with MLflow tracking."""

    # Split
    train, test = interactions.randomSplit([0.8, 0.2], seed=42)

    print(f"Training set: {train.count()} interactions")
    print(f"Test set: {test.count()} interactions")

    with mlflow.start_run(run_name="als_cosmetics_recs"):
        # Log dataset stats
        mlflow.log_param("train_count", train.count())
        mlflow.log_param("test_count", test.count())
        mlflow.log_param("unique_users", interactions.select("user_id").distinct().count())
        mlflow.log_param("unique_products", interactions.select("product_id").distinct().count())

        # ponytail: fixed hyperparams; add grid search when model quality matters
        rank = 50
        max_iter = 15
        reg_param = 0.1

        mlflow.log_param("rank", rank)
        mlflow.log_param("max_iter", max_iter)
        mlflow.log_param("reg_param", reg_param)

        als = ALS(
            userCol="user_id",
            itemCol="product_id",
            ratingCol="implicit_score",
            rank=rank,
            maxIter=max_iter,
            regParam=reg_param,
            implicitPrefs=True,
            coldStartStrategy="drop",
            seed=42,
        )

        model = als.fit(train)

        # Evaluate on test set
        predictions = model.transform(test)
        evaluator = RegressionEvaluator(
            metricName="rmse",
            labelCol="implicit_score",
            predictionCol="prediction",
        )
        rmse = evaluator.evaluate(predictions)
        mlflow.log_metric("rmse", rmse)
        print(f"Test RMSE: {rmse:.4f}")

        # Log model
        mlflow.spark.log_model(model, "als-model")
        print("Model logged to MLflow")

        return model


def export_embeddings(model):
    """Save user and item factor vectors to Delta for Redis export."""

    user_factors = model.userFactors.select(
        col("id").alias("user_id"),
        col("features").alias("embedding"),
    )

    item_factors = model.itemFactors.select(
        col("id").alias("product_id"),
        col("features").alias("embedding"),
    )

    user_factors.write.format("delta").mode("overwrite").save(
        f"{EMBEDDINGS_OUTPUT}/user_factors"
    )
    item_factors.write.format("delta").mode("overwrite").save(
        f"{EMBEDDINGS_OUTPUT}/item_factors"
    )

    print(f"User embeddings: {user_factors.count()} vectors (rank={len(user_factors.first().embedding)})")
    print(f"Item embeddings: {item_factors.count()} vectors")


# ── Execute ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Building implicit interaction matrix...")
    interactions = build_implicit_interactions()
    print(f"Total interactions: {interactions.count()}")

    print("\nTraining ALS model...")
    model = train_als(interactions)

    print("\nExporting embeddings...")
    export_embeddings(model)

    print("\nALS training pipeline complete.")
