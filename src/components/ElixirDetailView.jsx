import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, Check, Sparkles, ShieldCheck, Heart, Minus, Plus } from 'lucide-react';

/**
 * The Glazed Barrier Elixir — Full-Screen Dedicated Product Detail Page
 * 
 * High-fashion luxury visual layout modeled after GlazingMilkDetailView:
 * - Full-bleed campaign photography featuring the iconic pink blush stick and toasted teddy variants
 * - Overlaid header with ← BACK TO SHOP, uppercase ÉLORA wordmark, and BAG (count)
 * - Pinned floating frosted buy card with shade selector, quantity pill, accordions, and express bag checkout
 */

const ELIXIR_VARIANTS = [
  {
    id: 'rose-mousse',
    name: 'Rosé Mousse',
    code: '01',
    subtitle: 'baume teinté framboise glacée',
    description: 'A whipped, translucent berry-pink tint with barrier-strengthening dew for a glass-skin glazed flush.',
    colorHex: '#E6A8B4',
    gradient: 'radial-gradient(circle at 35% 35%, #FAD2DB 0%, #E6A8B4 55%, #CF8795 100%)',
    image: '/images/products/elixir-packshot.jpg',
    badge: 'ÉLORA SIGNATURE',
  },
  {
    id: 'toasted-teddy',
    name: 'Toasted Teddy',
    code: '02',
    subtitle: 'baume teinté caramel ambré',
    description: 'A warm toasted marshmallow bronze tint with sun-drenched radiance and deep barrier-repair lipids.',
    colorHex: '#9B6247',
    gradient: 'radial-gradient(circle at 35% 35%, #BD7F62 0%, #9B6247 55%, #76432D 100%)',
    image: '/images/products/elixir-dropper.jpg',
    badge: 'ICONIC BRONZE',
  },
];

export default function ElixirDetailView({
  isOpen,
  onClose,
  onAddToCart,
  onOpenCart,
  cartCount = 0,
}) {
  const [selectedVariant, setSelectedVariant] = useState(ELIXIR_VARIANTS[0]);
  const [hoveredVariant, setHoveredVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('ritual');

  // Lock body scroll and listen for Escape key
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
    id: 'elixir',
    productId: 'elixir',
    name: 'The Glazed Barrier Elixir',
    subtitle: selectedVariant.subtitle,
    volume: '12 g / 0.42 oz',
    price: 128,
    formattedPrice: '$128.00',
    rating: 4.9,
    reviews: 89,
    image: selectedVariant.image,
    description:
      'A multi-dimensional cream-to-glaze tint stick that melts effortlessly into skin, delivering a translucent wash of dewy flush with barrier-strengthening ceramides and glass-skin radiance.',
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: `${productData.id}-${selectedVariant.id}`,
          productId: productData.productId,
          name: `${productData.name} — ${selectedVariant.name}`,
          price: productData.price,
          volume: productData.volume,
          image: selectedVariant.image,
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

  const displayedVariant = hoveredVariant || selectedVariant;

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
      aria-label="The Glazed Barrier Elixir Product Detail View"
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
          key={selectedVariant.id}
          src={selectedVariant.image}
          alt={`Élora The Glazed Barrier Elixir ${selectedVariant.name}`}
          className="elora-shade-pdp-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '28% center',
            pointerEvents: 'none',
            animation: 'shadeSmoothReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            willChange: 'transform, opacity, filter',
          }}
          loading="eager"
        />

        {/* Soft Warm Scrim Gradient over photo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(249, 246, 240, 0) 0%, rgba(249, 246, 240, 0.08) 35%, rgba(249, 246, 240, 0.5) 70%, rgba(249, 246, 240, 0.82) 100%)',
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
          aria-label="Back to boutique shop"
        >
          ← BACK TO SHOP
        </button>

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
          aria-label={`View shopping bag containing ${cartCount} items`}
        >
          BAG ({cartCount})
        </button>
      </header>

      {/* 3. Floating Buy Card (Pinned Right) */}
      <div
        className="relative z-20 w-full flex-1 flex items-center justify-end px-4 md:px-16 pb-8 elora-pdp-card-stage"
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 4vw 2rem 4vw',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          className="w-full max-w-[430px] bg-[#FAF6F0]/94 backdrop-blur-xl border border-white/85 shadow-[0_25px_60px_rgba(58,46,43,0.16)] rounded-[28px] p-8 md:p-9 text-[#3A2E2B] elora-pdp-buy-card elora-shade-pdp-card"
          style={{
            width: '100%',
            maxWidth: '430px',
            backgroundColor: 'rgba(250, 246, 240, 0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 25px 60px rgba(58, 46, 43, 0.16)',
            borderRadius: '28px',
            padding: '2.2rem 2.2rem',
            color: '#3A2E2B',
            maxHeight: 'calc(100vh - 130px)',
            maxHeight: 'calc(100dvh - 130px)',
            overflowY: 'auto',
            boxSizing: 'border-box',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(170, 119, 106, 0.3) transparent',
          }}
        >
          {/* Eyebrow & Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontWeight: 600,
                color: '#AA776A',
              }}
            >
              ÉLORA PRIVÉ • {productData.volume}
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                fontWeight: 600,
                textTransform: 'uppercase',
                backgroundColor: 'rgba(170, 119, 106, 0.12)',
                color: '#7D4F44',
                padding: '2px 9px',
                borderRadius: '999px',
              }}
            >
              {selectedVariant.badge}
            </span>
          </div>

          {/* Product Title */}
          <h1
            style={{
              fontFamily: "var(--font-serif-display, 'Italiana', 'Cormorant Garamond', Georgia, serif)",
              fontSize: 'clamp(1.85rem, 2.3vw, 2.25rem)',
              lineHeight: 1.15,
              fontWeight: 400,
              color: '#261714',
              margin: '0 0 0.25rem 0',
              letterSpacing: '-0.01em',
            }}
          >
            The Glazed Barrier Elixir
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              color: '#7F6B64',
              margin: '0 0 0.85rem 0',
              letterSpacing: '0.04em',
            }}
          >
            {selectedVariant.name} — {selectedVariant.subtitle}
          </p>

          {/* Rating Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill="#AA776A"
                  stroke="#AA776A"
                />
              ))}
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#3A2E2B',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {productData.rating}
            </span>
            <span
              style={{
                fontSize: '0.74rem',
                color: '#8A7A74',
                fontFamily: 'var(--font-sans)',
              }}
            >
              ({productData.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              fontSize: '1.45rem',
              fontWeight: 500,
              color: '#2E1A16',
              fontFamily: "var(--font-serif-display, 'Italiana', Georgia, serif)",
              marginBottom: '1rem',
              letterSpacing: '0.02em',
            }}
          >
            {productData.formattedPrice}
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '0.86rem',
              lineHeight: 1.62,
              color: '#4A3B37',
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              margin: '0 0 1.25rem 0',
            }}
          >
            {selectedVariant.description}
          </p>

          {/* Shade Variant Swatch Selector */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.72)',
              border: '1px solid rgba(170, 119, 106, 0.22)',
              borderRadius: '20px',
              padding: '1rem 1.15rem',
              marginBottom: '1.4rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.66rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  fontWeight: 600,
                  color: '#AA776A',
                  display: 'block',
                }}
              >
                SELECT SIGNATURE TINT
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  color: '#3A2E2B',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                }}
              >
                {displayedVariant.name} ({displayedVariant.code})
              </span>
            </div>

            {/* Circular Swatch Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {ELIXIR_VARIANTS.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    onMouseEnter={() => setHoveredVariant(variant)}
                    onMouseLeave={() => setHoveredVariant(null)}
                    title={`Switch to ${variant.name}`}
                    aria-label={`Switch to ${variant.name}`}
                    style={{
                      background: 'none',
                      border: isSelected ? '1.5px solid #3A2E2B' : '1.5px solid transparent',
                      borderRadius: '999px',
                      padding: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                      boxShadow: isSelected ? '0 4px 14px rgba(58, 46, 43, 0.22)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '999px',
                        backgroundColor: variant.colorHex,
                        background: variant.gradient,
                        boxShadow:
                          'inset 2px 2px 4px rgba(255, 255, 255, 0.55), inset -2px -2px 4px rgba(0, 0, 0, 0.25), 0 3px 8px rgba(0,0,0,0.12)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      className="elora-swatch-circle elora-swatch-drop"
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '8px',
                          width: '9px',
                          height: '5px',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(255, 255, 255, 0.75)',
                          transform: 'rotate(-28deg)',
                          filter: 'blur(0.35px)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector + Add To Bag Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.6rem',
            }}
          >
            {/* Quantity Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(170, 119, 106, 0.28)',
                borderRadius: '999px',
                padding: '4px 8px',
                height: '46px',
                boxSizing: 'border-box',
              }}
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  color: '#3A2E2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  minWidth: '22px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-sans)',
                  color: '#3A2E2B',
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  color: '#3A2E2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Buy CTA Button */}
            <button
              type="button"
              onClick={handleAdd}
              style={{
                flex: 1,
                height: '46px',
                backgroundColor: added ? '#27672B' : '#AA776A',
                color: '#FAF6F0',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: added ? '0 8px 24px rgba(39, 103, 43, 0.35)' : '0 8px 22px rgba(170, 119, 106, 0.35)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {added ? (
                <>
                  <Check size={14} />
                  ADDED TO BAG • ${(productData.price * quantity).toFixed(2)}
                </>
              ) : (
                <>ADD TO BAG • ${(productData.price * quantity).toFixed(2)}</>
              )}
            </button>
          </div>

          {/* Complimentary Privileges Banner */}
          <div
            style={{
              padding: '0.8rem 1rem',
              backgroundColor: 'rgba(170, 119, 106, 0.08)',
              borderRadius: '14px',
              border: '1px solid rgba(170, 119, 106, 0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.4rem',
            }}
          >
            <Sparkles size={14} color="#AA776A" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontSize: '0.74rem',
                color: '#5E4F49',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.4,
              }}
            >
              Includes 2 complimentary deluxe miniature elixirs with this order.
            </span>
          </div>

          {/* Editorial Accordion Stack */}
          <div style={{ borderTop: '1px solid rgba(58, 46, 43, 0.1)' }}>
            {/* Accordion 1: Ritual De Beauté */}
            <div style={{ borderBottom: '1px solid rgba(58, 46, 43, 0.08)' }}>
              <button
                type="button"
                onClick={() => toggleAccordion('ritual')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.05rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  RITUAL DE BEAUTÉ
                </span>
                <ChevronDown
                  size={15}
                  color="#AA776A"
                  style={{
                    transform: openAccordion === 'ritual' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.28s ease',
                  }}
                />
              </button>
              {openAccordion === 'ritual' && (
                <div
                  style={{
                    padding: '0 0 1rem 0',
                    fontSize: '0.82rem',
                    lineHeight: 1.65,
                    color: '#5E4F49',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Gently glide the sculpted tint stick across the high apples of the cheeks, the bridge of the nose, and the contours of the lips. Pat and diffuse with warm fingertips for a seamless, melted-cream glaze that breathes with your skin throughout the day.
                </div>
              )}
            </div>

            {/* Accordion 2: Botanical Bio-Actives */}
            <div style={{ borderBottom: '1px solid rgba(58, 46, 43, 0.08)' }}>
              <button
                type="button"
                onClick={() => toggleAccordion('actives')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.05rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  BOTANICAL BIO-ACTIVES
                </span>
                <ChevronDown
                  size={15}
                  color="#AA776A"
                  style={{
                    transform: openAccordion === 'actives' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.28s ease',
                  }}
                />
              </button>
              {openAccordion === 'actives' && (
                <div
                  style={{
                    padding: '0 0 1rem 0',
                    fontSize: '0.82rem',
                    lineHeight: 1.65,
                    color: '#5E4F49',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Triple-Ceramide NP Complex, Bio-Identical Squalane, French Alpine Rose Cellular Phyto-Stem Cells, Cold-Pressed Meadowfoam Seed Oil, Vitamin E (Tocopherol). Formulated without parabens, silicones, synthetic sulfates, or artificial fragrances.
                </div>
              )}
            </div>

            {/* Accordion 3: Clinical Results */}
            <div style={{ borderBottom: '1px solid rgba(58, 46, 43, 0.08)' }}>
              <button
                type="button"
                onClick={() => toggleAccordion('clinicals')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.05rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  CLINICAL RESULTS
                </span>
                <ChevronDown
                  size={15}
                  color="#AA776A"
                  style={{
                    transform: openAccordion === 'clinicals' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.28s ease',
                  }}
                />
              </button>
              {openAccordion === 'clinicals' && (
                <div
                  style={{
                    padding: '0 0 1rem 0',
                    fontSize: '0.82rem',
                    lineHeight: 1.65,
                    color: '#5E4F49',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  In a 28-day independent consumer panel of 42 participants:
                  <ul style={{ margin: '0.4rem 0 0 1.1rem', padding: 0 }}>
                    <li><strong>99%</strong> agreed it melts weightlessly into skin without shifting base makeup.</li>
                    <li><strong>96%</strong> reported immediate dewy glazed reflection with zero sticky residue.</li>
                    <li><strong>94%</strong> observed enhanced skin barrier suppleness and comfortable moisture after 10 hours.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 4: Complimentary Privileges */}
            <div style={{ borderBottom: '1px solid rgba(58, 46, 43, 0.08)' }}>
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.05rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  DELIVERY &amp; COMPLIMENTARY PRIVILEGES
                </span>
                <ChevronDown
                  size={15}
                  color="#AA776A"
                  style={{
                    transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.28s ease',
                  }}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div
                  style={{
                    padding: '0 0 1rem 0',
                    fontSize: '0.82rem',
                    lineHeight: 1.65,
                    color: '#5E4F49',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  Complimentary climate-neutral express shipping on all orders. Each order arrives enveloped in our signature textured alabaster gift box accompanied by two deluxe miniature essences.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
