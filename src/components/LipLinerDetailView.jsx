import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, Check, Sparkles, Minus, Plus } from 'lucide-react';

/**
 * COLOR, THE ÉLORA WAY — Full-Screen Dedicated Product Detail Page
 * 
 * Luxury editorial visual layout modeled after GlazingMilkDetailView:
 * - Full-bleed campaign photography featuring the 5 iconic lip liner shades (/LIPLINER.png)
 * - Overlaid header with ← BACK TO SHOP, uppercase ÉLORA wordmark, and BAG (count)
 * - Pinned floating frosted buy card with shade selector, quantity pill, accordions, and express bag checkout
 */

const LIPLINER_SHADES = [
  {
    id: 'lean',
    name: 'Lean',
    descriptor: 'warm medium brown',
    colorHex: '#A46750',
    gradient: 'radial-gradient(circle at 35% 35%, #C28268 0%, #A46750 55%, #8A4E38 100%)',
    badge: 'BESTSELLER',
  },
  {
    id: 'stretch',
    name: 'Stretch',
    descriptor: 'neutral mocha brown',
    colorHex: '#8B5949',
    gradient: 'radial-gradient(circle at 35% 35%, #A87361 0%, #8B5949 55%, #6E3F30 100%)',
    badge: 'ICONIC SHADE',
  },
  {
    id: 'flex',
    name: 'Flex',
    descriptor: 'rich neutral brown',
    colorHex: '#5E3A2C',
    gradient: 'radial-gradient(circle at 35% 35%, #7D513F 0%, #5E3A2C 55%, #42251A 100%)',
    badge: 'DEEP SCULPT',
  },
  {
    id: 'spin',
    name: 'Spin',
    descriptor: 'rich plum brown',
    colorHex: '#5C2833',
    gradient: 'radial-gradient(circle at 35% 35%, #7D3E4C 0%, #5C2833 55%, #3E1620 100%)',
    badge: 'EDITORIAL PICK',
  },
  {
    id: 'move',
    name: 'Move',
    descriptor: 'deep cool brown',
    colorHex: '#473431',
    gradient: 'radial-gradient(circle at 35% 35%, #664E4B 0%, #473431 55%, #2B1D1B 100%)',
    badge: 'COOL SCULPT',
  },
];

export default function LipLinerDetailView({
  isOpen,
  onClose,
  onAddToCart,
  onOpenCart,
  cartCount = 0,
}) {
  const [selectedShade, setSelectedShade] = useState(LIPLINER_SHADES[0]);
  const [hoveredShade, setHoveredShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('ritual');

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const productData = {
    id: 'hero-serum',
    productId: 'hero-serum',
    name: 'COLOR, THE ÉLORA WAY',
    subtitle: 'crayon contour des lèvres velours',
    volume: '1.2 g / 0.04 oz',
    price: 98,
    formattedPrice: '$98.00',
    rating: 4.95,
    reviews: 342,
    image: '/LIPLINER.png',
    description:
      'A velvety, ultra-creamy peptide lip shaping pencil that glides with effortless glide to sculpt, contour, and plump the lips with featherlight, all-day smudge-resistant definition.',
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: `${productData.id}-${selectedShade.id}`,
          productId: productData.productId,
          name: `${productData.name} — ${selectedShade.name}`,
          variantName: selectedShade.name,
          price: productData.price,
          volume: productData.volume,
          image: productData.image,
        },
        quantity
      );
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const toggleAccordion = (id) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const activeShade = hoveredShade || selectedShade;

  return (
    <div
      className="fixed inset-0 z-50 w-full h-screen overflow-hidden bg-[#F9F6F0] flex flex-col justify-between elora-pdp-root"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999,
        width: '100%',
        height: '100vh',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#F9F6F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animation: 'pdpSmoothReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${productData.name} Product Detail View`}
    >
      {/* 1. Full-Bleed Background Visual */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#F7F3EE',
        }}
      >
        <img
          src="/LIPLINER.png"
          alt="Élora Color, The Élora Way — Lip Liner Collection"
          className="elora-shade-pdp-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'left center',
            pointerEvents: 'none',
            animation: 'shadeSmoothReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            willChange: 'transform, opacity, filter',
          }}
          loading="eager"
        />
        {/* Luxury Scrim for Legibility on Right Side */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(249, 246, 240, 0) 0%, rgba(249, 246, 240, 0.05) 30%, rgba(249, 246, 240, 0.55) 65%, rgba(249, 246, 240, 0.88) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      </div>

      {/* 2. Overlaid Header */}
      <header
        className="relative z-20 w-full flex items-center justify-between px-6 md:px-14 py-7 select-none elora-pdp-header"
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.75rem 3.5rem',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Back Link */}
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-[0.2em] text-[#3A2E2B] font-medium hover:opacity-70 transition-opacity flex items-center gap-1.5"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#3A2E2B',
            fontWeight: 500,
            transition: 'opacity 0.2s ease',
            padding: '4px 0',
          }}
        >
          ← BACK TO SHOP
        </button>

        {/* Center: Brand Wordmark */}
        <span
          className="font-serif text-2xl md:text-3xl text-[#3A2E2B] font-normal tracking-[0.14em]"
          style={{
            fontFamily: "var(--font-serif-display, 'Italiana', 'Cormorant Garamond', Georgia, serif)",
            fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
            color: '#3A2E2B',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}
        >
          ÉLORA
        </span>

        {/* Right: Cart Status */}
        <button
          onClick={() => {
            if (onOpenCart) onOpenCart();
          }}
          className="text-xs uppercase tracking-[0.2em] text-[#3A2E2B] font-medium hover:opacity-70 transition-opacity"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#3A2E2B',
            fontWeight: 500,
            transition: 'opacity 0.2s ease',
            padding: '4px 0',
          }}
        >
          BAG ({cartCount})
        </button>
      </header>

      {/* 3. Main Center Layout with Right-Pinned Buy Card */}
      <main
        className="relative z-10 flex-1 w-full flex items-center justify-end px-6 md:px-14 pb-8 elora-pdp-main"
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 3.5rem 2rem 3.5rem',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Floating Luxury Buy Card */}
        <div
          className="w-full max-w-[440px] rounded-[28px] p-8 md:p-10 flex flex-col gap-5 border border-white/60 shadow-[0_20px_50px_rgba(58,46,43,0.12)] elora-pdp-card"
          style={{
            width: '100%',
            maxWidth: '450px',
            borderRadius: '28px',
            padding: '2.6rem 2.25rem 2.25rem 2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.35rem',
            backgroundColor: 'rgba(255, 255, 255, 0.90)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 24px 60px rgba(58, 46, 43, 0.12)',
            boxSizing: 'border-box',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {/* Eyebrow & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontFamily: "var(--font-sans, 'Montserrat', sans-serif)",
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: '#8A7E72',
                fontWeight: 600,
              }}
            >
              SIGNATURE HERO • LA COULEUR
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#6E473B',
                fontWeight: 600,
                backgroundColor: 'rgba(164, 103, 80, 0.12)',
                padding: '4px 10px',
                borderRadius: '100px',
              }}
            >
              {activeShade.badge}
            </span>
          </div>

          {/* Product Title */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif-display, 'Italiana', 'Cormorant Garamond', Georgia, serif)",
                fontSize: 'clamp(1.75rem, 2.2vw, 2.3rem)',
                color: '#3A2E2B',
                fontWeight: 400,
                lineHeight: 1.18,
                margin: 0,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              COLOR,&nbsp; THE ÉLORA WAY
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                fontStyle: 'italic',
                fontSize: '0.92rem',
                color: '#706458',
                marginTop: '6px',
                marginBottom: 0,
              }}
            >
              {productData.subtitle}
            </p>
          </div>

          {/* Rating & Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill="#C4A265"
                  color="#C4A265"
                />
              ))}
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                color: '#3A2E2B',
                fontWeight: 600,
              }}
            >
              {productData.rating}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#8A7E72',
              }}
            >
              ({productData.reviews} reviews)
            </span>
          </div>

          {/* Price & Volume */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span
              style={{
                fontSize: '1.45rem',
                fontFamily: "var(--font-serif-display, 'Italiana', serif)",
                color: '#3A2E2B',
                fontWeight: 600,
              }}
            >
              {productData.formattedPrice}
            </span>
            <span
              style={{
                fontSize: '0.76rem',
                color: '#8A7E72',
                letterSpacing: '0.04em',
              }}
            >
              / {productData.volume}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '0.84rem',
              color: '#554840',
              lineHeight: 1.6,
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            {productData.description}
          </p>

          {/* Shade Selector Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: '6px',
              borderTop: '1px solid rgba(58, 46, 43, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                  color: '#3A2E2B',
                }}
              >
                SHADE: <span style={{ color: '#A46750', fontWeight: 700 }}>{activeShade.name.toUpperCase()}</span>
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontStyle: 'italic',
                  color: '#706458',
                }}
              >
                {activeShade.descriptor}
              </span>
            </div>

            {/* Swatch Pills */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {LIPLINER_SHADES.map((shade) => {
                const isSelected = selectedShade.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShade(shade)}
                    onMouseEnter={() => setHoveredShade(shade)}
                    onMouseLeave={() => setHoveredShade(null)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: shade.gradient,
                      border: isSelected
                        ? '2px solid #3A2E2B'
                        : '2px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: isSelected
                        ? '0 0 0 2px rgba(58, 46, 43, 0.25), 0 4px 10px rgba(0,0,0,0.18)'
                        : '0 2px 6px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      outline: 'none',
                      position: 'relative',
                    }}
                    aria-label={`Select shade ${shade.name}`}
                    title={`${shade.name} — ${shade.descriptor}`}
                  >
                    {isSelected && (
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Quantity & Add to Bag */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingTop: '4px' }}>
            {/* Quantity Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(58, 46, 43, 0.12)',
                borderRadius: '100px',
                padding: '8px 14px',
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3A2E2B',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  opacity: quantity <= 1 ? 0.4 : 1,
                }}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#3A2E2B',
                  minWidth: '16px',
                  textAlign: 'center',
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3A2E2B',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Express Add Button */}
            <button
              onClick={handleAdd}
              style={{
                flex: 1,
                backgroundColor: added ? '#2C4A3E' : '#3A2E2B',
                color: '#F9F6F0',
                border: 'none',
                borderRadius: '100px',
                padding: '14px 20px',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: added
                  ? '0 8px 24px rgba(44, 74, 62, 0.35)'
                  : '0 8px 24px rgba(58, 46, 43, 0.25)',
              }}
            >
              {added ? (
                <>
                  <Check size={16} />
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <span>
                  ADD TO BAG • ${(productData.price * quantity).toFixed(2)}
                </span>
              )}
            </button>
          </div>

          {/* Editorial Accordions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: '1px solid rgba(58, 46, 43, 0.08)',
              marginTop: '4px',
            }}
          >
            {/* Accordion 1: The Ritual */}
            <div style={{ borderBottom: '1px solid rgba(58, 46, 43, 0.08)' }}>
              <button
                onClick={() => toggleAccordion('ritual')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '0.76rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  THE RITUAL
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'ritual' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    color: '#3A2E2B',
                  }}
                />
              </button>
              {openAccordion === 'ritual' && (
                <div
                  style={{
                    paddingBottom: '12px',
                    fontSize: '0.8rem',
                    color: '#65584F',
                    lineHeight: 1.6,
                  }}
                >
                  Trace the outer contour of your natural lip line to define shape and dimension. For a contoured, fuller pout, softly overline the cupid’s bow and center of the lower lip, then blend inward with fingertips or top with the Glazed Barrier Elixir.
                </div>
              )}
            </div>

            {/* Accordion 2: Formulation & Ingredients */}
            <div style={{ borderBottom: '1px solid rgba(58, 46, 43, 0.08)' }}>
              <button
                onClick={() => toggleAccordion('ingredients')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '0.76rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  FORMULATION & INGREDIENTS
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'ingredients' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    color: '#3A2E2B',
                  }}
                />
              </button>
              {openAccordion === 'ingredients' && (
                <div
                  style={{
                    paddingBottom: '12px',
                    fontSize: '0.8rem',
                    color: '#65584F',
                    lineHeight: 1.6,
                  }}
                >
                  Infused with micro-hyaluronic spheres, firming botanical peptides, cold-pressed marula seed oil, and soothing squalane. 100% clean, vegan, fragrance-free, paraben-free, and dermatologically approved.
                </div>
              )}
            </div>

            {/* Accordion 3: Delivery & Returns */}
            <div>
              <button
                onClick={() => toggleAccordion('delivery')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '0.76rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  DELIVERY & GUARANTEE
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'delivery' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    color: '#3A2E2B',
                  }}
                />
              </button>
              {openAccordion === 'delivery' && (
                <div
                  style={{
                    paddingBottom: '12px',
                    fontSize: '0.8rem',
                    color: '#65584F',
                    lineHeight: 1.6,
                  }}
                >
                  Complimentary climate-neutral shipping on orders over $80. Includes complimentary Élora luxury samples with every box. 30-day effortless returns policy.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 4. Bottom Footer Note */}
      <footer
        className="relative z-20 w-full px-6 md:px-14 py-4 flex items-center justify-between text-[0.7rem] text-[#8A7E72] uppercase tracking-[0.16em] select-none elora-pdp-footer"
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 3.5rem',
          fontSize: '0.7rem',
          color: '#8A7E72',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        <span>PARIS • NEW YORK</span>
        <span>CLEAN FORMULA • DERMATOLOGIST TESTED</span>
        <span>© 2026 ÉLORA</span>
      </footer>
    </div>
  );
}
