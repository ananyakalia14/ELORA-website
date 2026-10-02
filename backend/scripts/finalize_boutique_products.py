"""Finalize and sync the exact frontend boutique products into PostgreSQL / Supabase,
clean out old mock records, and update data/elora_products.json.
Usage: python -m scripts.finalize_boutique_products
"""

import asyncio
import json
import sys
from decimal import Decimal
from sqlalchemy import select, text
from app.db import async_session
from app.models import Product, OrderItem

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

FINAL_CARD_PRODUCTS = [
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
        "is_hero": True,
        "image_url": "/images/elora-glazing-milk.jpg",
        "secondary_image": "/images/products/creme-swatch.jpg",
        "description": "Milky ceramide essence for a glazed, barrier-strengthened finish. Drenches skin in nutrient-dense botanical lipids for an instant glass-skin gleam.",
        "details": {
            "card_subtitle": "Prep & Glaze",
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
        "description": "Peptide lip tint with a soft, glossy finish. Infused with rich botanical butters and plumping peptides for long-lasting cushion and volume.",
        "details": {
            "card_subtitle": "Tint & Cushion",
            "key_actives": [
                "Palmitoyl Tripeptide-38",
                "Cupuaçu Botanical Butter",
                "French Alpine Shea Ester",
                "Botanical Squalane"
            ],
            "clinical_metrics": [
                {"label": "instant cushion and plumping effect", "value": "99%"},
                {"label": "softened dry lip flaking", "value": "97%"}
            ],
            "texture": "Rich, glossy glaze that melts onto lips without sticking or feathering.",
            "ritual": "Glide over bare lips day or night for an instant cushiony barrier glow."
        }
    },
    {
        "slug": "elixir",
        "name": "The Glazed Barrier Elixir",
        "brand": "Élora",
        "category": "Tinted Skincare",
        "shade": "Sheer Dew",
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
        "description": "Tinted skincare for a sheer, glazed finish. Formulated with micronized reflective pearls and biomimetic skin lipids for an all-day filtered glaze finish.",
        "details": {
            "card_subtitle": "Flush & Filter",
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
        "slug": "hero-serum",
        "name": "The Hero Serum / Color, The Élora Way",
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
        "secondary_image": "/images/products/serum-texture.jpg",
        "description": "A little flush, wherever you want it. Multi-corrective botanical elixir formulated with cold-pressed French Alpine Rose stem cells and 5-tier oligo-hyaluronic acid.",
        "details": {
            "card_subtitle": "Cellular Infusion",
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
        "badge": "Élora Exclusive",
        "is_hero": False,
        "image_url": "/images/products/nectar-packshot.jpg",
        "secondary_image": "/images/products/nectar-texture.jpg",
        "description": "Alpine rose cellular infusion. Concentrated reparative nectar targeting compromised skin barriers, redness, and dehydration with concentrated French Alpine rose extracts.",
        "details": {
            "card_subtitle": "Nourish & Repair",
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
        "secondary_image": "/images/products/mist-lifestyle.jpg",
        "description": "Micro-diffused floral hydro-infusion distilled from high-altitude French Alpine Roses and electrolyte-rich spring waters. Prepares the skin mantle for optimal serum absorption.",
        "details": {
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
        "description": "The quintessential Élora radiance trilogy: Botanical Dew Mist (100ml) to prep, The Hero Serum (30ml) to infuse, and Crème Lumineuse (50ml) to lock in continuous cellular dew.",
        "details": {
            "bundle_items": [
                {"name": "Botanical Dew Mist", "size": "100ml", "value": 54.0},
                {"name": "The Hero Serum", "size": "30ml", "value": 98.0},
                {"name": "Crème Lumineuse", "size": "50ml", "value": 115.0}
            ],
            "savings": "$32.00 savings (15% off full price)",
            "ritual": "Step 1: Mist generously. Step 2: Press 3-4 drops of Hero Serum. Step 3: Seal with velvety Crème Lumineuse."
        }
    },
    {
        "slug": "lip-liner",
        "name": "The Élora Lip Liner",
        "brand": "Élora",
        "category": "Lips",
        "shade": "Precision Contour",
        "subtitle": "Velvet Glide Defining Pencil",
        "price": 32.00,
        "stock": 175,
        "volume": "1.2 g / 0.04 oz",
        "rating": 4.94,
        "reviews_count": 215,
        "badge": "Atelier Custom",
        "is_hero": False,
        "image_url": "/images/LIPLINER.png",
        "secondary_image": "/images/elora-crayon-writing.png",
        "description": "Ultra-creamy botanical contour pencil that sculpts, defines, and enhances natural lip volume with all-day feather-resistant wear.",
        "details": {
            "key_actives": [
                "French Alpine Meadowfoam Seed Oil",
                "Cold-Pressed Plum Kernel Butter",
                "Vitamin E",
                "Biomimetic Squalane"
            ],
            "clinical_metrics": [
                {"label": "reported seamless non-dragging glide", "value": "98%"},
                {"label": "feather-resistant wear throughout the day", "value": "95%"}
            ],
            "texture": "Velvety pencil formula that glides like silk and dries down to a transfer-resistant matte contour.",
            "ritual": "Trace the outer contour of lips to sculpt dimension, then soften inward before applying Peptide Lip Tint."
        }
    },
    {
        "slug": "opal-glaze",
        "name": "Opal Glaze (01)",
        "brand": "Élora",
        "category": "Glazes",
        "shade": "Pearly Pink",
        "subtitle": "Luminous Iridescent Reflective Dew",
        "price": 54.00,
        "stock": 140,
        "volume": "65 ml / 2.2 fl oz",
        "rating": 4.90,
        "reviews_count": 176,
        "badge": "Bestseller Shade",
        "is_hero": False,
        "image_url": "/images/opal-glaze.png",
        "secondary_image": "/images/shade-swatches-ref.png",
        "description": "Translucent dewy pearl with sheer iridescent reflection and luminous glass-skin gleam. Apply to bare skin or layer over moisturizer.",
        "details": {
            "undertone": "Cool Dewy Translucent",
            "hex": "#E3CFD2",
            "ritual": "Apply one sweep directly to bare skin or layer over moisturizer for a reflective translucent pearl glaze."
        }
    },
    {
        "slug": "rose-glace",
        "name": "Rosé Glacé (02)",
        "brand": "Élora",
        "category": "Glazes",
        "shade": "Pearly Champagne",
        "subtitle": "Rose-Gold Crushed Petal Sheen",
        "price": 54.00,
        "stock": 165,
        "volume": "65 ml / 2.2 fl oz",
        "rating": 5.0,
        "reviews_count": 248,
        "badge": "Community Favorite",
        "is_hero": False,
        "image_url": "/images/rose-glace.png",
        "secondary_image": "/images/rose-mousse.png",
        "description": "Delicate crushed petal dew with luminous rose-gold champagne sheen and soft, sheer flush for cheekbones and collarbones.",
        "details": {
            "undertone": "Neutral Peachy Champagne",
            "hex": "#E1B2A7",
            "ritual": "Glide across high points of the face, cheekbones, and collarbones for a naturally flushed pearly champagne gleam."
        }
    },
    {
        "slug": "miel-dore",
        "name": "Miel Doré (03)",
        "brand": "Élora",
        "category": "Glazes",
        "shade": "Sunlit Bronze",
        "subtitle": "Golden Honey Glass-Skin Glaze",
        "price": 54.00,
        "stock": 120,
        "volume": "65 ml / 2.2 fl oz",
        "rating": 4.90,
        "reviews_count": 194,
        "badge": "Limited Harvest",
        "is_hero": False,
        "image_url": "/images/miel-dore.png",
        "secondary_image": "/images/honey-glaze-honeycomb.jpg",
        "description": "Sunlit warm bronze with rich golden honey glaze undertones and sun-drenched radiance for an effortless sun-kissed flush.",
        "details": {
            "undertone": "Warm Golden Bronze",
            "hex": "#AA765B",
            "ritual": "Dab onto high points of cheekbones, temples, and shoulders for sun-drenched golden bronze warmth."
        }
    },
    {
        "slug": "cacao-glace",
        "name": "Cacao Glacé (04)",
        "brand": "Élora",
        "category": "Glazes",
        "shade": "Toasted Espresso Bronze",
        "subtitle": "Rich Ganache Multidimensional Glow",
        "price": 54.00,
        "stock": 135,
        "volume": "65 ml / 2.2 fl oz",
        "rating": 5.0,
        "reviews_count": 312,
        "badge": "Iconic Shade",
        "is_hero": False,
        "image_url": "/images/cacao-glace.png",
        "secondary_image": "/images/toasted-teddy-blush.jpg",
        "description": "Deep toasted espresso and rich bronze ganache with velvety warmth and multidimensional gleam inspired by 90s editorial warmth.",
        "details": {
            "undertone": "Deep Rich Bronze",
            "hex": "#67311E",
            "ritual": "Blend across cheeks, bridge of the nose, and décolletage for a 90s-inspired rich bronze wash."
        }
    }
]


async def sync():
    print("Beginning final sync of Élora boutique collection...")
    async with async_session() as session:
        # 1. Upsert or update each boutique product by slug
        boutique_product_ids = []
        for p_data in FINAL_CARD_PRODUCTS:
            slug = p_data["slug"]
            stmt = select(Product).where(Product.slug == slug)
            res = await session.execute(stmt)
            prod = res.scalar_one_or_none()

            if prod:
                # Update existing
                prod.name = p_data["name"]
                prod.brand = p_data["brand"]
                prod.category = p_data["category"]
                prod.shade = p_data["shade"]
                prod.subtitle = p_data["subtitle"]
                prod.price = Decimal(str(p_data["price"]))
                prod.stock = p_data["stock"]
                prod.volume = p_data["volume"]
                prod.rating = Decimal(str(p_data["rating"]))
                prod.reviews_count = p_data["reviews_count"]
                prod.badge = p_data["badge"]
                prod.is_hero = p_data["is_hero"]
                prod.image_url = p_data["image_url"]
                prod.secondary_image = p_data.get("secondary_image")
                prod.description = p_data["description"]
                prod.details = p_data["details"]
                boutique_product_ids.append(prod.id)
                print(f"  ✓ Updated boutique product #{prod.id}: {prod.name} ({slug})")
            else:
                # Insert new
                new_prod = Product(
                    slug=slug,
                    name=p_data["name"],
                    brand=p_data["brand"],
                    category=p_data["category"],
                    shade=p_data["shade"],
                    subtitle=p_data["subtitle"],
                    price=Decimal(str(p_data["price"])),
                    stock=p_data["stock"],
                    volume=p_data["volume"],
                    rating=Decimal(str(p_data["rating"])),
                    reviews_count=p_data["reviews_count"],
                    badge=p_data["badge"],
                    is_hero=p_data["is_hero"],
                    image_url=p_data["image_url"],
                    secondary_image=p_data.get("secondary_image"),
                    description=p_data["description"],
                    details=p_data["details"],
                )
                session.add(new_prod)
                await session.flush()
                boutique_product_ids.append(new_prod.id)
                print(f"  + Added boutique product #{new_prod.id}: {new_prod.name} ({slug})")

        primary_id = boutique_product_ids[0]

        # 2. Check any order_items pointing to non-boutique products and remap them to primary_id
        remap_stmt = text(
            f"UPDATE order_items SET product_id = :primary_id WHERE product_id NOT IN ({','.join(str(i) for i in boutique_product_ids)})"
        )
        res = await session.execute(remap_stmt, {"primary_id": primary_id})
        print(f"  ✓ Remapped {res.rowcount} legacy order_items to #{primary_id}")

        # 3. Delete old dummy/mock products not in our final boutique collection
        delete_stmt = text(
            f"DELETE FROM products WHERE id NOT IN ({','.join(str(i) for i in boutique_product_ids)})"
        )
        del_res = await session.execute(delete_stmt)
        print(f"  ✓ Cleaned up {del_res.rowcount} legacy non-boutique products from database")

        await session.commit()
        print("  ✓ Database transaction committed successfully!")

        # 4. Fetch all active boutique products and update data/elora_products.json
        final_stmt = select(Product).order_by(Product.id.asc())
        all_res = await session.execute(final_stmt)
        all_prods = all_res.scalars().all()

        json_export = []
        for p in all_prods:
            json_export.append({
                "id": p.id,
                "slug": p.slug,
                "name": p.name,
                "brand": p.brand,
                "category": p.category,
                "shade": p.shade,
                "subtitle": p.subtitle,
                "price": float(p.price),
                "stock": p.stock,
                "volume": p.volume,
                "rating": float(p.rating) if p.rating else 5.0,
                "reviews_count": p.reviews_count,
                "badge": p.badge,
                "is_hero": p.is_hero,
                "image_url": p.image_url,
                "secondary_image": p.secondary_image,
                "description": p.description,
                "details": p.details or {}
            })

        with open("data/elora_products.json", "w", encoding="utf-8") as f:
            json.dump(json_export, f, indent=2, ensure_ascii=False)
        print(f"  ✓ Saved {len(json_export)} final products to data/elora_products.json")

    print("Final boutique synchronization completed!")


if __name__ == "__main__":
    asyncio.run(sync())
