"""Elasticsearch product search.
ponytail: BM25 + filters; skip vector search until needed."""

from elasticsearch import AsyncElasticsearch


INDEX = "products"

# ES mapping for the products index
PRODUCTS_MAPPING = {
    "mappings": {
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "text", "analyzer": "standard", "fields": {"suggest": {"type": "completion"}}},
            "brand": {"type": "keyword"},
            "category": {"type": "keyword"},
            "shade": {"type": "keyword"},
            "price": {"type": "float"},
            "stock": {"type": "integer"},
            "image_url": {"type": "keyword", "index": False},
            "description": {"type": "text"},
        }
    },
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
    },
}


async def ensure_index(es: AsyncElasticsearch) -> None:
    """Create the products index if it doesn't exist."""
    if not await es.indices.exists(index=INDEX):
        await es.indices.create(index=INDEX, body=PRODUCTS_MAPPING)


async def search_products(
    es: AsyncElasticsearch,
    query: str = "",
    brand: str | None = None,
    category: str | None = None,
    shade: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    page: int = 1,
    size: int = 20,
) -> list[dict]:
    """Full-text search with optional filters. Returns list of product dicts."""
    must = []
    filters = []

    if query:
        must.append({
            "multi_match": {
                "query": query,
                "fields": ["name^3", "brand^2", "description", "category"],
                "fuzziness": "AUTO",
            }
        })

    if brand:
        filters.append({"term": {"brand": brand}})
    if category:
        filters.append({"term": {"category": category}})
    if shade:
        filters.append({"term": {"shade": shade}})

    price_range = {}
    if min_price is not None:
        price_range["gte"] = min_price
    if max_price is not None:
        price_range["lte"] = max_price
    if price_range:
        filters.append({"range": {"price": price_range}})

    body = {
        "query": {
            "bool": {
                "must": must or [{"match_all": {}}],
                "filter": filters,
            }
        },
        "from": (page - 1) * size,
        "size": size,
        "sort": [{"_score": "desc"}, {"id": "asc"}],
    }

    resp = await es.search(index=INDEX, body=body)
    return [hit["_source"] for hit in resp["hits"]["hits"]]


async def autocomplete(es: AsyncElasticsearch, prefix: str, size: int = 5) -> list[str]:
    """Completion suggester for product names."""
    body = {
        "suggest": {
            "product-suggest": {
                "prefix": prefix,
                "completion": {"field": "name.suggest", "size": size},
            }
        }
    }
    resp = await es.search(index=INDEX, body=body)
    options = resp["suggest"]["product-suggest"][0]["options"]
    return [opt["text"] for opt in options]
