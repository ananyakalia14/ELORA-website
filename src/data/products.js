export const PRODUCTS = [
  {
    id: 'hero-serum',
    name: 'The Hero Serum',
    category: 'Serums',
    subtitle: 'Radiant Cellular Infusion',
    price: 98,
    volume: '30 ml / 1.0 fl oz',
    rating: 4.95,
    reviewsCount: 342,
    badge: 'Signature Hero',
    isHero: true,
    description:
      'A multi-corrective botanical elixir formulated with cold-pressed French Alpine Rose stem cells and 5-tier oligo-hyaluronic acid. Deeply quenches cellular thirst, smooths micro-texture, and unveils an ethereal glass-skin glow within 7 days.',
    image: '/images/elora-hero-serum.jpg',
    secondaryImage: '/images/elora-botanical-rose.jpg',
    variants: [
      {
        id: 'hero-dewy',
        name: 'Dewy Glass (Original)',
        size: '30ml',
        price: 98,
        colorHex: '#E5D6C8',
        image: '/images/elora-hero-serum.jpg'
      },
      {
        id: 'hero-golden',
        name: 'Golden Hour Glow',
        size: '30ml',
        price: 104,
        colorHex: '#CFA775',
        image: '/images/elora-serum-golden.jpg'
      },
      {
        id: 'hero-jumbo',
        name: 'Jumbo Reserve',
        size: '50ml',
        price: 148,
        colorHex: '#9E7E5A',
        image: '/images/elora-hero-serum.jpg'
      }
    ],
    keyActives: [
      'French Alpine Rose Stem Cells',
      '5-Tier Oligo Hyaluronic Acid',
      '5% Bio-Active Niacinamide',
      'Cold-Pressed Botanical Squalane'
    ],
    clinicalMetrics: [
      { label: 'saw instant luminous radiance', value: '94%' },
      { label: 'measured continuous barrier hydration', value: '98%' },
      { label: 'noted visible micro-texture smoothing', value: '91%' }
    ],
    texture: 'Lightweight golden silky nectar with immediate dewy absorption and zero tacky residue.',
    ritual:
      'Warm 3–4 drops between palms. Press gently into cleansed damp skin morning and night, sweeping upwards along jawline and cheekbones.'
  },
  {
    id: 'glazing-milk',
    name: 'Glazing Milk Essence',
    category: 'Essences',
    subtitle: 'Lait Glacé Micro-Infusion',
    price: 115,
    volume: '140 ml / 4.7 fl oz',
    rating: 5.0,
    reviewsCount: 189,
    badge: 'Bestseller',
    isHero: false,
    isGlazingMilk: true,
    description:
      'A nutrient-dense, micro-emulsified ceramide facial essence designed to drench skin in barrier-strengthening dew for an immediate glazed, glass-skin gleam.',
    image: '/images/glazing-milk-martini.jpg',
    secondaryImage: '/images/elora-glazing-milk.jpg',
    variants: [
      {
        id: 'milk-standard',
        name: 'Standard Reserve (140ml)',
        size: '140ml',
        price: 115,
        colorHex: '#F6F0E8',
        image: '/images/glazing-milk-martini.jpg'
      }
    ],
    keyActives: [
      'French Alpine Rose Stem Cells',
      'Micronized Ceramide Tri-Complex (NP, AP, EOP)',
      '5-Tier Oligo Hyaluronic Acid',
      'Cold-Pressed Botanical Squalane'
    ],
    clinicalMetrics: [
      { label: 'measured continuous 24-hr locked moisture', value: '98%' },
      { label: 'reported instant dewy glass-skin radiance', value: '94%' },
      { label: 'confirmed reduction in redness & sensitivity', value: '91%' }
    ],
    texture: 'Lightweight milky micro-emulsion that melts into a glassy, drenching dew with zero tackiness.',
    ritual:
      'Shake gently. Splash 3–5 drops into warm palms and press into cleansed face, neck, and décolletage before serums.'
  },
  {
    id: 'creme-lumineuse',
    name: 'Crème Lumineuse',
    category: 'Moisturizers',
    subtitle: 'Deep Cellular Moisture Recovery',
    price: 115,
    volume: '50 ml / 1.7 fl oz',
    rating: 4.92,
    reviewsCount: 218,
    badge: 'Bestseller',
    isHero: false,
    description:
      'A cushiony, whipped bio-lipid cream that melts effortlessly into the dermis to replenish lipid reserves, seal essential moisture, and shield against modern oxidative stress.',
    image: '/images/elora-cream-jar.jpg',
    secondaryImage: '/images/elora-hero-skin.jpg',
    variants: [
      {
        id: 'creme-rich',
        name: 'Rich Cashmere Soufflé',
        size: '50ml',
        price: 115,
        colorHex: '#F6F0E8',
        image: '/images/elora-cream-jar.jpg'
      },
      {
        id: 'creme-dew-gel',
        name: 'Light Hydrating Dew Gel',
        size: '50ml',
        price: 98,
        colorHex: '#E2D8CC',
        image: '/images/elora-cream-jar.jpg'
      },
      {
        id: 'creme-barrier-balm',
        name: 'Intensive Barrier Balm',
        size: '60ml',
        price: 125,
        colorHex: '#C9BAA8',
        image: '/images/elora-cream-jar.jpg'
      }
    ],
    keyActives: [
      'French Plum Kernel Oil',
      'Triple Ceramide Complex (NP, AP, EOP)',
      'Alpine Edelweiss Extract',
      'Cold-Spun Shea Ester'
    ],
    clinicalMetrics: [
      { label: 'reported 24-hr locked moisture', value: '96%' },
      { label: 'visible firming rebound restored', value: '92%' },
      { label: 'calmed environmental redness', value: '95%' }
    ],
    texture: 'Velvety whipped cashmere soufflé with a cushiony, breathable satin finish.',
    ritual:
      'Smooth a hazelnut-sized portion across face, neck, and décolletage as the final sealing step of your evening ritual.'
  },
  {
    id: 'botanical-mist',
    name: 'Botanical Dew Mist',
    category: 'Mists',
    subtitle: 'Alpine Rose Cellular Water',
    price: 54,
    volume: '100 ml / 3.4 fl oz',
    rating: 4.88,
    reviewsCount: 145,
    badge: 'Daily Essential',
    isHero: false,
    description:
      'Micro-diffused floral hydro-infusion distilled from high-altitude French Alpine Roses and electrolyte-rich spring waters. Prepares the skin mantle for optimal serum absorption.',
    image: '/images/elora-botanical-rose.jpg',
    secondaryImage: '/images/elora-hero-serum.jpg',
    variants: [
      {
        id: 'mist-rose',
        name: 'Alpine Rose Hydrosol',
        size: '100ml',
        price: 54,
        colorHex: '#E9C2C2',
        image: '/images/elora-botanical-rose.jpg'
      },
      {
        id: 'mist-neroli',
        name: 'Orange Blossom & Ectoin',
        size: '100ml',
        price: 58,
        colorHex: '#F0D1A7',
        image: '/images/elora-botanical-rose.jpg'
      }
    ],
    keyActives: [
      'Pure Alpine Rose Hydrosol',
      'Wild French Lavender Water',
      'Cellular Ectoin Protection',
      'Vegetal Glycerin Complex'
    ],
    clinicalMetrics: [
      { label: 'instant barrier comfort & refresh', value: '97%' },
      { label: 'enhanced subsequent serum absorption', value: '95%' }
    ],
    texture: 'Ultra-fine crystalline botanical mist with a subtle whisper of dawn-harvested rose.',
    ritual:
      'Mist generously over bare face before serums or anytime throughout the day to recharge your skin’s botanical dew.'
  },
  {
    id: 'lip-glaze',
    name: 'Peptide Lip Tint Treatment',
    category: 'Treatments',
    subtitle: 'Restorative Glaze & Barrier Cushion',
    price: 24,
    volume: '10 ml / 0.3 fl oz',
    rating: 4.96,
    reviewsCount: 412,
    badge: 'Élora Favorite',
    isHero: false,
    description:
      'A cushiony, peptide-rich glaze treatment that restores dry lips, boosts natural volume, and locks in dewy hydration with a high-shine satin gleam.',
    image: '/images/peptide-lip-tint-balm.jpg',
    secondaryImage: '/images/elora-hero-skin.jpg',
    variants: [
      {
        id: 'lip-taupe',
        name: 'Soft Taupe Clay',
        size: '10ml',
        price: 24,
        colorHex: '#A37E6F',
        image: '/images/peptide-lip-tint-balm.jpg'
      },
      {
        id: 'lip-rose',
        name: 'Glazed Rose Vanilla',
        size: '10ml',
        price: 24,
        colorHex: '#CC918F',
        image: '/images/peptide-lip-tint-balm.jpg'
      },
      {
        id: 'lip-clear',
        name: 'Clear Nectar',
        size: '10ml',
        price: 24,
        colorHex: '#E8D5BC',
        image: '/images/peptide-lip-tint-balm.jpg'
      }
    ],
    keyActives: [
      'Palmitoyl Tripeptide-38',
      'Cold-Pressed Cupuaçu Butter',
      'French Alpine Shea Ester',
      'Botanical Squalane'
    ],
    clinicalMetrics: [
      { label: 'instant plumping lip hydration', value: '99%' },
      { label: 'softened flaking micro-creases', value: '96%' }
    ],
    texture: 'Rich, glossy glaze that melts onto lips without sticking or feathering.',
    ritual:
      'Glide over bare lips day or night for an instant cushiony barrier glow.'
  }
];

export const CROSS_SELL_PRODUCTS = [
  {
    id: 'cross-lip-glaze',
    productId: 'lip-glaze',
    name: 'Peptide Lip Tint',
    variantName: 'Soft Taupe Clay',
    price: 24,
    image: '/images/peptide-lip-tint-balm.jpg',
    volume: '10ml'
  },
  {
    id: 'cross-mist',
    productId: 'botanical-mist',
    name: 'Dew Mist Mini',
    variantName: 'Alpine Rose',
    price: 28,
    image: '/images/elora-botanical-rose.jpg',
    volume: '50ml'
  },
  {
    id: 'cross-serum-travel',
    productId: 'hero-serum',
    name: 'Hero Serum Travel',
    variantName: 'Discovery Size',
    price: 38,
    image: '/images/elora-hero-serum.jpg',
    volume: '15ml'
  }
];

export const ROUTINE_BUNDLE = {
  id: 'bundle-the-ritual',
  name: 'The Complete 3-Step Radiance Routine',
  originalPrice: 267, // $54 + $98 + $115
  bundlePrice: 235,
  discountPercent: 15,
  items: [
    { id: 'botanical-mist', name: 'Botanical Dew Mist', volume: '100ml', price: 54, image: '/images/elora-botanical-rose.jpg' },
    { id: 'hero-serum', name: 'The Hero Serum', volume: '30ml', price: 98, image: '/images/elora-hero-serum.jpg' },
    { id: 'creme-lumineuse', name: 'Crème Lumineuse', volume: '50ml', price: 115, image: '/images/elora-cream-jar.jpg' }
  ]
};

export const CLINICAL_STATS = [
  {
    percentage: '94%',
    title: 'Saw Brighter Skin',
    description: 'Measured via digital spectrophotometer in a double-blind 28-day trial.'
  },
  {
    percentage: '98%',
    title: 'Noticed Deep Barrier Repair',
    description: 'Statistically significant reduction in transepidermal water loss (TEWL).'
  },
  {
    percentage: '100%',
    title: 'Experienced Zero Irritation',
    description: 'Dermatologist verified on sensitive, reactive, and eczema-prone profiles.'
  }
];

export const KEY_ACTIVES_ACCORDION = [
  {
    id: 'active-ectoin',
    name: 'Ectoin Cellular Shield',
    origin: 'Natural Extremolyte Bio-Fermentation',
    role: 'Osmoprotective Membrane Shield',
    description:
      'Discovered in desert halophilic micro-organisms, Ectoin forms a dense hydro-complex around cellular proteins and cell membranes, preventing dehydration shock, environmental pollution damage, and inflammation.'
  },
  {
    id: 'active-rose',
    name: 'French Alpine Rose Stem Cells',
    origin: 'Hand-Harvested at 3,000m altitude in French Alps',
    role: 'Epigenetic Longevity & Antioxidant Defense',
    description:
      'Grown in sub-zero alpine climates with intense UV radiation, these hardy stem cells stimulate human epidermal skin cell vitality by 80%, preserving skin barrier stem cell characteristics and defending against photo-aging.'
  },
  {
    id: 'active-hyaluronic',
    name: '5-Tier Oligo Hyaluronic Acid',
    origin: 'Multi-Molecular Botanical Biotechnology',
    role: 'Multi-Depth Epidermal & Dermal Infusion',
    description:
      'Spanning 5 distinct molecular sizes: high molecular weight (2,000 kDa) locks the surface barrier; medium weights quench intercellular pathways; ultra-low 5 kDa oligo-peptides reach deep dermal fibroblast matrix to plump fine micro-creases.'
  },
  {
    id: 'active-squalane',
    name: 'French Botanical Squalane & Plum Kernel',
    origin: 'Cold-Pressed in Grasse, France',
    role: 'Biomimetic Lipid Replenishment',
    description:
      'Never heated beyond 32°C. 100% plant-derived squalane and cold-pressed Ente Plum oil mirror the skin’s natural sebum matrix, delivering essential Omega 6 & 9 fatty acids without clogging pores or leaving oily film.'
  }
];

export const TRUST_BADGES = [
  {
    title: 'Dermatologist Approved',
    subtitle: 'Tested on sensitive skin protocols',
    icon: 'ShieldCheck'
  },
  {
    title: '94% Saw Brighter Skin',
    subtitle: 'Double-blind 28-day clinical study',
    icon: 'Sparkles'
  },
  {
    title: 'Vegan & Cruelty-Free',
    subtitle: 'Leaping Bunny certified standard',
    icon: 'Feather'
  },
  {
    title: 'Sustainable French Glass',
    subtitle: '100% recyclable, UV protective',
    icon: 'Droplets'
  }
];

export const PRESS_QUOTES = [
  {
    quote: "Elegance is the only beauty that never fades.",
    attribution: "— AUDREY HEPBURN"
  },
  {
    quote: "If you’re sad, if you are disappointed in love, put on your makeup, give yourself some beauty care, put on lipstick, and attack.",
    attribution: "— COCO CHANEL"
  },
  {
    quote: "Why change? Everyone has his own style. When you have found it, you should stick to it.",
    attribution: "— AUDREY HEPBURN"
  },
  {
    quote: "I’m offhand and casual about makeup.",
    attribution: "— MARY TYLER MOORE"
  },
  {
    quote: "Beauty begins the moment you decide to be yourself.",
    attribution: "— COCO CHANEL"
  },
  {
    quote: "Beauty is its own kind of emotional intelligence—a map for all the things we value and think to be true.",
    attribution: "HARPER’S BAZAAR — BEAUTY ISSUE"
  },
  {
    quote: "Beauty means something different to each and every one of us.",
    attribution: "HARPER’S BAZAAR — BEAUTY ISSUE"
  },
  {
    quote: "The cosmetics you choose should accentuate the skin you’re in.",
    attribution: "VOGUE — BEAUTY EDIT"
  },
  {
    quote: "Beauty is a ritual, an art, a way of seeing.",
    attribution: "HARPER’S BAZAAR — BEAUTY ISSUE"
  },
  {
    quote: "Less is more when it comes to your makeup look.",
    attribution: "HARPER’S BAZAAR — BEAUTY EDITORS"
  },
  {
    quote: "Makeup is a way to play and experiment.",
    attribution: "VOGUE — BEAUTY SECRETS"
  }
];

