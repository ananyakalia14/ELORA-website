import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Star, Check, Minus, Plus } from 'lucide-react';
import { ELORA_SHADES } from '../data/shades';

/**
 * Full-Screen Product Detail Page (PDP) for Élora Peptide Lip Tint Shades
 * Each shade has its own bespoke visual, undertone profile, ritual, and bag checkout.
 */
export default function ShadeDetailView({
  isOpen,
  initialShadeId = 'rose-glace',
  initialShade = null,
  onClose,
  onAddToCart,
  onOpenCart,
  cartCount = 0,
}) {
  const [activeShade, setActiveShade] = useState(() => {
    if (initialShade) return initialShade;
    return ELORA_SHADES.find((s) => s.id === initialShadeId) || ELORA_SHADES[1];
  });
  const [hoveredShade, setHoveredShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('ritual');

  // Synchronize when initialShade changes
  useEffect(() => {
    if (initialShade) {
      setActiveShade(initialShade);
    } else if (initialShadeId) {
      const match = ELORA_SHADES.find((s) => s.id === initialShadeId);
      if (match) setActiveShade(match);
    }
  }, [initialShade, initialShadeId]);

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

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: `tint-${activeShade.id}`,
          productId: `tint-${activeShade.id}`,
          name: `Peptide Lip Tint — ${activeShade.name}`,
          variantName: activeShade.name,
          price: activeShade.price,
          volume: activeShade.volume,
          image: activeShade.image,
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

  const content = (
    <div
      className="fixed inset-0 z-50 w-full h-screen overflow-hidden bg-[#F9F6F0] flex flex-col justify-between elora-pdp-root"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 100000,
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
      aria-label={`Élora Highlight Milk ${activeShade.name} Product Detail View`}
    >
      {/* 1. Full-Bleed Background Visual with smooth reveal animation */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 elora-pdp-bg-layer"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#F9F6F0',
        }}
      >
        <img
          key={activeShade.id}
          src={activeShade.image}
          onError={(e) => {
            if (activeShade.fallbackImage) {
              e.currentTarget.src = activeShade.fallbackImage;
            }
          }}
          alt={`Élora Highlight Milk ${activeShade.name}`}
          className="elora-shade-pdp-bg"
          loading="eager"
        />

        {/* Soft Warm Scrim Gradient over photo to preserve visual contrast for text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(249, 246, 240, 0) 0%, rgba(249, 246, 240, 0.06) 38%, rgba(249, 246, 240, 0.48) 72%, rgba(249, 246, 240, 0.78) 100%)',
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
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-[0.14em] text-[#3A2E2B] font-medium hover:opacity-70 transition-opacity flex items-center gap-1.5 elora-pdp-nav-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(58, 46, 43, 0.1)',
            borderRadius: '100px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#3A2E2B',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            padding: '7px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          aria-label="Back to previous product view"
        >
          <span className="pdp-back-full">← BACK TO SHOP</span>
          <span className="pdp-back-short">← SHOP</span>
        </button>

        {/* Center: Brand Wordmark */}
        <span
          className="font-serif text-2xl md:text-3xl text-[#3A2E2B] font-normal tracking-[0.14em] elora-pdp-logo"
          style={{
            fontFamily: "var(--font-serif-display, 'Italiana', 'Cormorant Garamond', Georgia, serif)",
            fontSize: 'clamp(1.4rem, 2.2vw, 2.2rem)',
            color: '#3A2E2B',
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            textShadow: '0 2px 12px rgba(255, 255, 255, 0.8)',
          }}
        >
          ÉLORA
        </span>

        {/* Right: Cart Status */}
        <button
          type="button"
          onClick={() => {
            if (onOpenCart) onOpenCart();
          }}
          className="text-xs uppercase tracking-[0.14em] text-[#3A2E2B] font-medium hover:opacity-70 transition-opacity elora-pdp-nav-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(58, 46, 43, 0.1)',
            borderRadius: '100px',
            cursor: 'pointer',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#3A2E2B',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            padding: '7px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
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
              ÉLORA PRIVÉ • {activeShade.volume}
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
              {activeShade.badge}
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
            Highlight Milk
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
            {activeShade.name} — {activeShade.subtitle}
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
            <div style={{ display: 'flex', color: '#C4A265', fontSize: '0.78rem', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#C4A265" color="#C4A265" />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3A2E2B' }}>
              {activeShade.rating.toFixed(1)}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#88756F' }}>
              ({activeShade.reviews} reviews)
            </span>
          </div>

          {/* Price & Currency */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginBottom: '0.85rem',
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif-display, 'Italiana', Georgia, serif)",
                fontSize: '1.9rem',
                fontWeight: 500,
                color: '#261714',
                lineHeight: 1,
              }}
            >
              ${activeShade.price}.00
            </span>
            <span style={{ fontSize: '0.72rem', color: '#88756F', letterSpacing: '0.06em' }}>
              USD
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: '#52433E',
              margin: '0 0 1.25rem 0',
            }}
          >
            {activeShade.description}
          </p>

          {/* 4 Swatches in Button Format */}
          <div style={{ marginBottom: '1.4rem' }}>
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
                  fontSize: '0.66rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  fontWeight: 600,
                  color: '#AA776A',
                }}
              >
                SELECT SHADE GLAZE
              </span>
              <span
                style={{
                  fontSize: '0.74rem',
                  color: '#3A2E2B',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                {displayedShade.name}
              </span>
            </div>

            {/* Swatch Buttons Row matching reference image */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '22px',
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(170, 119, 106, 0.22)',
              }}
            >
              {ELORA_SHADES.map((shade) => {
                const isSelected = activeShade.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    type="button"
                    onClick={() => setActiveShade(shade)}
                    onMouseEnter={() => setHoveredShade(shade)}
                    onMouseLeave={() => setHoveredShade(null)}
                    title={`Switch to ${shade.name}`}
                    aria-label={`Switch to shade ${shade.name}`}
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
                        width: '38px',
                        height: '38px',
                        borderRadius: '999px',
                        backgroundColor: shade.hex,
                        background: shade.gradient,
                        boxShadow:
                          'inset 2px 2px 4px rgba(255, 255, 255, 0.55), inset -2px -2px 4px rgba(0, 0, 0, 0.25), 0 3px 8px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      className="elora-swatch-circle elora-swatch-drop"
                    >
                      {/* Specular curved highlight */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '7px',
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
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3A2E2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  padding: 0,
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>

              <span
                style={{
                  minWidth: '24px',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#3A2E2B',
                  userSelect: 'none',
                }}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3A2E2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  padding: 0,
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
                backgroundColor: added ? '#27672B' : '#3A2E2B',
                color: '#FAF6F0',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                fontWeight: 600,
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: added
                  ? '0 8px 20px rgba(39, 103, 43, 0.28)'
                  : '0 8px 22px rgba(58, 46, 43, 0.3)',
              }}
              aria-label={`Add ${activeShade.name} to shopping bag`}
            >
              {added ? (
                <>
                  <Check size={14} />
                  <span>SHADE ADDED TO BAG</span>
                </>
              ) : (
                <span>ADD TO BAG — ${(activeShade.price * quantity).toFixed(2)}</span>
              )}
            </button>
          </div>

          {/* Editorial Micro-Accordions */}
          <div
            style={{
              borderTop: '1px solid rgba(170, 119, 106, 0.2)',
              paddingTop: '0.5rem',
            }}
          >
            {/* Accordion 1: The Tint Ritual */}
            <div style={{ borderBottom: '1px solid rgba(170, 119, 106, 0.15)' }}>
              <button
                type="button"
                onClick={() => toggleAccordion('ritual')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                aria-expanded={openAccordion === 'ritual'}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  The Tint Ritual
                </span>
                <ChevronDown
                  size={15}
                  color="#AA776A"
                  style={{
                    transform: openAccordion === 'ritual' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                />
              </button>
              {openAccordion === 'ritual' && (
                <div
                  style={{
                    padding: '0 0 0.95rem 0',
                    fontSize: '0.81rem',
                    lineHeight: 1.6,
                    color: '#5E4F49',
                  }}
                >
                  {activeShade.ritualText}
                </div>
              )}
            </div>

            {/* Accordion 2: Bio-Actives */}
            <div style={{ borderBottom: '1px solid rgba(170, 119, 106, 0.15)' }}>
              <button
                type="button"
                onClick={() => toggleAccordion('actives')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                aria-expanded={openAccordion === 'actives'}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  Key Bio-Actives
                </span>
                <ChevronDown
                  size={15}
                  color="#AA776A"
                  style={{
                    transform: openAccordion === 'actives' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                />
              </button>
              {openAccordion === 'actives' && (
                <div
                  style={{
                    padding: '0 0 0.95rem 0',
                    fontSize: '0.81rem',
                    lineHeight: 1.6,
                    color: '#5E4F49',
                  }}
                >
                  {activeShade.activesText}
                </div>
              )}
            </div>

            {/* Accordion 3: Clinical Performance */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('clinicals')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 0',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                aria-expanded={openAccordion === 'clinicals'}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    color: '#3A2E2B',
                  }}
                >
                  Clinical Results
                </span>
                <ChevronDown
                  size={15}
                  color="#AA776A"
                  style={{
                    transform: openAccordion === 'clinicals' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                  }}
                />
              </button>
              {openAccordion === 'clinicals' && (
                <div
                  style={{
                    padding: '0 0 0.95rem 0',
                    fontSize: '0.81rem',
                    lineHeight: 1.6,
                    color: '#5E4F49',
                  }}
                >
                  {activeShade.clinicalsText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
