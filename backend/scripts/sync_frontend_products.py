"""Sync all official frontend Élora products into PostgreSQL / Supabase.
Usage: python -m scripts.sync_frontend_products
"""

import asyncio
from sqlalchemy import select, text
from app.db import async_session
from app.models import Product

FINAL_BOUTIQUE_PRODUCTS = [
    {
        "slug": "hero-serum",
        "name": "The Hero Serum",
        "brand": "Élora",
        "category": "Serums",
        "shade": "Dewy Glass",
        "subtitle": "Radiant Cellular Infusion",
        "price": 98.00,
        "stock": 150,
        "volume": "30 ml / 1.0 fl oz",
        "rating": 4.95,
        "reviews_count": 342,
        "badge": "Signature Hero",
        "is_hero": True,
        "image_url": "/images/elora-hero-serum.jpg",
        "secondary_image": "/images/elora-botanical-rose.jpg",
        "description": "A multi-corrective botanical elixir formulated with cold-pressed French Alpine Rose stem cells and 5-tier oligo-hyaluronic acid. Deeply quenches cellular thirst, smooths micro-texture, and unveils an ethereal glass-skin glow within 7 days.",
        "details": {
            "variants": [
                {"id": "hero-dewy", "name": "Dewy Glass (Original)", "size": "30ml", "price": 98.0, "colorHex": "#E5D6C8", "image": "/images/elora-hero-serum.jpg"},
                {"id": "hero-golden", "name": "Golden Hour Glow", "size": "30ml", "price": 104.0, "colorHex": "#CFA775", "image": "/images/elora-serum-golden.jpg"},
                {"id": "hero-jumbo", "name": "Jumbo Reserve", "size": "50ml", "price": 148.0, "colorHex": "#9E7E5A", "image": "/images/elora-hero-serum.jpg"}
            ],
            "key_actives": [
                "French Alpine Rose Stem Cells",
                "5-Tier Oligo Hyaluronic Acid",
                "5% Bio-Active Niacinamide",
                "Cold-Pressed Botanical Squalane"
            ],
            "clinical_metrics": [
                {"label": "saw instant luminous radiance", "value": "94%"},
                {"label": "measured continuous barrier hydration", "value": "98%"},
                {"label": "noted visible micro-texture smoothing", "value": "91%"}
            ],
            "texture": "Lightweight golden silky nectar with immediate dewy absorption and zero tacky residue.",
            "ritual": "Warm 3–4 drops between palms. Press gently into cleansed damp skin morning and night, sweeping upwards along jawline and cheekbones."
        }
    },
    {
        "slug": "glazing-milk",
        "name": "Glazing Milk Essence",
        "brand": "Élora",
        "category": "Essences",
        "shade": "Translucent Dew",
        "subtitle": "Lait Glacé Micro-Infusion",
        "price": 115.00,
        "stock": 180,
        "volume": "140 ml / 4.7 fl oz",
        "rating": 5.0,
        "reviews_count": 189,
        "badge": "Best of Beauty 2026",
        "is_hero": False,
        "image_url": "/images/elora-glazing-milk.jpg",
        "secondary_image": "/images/glazing-milk-martini.jpg",
        "description": "A nutrient-dense, micro-emulsified ceramide facial essence designed to drench skin in barrier-strengthening dew for an immediate glazed, glass-skin gleam.",
        "details": {
            "variants": [
                {"id": "milk-standard", "name": "Standard Reserve (140ml)", "size": "140ml", "price": 115.0, "colorHex": "#F6F0E8", "image": "/images/elora-glazing-milk.jpg"}
            ],
            "key_actives": [
                "French Alpine Rose Stem Cells",
                "Micronized Ceramide Tri-Complex (NP, AP, EOP)",
                "5-Tier Oligo Hyaluronic Acid",
                "Cold-Pressed Botanical Squalane"
            ],
            "clinical_metrics": [
                {"label": "measured continuous 24-hr locked moisture", "value": "98%"},
                {"label": "reported instant dewy glass-skin radiance", "value": "94%"},
                {"label": "confirmed reduction in redness & sensitivity", "value": "91%"}
            ],
            "texture": "Lightweight milky micro-emulsion that melts into a glassy, drenching dew with zero tackiness.",
            "ritual": "Shake gently. Splash 3–5 drops into warm palms and press into cleansed face, neck, and décolletage before serums."
        }
    },
    {
        "slug": "elixir",
        "name": "The Glazed Barrier Elixir",
        "brand": "Élora",
        "category": "Tinted Skincare",
        "shade": "Opal Glaze",
        "subtitle": "Radiance Filter & Lipid Shield",
        "price": 128.00,
        "stock": 95,
        "volume": "50 ml / 1.7 fl oz",
        "rating": 4.90,
        "reviews_count": 89,
        "badge": "Élora Signature",
        "is_hero": True,
        "image_url": "/images/products/elixir-packshot.jpg",
        "secondary_image": "/elixir-model-hover.jpg",
        "description": "Sheer tinted barrier skincare formulated with micronized reflective pearls and biomimetic skin lipids for an all-day filtered glaze finish.",
        "details": {
            "variants": [
                {"id": "opal-glaze", "name": "Opal Glaze (01)", "size": "50ml", "price": 128.0, "colorHex": "#E3CFD2", "image": "/images/opal-glaze.png"},
                {"id": "rose-glace", "name": "Rosé Glacé (02)", "size": "50ml", "price": 128.0, "colorHex": "#E1B2A7", "image": "/images/rose-glace.png"},
                {"id": "miel-dore", "name": "Miel Doré (03)", "size": "50ml", "price": 128.0, "colorHex": "#AA765B", "image": "/images/miel-dore.png"},
                {"id": "cacao-glace", "name": "Cacao Glacé (04)", "size": "50ml", "price": 128.0, "colorHex": "#5D3E33", "image": "/images/cacao-glace.png"}
            ],
            "key_actives": [
                "Alpine Rose Phyto-Peptides",
                "Crushed Micronized Pearl Veil",
                "Plant Squalane & Meadowfoam Seed Oil",
                "Centella Asiatica Soothing Complex"
            ],
            "clinical_metrics": [
                {"label": "all-day continuous sheer glass finish", "value": "96%"},
                {"label": "skin felt plumped and fortified", "value": "93%"}
            ],
            "texture": "Silken veil that blends effortlessly with fingers or sponge, drying down to an ethereal non-greasy gleam.",
            "ritual": "Dispense 1 pump onto fingers and blend outwards from center of face for an effortless sheer glow."
        }
    },
    {
        "slug": "brume",
        "name": "Peptide Lip Tint",
        "brand": "Élora",
        "category": "Lips",
        "shade": "Soft Glaze",
        "subtitle": "Restorative High-Shine Cushion",
        "price": 54.00,
        "stock": 210,
        "volume": "15 ml / 0.5 fl oz",
        "rating": 4.80,
        "reviews_count": 142,
        "badge": "Élora Exclusive",
        "is_hero": False,
        "image_url": "/images/products/mist-packshot.jpg",
        "secondary_image": "/images/products/liptint-cake-hover.jpg",
        "description": "Richly hydrating peptide lip treatment infused with rich botanical butters for a soft, glossy tint that never feels sticky.",
        "details": {
            "variants": [
                {"id": "ribbon", "name": "Ribbon Tint", "size": "15ml", "price": 54.0, "colorHex": "#ECA0A5", "image": "/public/strawberrytint.png"},
                {"id": "toast", "name": "Teddy Toast", "size": "15ml", "price": 54.0, "colorHex": "#B07D62", "image": "/images/teddytoast.png"},
                {"id": "raspberry", "name": "Raspberry Jelly", "size": "15ml", "price": 54.0, "colorHex": "#B33951", "image": "/public/rasberrytint.png"},
                {"id": "butterscotch", "name": "Butterscotch Glaze", "size": "15ml", "price": 54.0, "colorHex": "#DDA15E", "image": "/public/butterscotchtint.png"}
            ],
            "key_actives": [
                "Palmitoyl Tripeptide-38",
                "Cupuaçu Botanical Butter",
                "Plum Kernel Bio-Ceramides",
                "Vitamin E Tocopherol"
            ],
            "clinical_metrics": [
                {"label": "instant cushion and plumping effect", "value": "99%"},
                {"label": "softened dry lip flaking", "value": "97%"}
            ],
            "texture": "Plush cushion glaze that hugs lips comfortably with high refractive sheen.",
            "ritual": "Swipe across lips throughout the day or layer over lip pencil."
        }
    },
    {
        "slug": "nectar",
        "name": "Barrier Repair Nectar",
        "brand": "Élora",
        "category": "Treatments",
        "shade": "Golden Dew",
        "subtitle": "Alpine Rose Cellular Infusion",
        "price": 48.00,
        "stock": 130,
        "volume": "30 ml / 1.0 fl oz",
        "rating": 4.90,
        "reviews_count": 428,
        "badge": "Community Favorite",
        "is_hero": False,
        "image_url": "/images/products/nectar-packshot.jpg",
        "secondary_image": "/images/products/nectar-texture.jpg",
        "description": "Concentrated reparative nectar targeting compromised skin barriers, redness, and dehydration with concentrated French Alpine rose extracts.",
        "details": {
            "variants": [
                {"id": "nectar-30", "name": "Standard Nectar", "size": "30ml", "price": 48.0, "colorHex": "#DFC4A8", "image": "/images/products/nectar-packshot.jpg"}
            ],
            "key_actives": [
                "French Alpine Rose Nectar",
                "Phyto-Collagen Biopolymers",
                "Panthenol Provitamin B5",
                "Allantoin Botanical Soother"
            ],
            "clinical_metrics": [
                {"label": "immediate reduction in skin tightness", "value": "96%"},
                {"label": "reinforced epidermal moisture barrier", "value": "94%"}
            ],
            "texture": "Dewy honey-gel nectar that instantly absorbs with cooling calming relief.",
            "ritual": "Apply 2-3 pumps onto clean skin before moisturizer."
        }
    },
    {
        "slug": "creme-lumineuse",
        "name": "Crème Lumineuse",
        "brand": "Élora",
        "category": "Creams",
        "shade": "Alabaster",
        "subtitle": "Velvet Moisture Soufflé",
        "price": 115.00,
        "stock": 110,
        "volume": "50 ml / 1.7 fl oz",
        "rating": 4.92,
        "reviews_count": 276,
        "badge": "Night Ritual",
        "is_hero": False,
        "image_url": "/images/elora-cream-jar.jpg",
        "secondary_image": "/images/products/creme-swatch.jpg",
        "description": "A barrier-replenishing moisture soufflé enriched with cold-pressed French plum seed ceramides, bakuchiol, and multi-peptide complexes. Envelops skin in sustained hydration while you rest.",
        "details": {
            "variants": [
                {"id": "creme-standard", "name": "Glass Jar (50ml)", "size": "50ml", "price": 115.0, "colorHex": "#FAF0E4", "image": "/images/elora-cream-jar.jpg"}
            ],
            "key_actives": [
                "Cold-Pressed Plum Seed Ceramides",
                "1.5% Phyto-Retinol Bakuchiol",
                "Micro-Algae Cellular Peptides",
                "Shea Nilotica Butter"
            ],
            "clinical_metrics": [
                {"label": "sustained 24-hr moisture barrier lock", "value": "98%"},
                {"label": "woke up with noticeably firmer, radiant skin", "value": "92%"}
            ],
            "texture": "Decadent whipped velvet soufflé that melts on skin contact without leaving a greasy sheen.",
            "ritual": "Scoop a dime-sized amount with the gold spatula. Massage into face, neck, and décolletage as the final step of your evening ritual."
        }
    },
    {
        "slug": "botanical-mist",
        "name": "Botanical Dew Mist",
        "brand": "Élora",
        "category": "Mists",
        "shade": "Alpine Rose",
        "subtitle": "Hydra-Floral Micro-Essence",
        "price": 54.00,
        "stock": 160,
        "volume": "100 ml / 3.4 fl oz",
        "rating": 4.88,
        "reviews_count": 154,
        "badge": "Everyday Essential",
        "is_hero": False,
        "image_url": "/images/elora-botanical-rose.jpg",
        "secondary_image": "/images/elora-hero-serum.jpg",
        "description": "Micro-diffused floral hydro-infusion distilled from high-altitude French Alpine Roses and electrolyte-rich spring waters. Prepares the skin mantle for optimal serum absorption.",
        "details": {
            "variants": [
                {"id": "mist-rose", "name": "Alpine Rose Hydrosol", "size": "100ml", "price": 54.0, "colorHex": "#E9C2C2", "image": "/images/elora-botanical-rose.jpg"}
            ],
            "key_actives": [
                "Pure Alpine Rose Hydrosol",
                "Wild French Lavender Water",
                "Cellular Ectoin Protection",
                "Vegetal Glycerin Complex"
            ],
            "clinical_metrics": [
                {"label": "instant barrier comfort & refresh", "value": "97%"},
                {"label": "enhanced subsequent serum absorption", "value": "95%"}
            ],
            "texture": "Ultra-fine crystalline botanical mist with a subtle whisper of dawn-harvested rose.",
            "ritual": "Mist generously over bare face before serums or anytime throughout the day to recharge your skin’s botanical dew."
        }
    },
    {
        "slug": "bundle-the-ritual",
        "name": "The Complete 3-Step Radiance Routine",
        "brand": "Élora",
        "category": "Bundles",
        "shade": "Complete Routine",
        "subtitle": "Complete Alpine Skin Transformation",
        "price": 235.00,
        "stock": 45,
        "volume": "Full Routine (3 items)",
        "rating": 4.98,
        "reviews_count": 520,
        "badge": "15% Off Ritual",
        "is_hero": False,
        "image_url": "/images/values-bottles.jpg",
        "secondary_image": "/images/elora-bottles.jpg",
        "description": "Includes Botanical Dew Mist (100ml), The Hero Serum (30ml), and Crème Lumineuse (50ml). A daily morning and night ritual for clinical barrier rejuvenation.",
        "details": {
            "variants": [],
            "key_actives": [
                "Alpine Rose Stem Cells",
                "Triple Ceramide Complex",
                "5-Tier Hyaluronic Acid"
            ],
            "clinical_metrics": [
                {"label": "measured barrier improvement", "value": "98%"}
            ],
            "texture": "Three-phase ritual: mist, nectar, soufflé.",
            "ritual": "Step 1: Mist. Step 2: Serum. Step 3: Crème."
        }
    }
]


async def sync_products():
    print("Connecting to Supabase to synchronize final boutique products...")
    async with async_session() as db:
        updated_count = 0
        inserted_count = 0

        for item in FINAL_BOUTIQUE_PRODUCTS:
            # Check by slug or name
            query = select(Product).where(
                (Product.slug == item["slug"]) | (Product.name == item["name"])
            )
            res = await db.execute(query)
            existing = res.scalars().first()

            if existing:
                existing.name = item["name"]
                existing.brand = item["brand"]
                existing.category = item["category"]
                existing.shade = item["shade"]
                existing.subtitle = item["subtitle"]
                existing.price = item["price"]
                existing.stock = item["stock"]
                existing.volume = item["volume"]
                existing.rating = item["rating"]
                existing.reviews_count = item["reviews_count"]
                existing.badge = item["badge"]
                existing.is_hero = item["is_hero"]
                existing.image_url = item["image_url"]
                existing.secondary_image = item["secondary_image"]
                existing.description = item["description"]
                existing.details = item["details"]
                updated_count += 1
            else:
                new_p = Product(
                    slug=item["slug"],
                    name=item["name"],
                    brand=item["brand"],
                    category=item["category"],
                    shade=item["shade"],
                    subtitle=item["subtitle"],
                    price=item["price"],
                    stock=item["stock"],
                    volume=item["volume"],
                    rating=item["rating"],
                    reviews_count=item["reviews_count"],
                    badge=item["badge"],
                    is_hero=item["is_hero"],
                    image_url=item["image_url"],
                    secondary_image=item["secondary_image"],
                    description=item["description"],
                    details=item["details"],
                )
                db.add(new_p)
                inserted_count += 1

        await db.commit()
        print(f"[OK] Products sync complete: {updated_count} updated, {inserted_count} inserted into Supabase!")


if __name__ == "__main__":
    asyncio.run(sync_products())
