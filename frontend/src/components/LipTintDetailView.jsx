import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Star, Check, Minus, Plus } from 'lucide-react';

/**
 * Full-Screen Product Detail Page (PDP) for Élora Peptide Lip Tint
 * 
 * Luxury editorial visual layout modeled after GlazingMilkDetailView:
 * - Dynamic full-bleed campaign visuals for each shade ending with 'tint.png' in /public:
 *   • butterscotchtint.png
 *   • cinamontint.png
 *   • coffeetint.png
 *   • lemontint.png
 *   • pistachiotint.png
 *   • rasberrytint.png
 *   • strawberrytint.png
 * - Silky smooth cross-fade when hovering or switching shades with zero layout shift
 * - Overlaid header: ← BACK TO SHOP, uppercase ÉLORA wordmark, BAG (count)
 * - Pinned floating frosted buy card with shade swatches, quantity pill, accordions, and express bag checkout
 */

export const LIP_TINT_SHADES = [
  {
    id: 'butterscotch',
    name: 'Butterscotch',
    descriptor: 'warm golden caramel glaze',
    undertone: 'Warm Golden Caramel',
    image: '/butterscotchtint.png',
    colorHex: '#D3A279',
    gradient: 'radial-gradient(circle at 35% 35%, #F0CAA8 0%, #D3A279 55%, #A77144 100%)',
    badge: 'BESTSELLER',
    flavor: 'Salted Caramel Crème',
    accentColor: '#A77144',
    description: 'A warm golden caramel glaze with sunlit butterscotch undertones for soft, cushiony radiance.',
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    descriptor: 'warm spiced cinnamon roll',
    undertone: 'Spiced Warm Terracotta',
    image: '/cinamontint.png',
    colorHex: '#C89574',
    gradient: 'radial-gradient(circle at 35% 35%, #E5BCA0 0%, #C89574 55%, #9E6544 100%)',
    badge: 'WARM SPICE',
    flavor: 'Ceylon Cinnamon & Glaze',
    accentColor: '#9E6544',
    description: 'A delicate warm spiced terracotta glaze with rich autumnal warmth and pillowy cushion.',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    descriptor: 'toasted espresso mocha',
    undertone: 'Deep Roasted Espresso',
    image: '/coffeetint.png',
    colorHex: '#5E2A18',
    gradient: 'radial-gradient(circle at 35% 35%, #84452C 0%, #5E2A18 55%, #3B1408 100%)',
    badge: 'ICONIC SHADE',
    flavor: 'Roasted Arabica & Dark Cocoa',
    accentColor: '#5E2A18',
    description: 'A rich toasted espresso mocha tint with velvety 90s-inspired warmth and multidimensional shine.',
  },
  {
    id: 'lemon',
    name: 'Lemon',
    descriptor: 'sunlit candied citrus pastel',
    undertone: 'Luminous Sheer Citrus',
    image: '/lemontint.png',
    colorHex: '#EDD477',
    gradient: 'radial-gradient(circle at 35% 35%, #FFF2A6 0%, #EDD477 55%, #C9AA3C 100%)',
    badge: 'SUMMER DROP',
    flavor: 'Meyer Lemon Curd & Sugar Glaze',
    accentColor: '#A68314',
    description: 'A sheer, luminous wash of candied lemon pastel with ultra-nourishing barrier dew and sunny gleam.',
  },
  {
    id: 'pistachio',
    name: 'Pistachio',
    descriptor: 'creamy botanical pistachio sage',
    undertone: 'Pastel Botanical Sage',
    image: '/pistachiotint.png',
    colorHex: '#939659',
    gradient: 'radial-gradient(circle at 35% 35%, #BFC47F 0%, #939659 55%, #686D32 100%)',
    badge: 'EDITORIAL PICK',
    flavor: 'Sweet Roasted Pistachio Crème',
    accentColor: '#686D32',
    description: 'A sweet botanical pistachio crème with sheer barrier-fortifying hydration and glazed finish.',
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    descriptor: 'juicy crushed wild berry',
    undertone: 'Deep Ruby Berry Flush',
    image: '/rasberrytint.png',
    colorHex: '#68101F',
    gradient: 'radial-gradient(circle at 35% 35%, #942036 0%, #68101F 55%, #420610 100%)',
    badge: 'DEEP BERRY',
    flavor: 'Crushed Wild Raspberry Nectar',
    accentColor: '#68101F',
    description: 'A juicy crushed wild raspberry wash delivering a translucent, bitten-lip berry flush and glass shine.',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    descriptor: 'glazed sun-ripened strawberry pink',
    undertone: 'Dewy Glazed Petal Pink',
    image: '/strawberrytint.png',
    colorHex: '#E3888B',
    gradient: 'radial-gradient(circle at 35% 35%, #FFB5B7 0%, #E3888B 55%, #B8585C 100%)',
    badge: 'COMMUNITY FAVORITE',
    flavor: 'Fresh Strawberry Glaze & Dew',
    accentColor: '#B8585C',
    description: 'A fresh, dewy glazed strawberry pink tint that melts into lips for a healthy petal gleam and plush hydration.',
  },
];

export default function LipTintDetailView({
  isOpen,
  initialShadeId = 'butterscotch',
  onClose,
  onAddToCart,
  onOpenCart,
  cartCount = 0,
}) {
  const [selectedShade, setSelectedShade] = useState(() => {
    return LIP_TINT_SHADES.find((s) => s.id === initialShadeId) || LIP_TINT_SHADES[0];
  });
  const [hoveredShade, setHoveredShade] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('ritual');

  // Synchronize when initialShadeId changes
  useEffect(() => {
    if (initialShadeId) {
      const match = LIP_TINT_SHADES.find((s) => s.id === initialShadeId);
      if (match) setSelectedShade(match);
    }
  }, [initialShadeId]);

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

  const activeShade = hoveredShade || selectedShade;

  const productData = {
    id: 'brume',
    productId: 'brume',
    name: 'PEPTIDE LIP TINT',
    subtitle: 'baume à lèvres teinté aux peptides',
    volume: '10 ml / 0.34 fl oz',
    price: 54,
    formattedPrice: '$54.00',
    rating: 4.8,
    reviews: 142,
    description:
      'A restorative, peptide-rich tinted lip treatment with a soft, glossy finish that instantly drenches lips in barrier-building moisture, cushion-soft shine, and sheer glazed color.',
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: `tint-${selectedShade.id}`,
          productId: productData.productId,
          name: `${productData.name} — ${selectedShade.name}`,
          variantName: selectedShade.name,
          price: productData.price,
          volume: productData.volume,
          image: selectedShade.image,
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
        zIndex: 99999,
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
      {/* 1. Full-Bleed Dynamic Background Visuals for each Shade (Smooth Cross-fade) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 elora-pdp-bg-layer"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#F7F3EE',
        }}
      >
        {LIP_TINT_SHADES.map((shade) => {
          const isVisible = activeShade.id === shade.id;
          return (
            <img
              key={shade.id}
              src={shade.image}
              alt={`Élora Peptide Lip Tint — ${shade.name}`}
              className="elora-tint-pdp-bg"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'left center',
                pointerEvents: 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(1.025)',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform, opacity',
              }}
              loading="eager"
            />
          );
        })}

        {/* Top Scrim for Header Contrast */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '160px',
            background: 'linear-gradient(to bottom, rgba(249, 246, 240, 0.65) 0%, rgba(249, 246, 240, 0.15) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Right Luxury Scrim for Buy Card Legibility */}
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
          aria-label="Back to boutique shop"
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
          aria-label="View Shopping Bag"
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
            padding: '2.5rem 2.25rem 2.25rem 2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.88)',
            boxShadow: '0 24px 60px rgba(58, 46, 43, 0.12)',
            boxSizing: 'border-box',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {/* Eyebrow & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
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
              ÉLORA EXCLUSIVE • TEINTE
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: activeShade.accentColor,
                fontWeight: 600,
                backgroundColor: `${activeShade.colorHex}22`,
                padding: '4px 10px',
                borderRadius: '100px',
                border: `1px solid ${activeShade.colorHex}44`,
                transition: 'all 0.3s ease',
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
              {productData.name}
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
            {activeShade.description || productData.description}
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
                SHADE:{' '}
                <span
                  style={{
                    color: activeShade.accentColor,
                    fontWeight: 700,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {activeShade.name.toUpperCase()}
                </span>
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

            {/* Swatch Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '9px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {LIP_TINT_SHADES.map((shade) => {
                const isSelected = selectedShade.id === shade.id;
                const isHovered = hoveredShade?.id === shade.id;
                return (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShade(shade)}
                    onMouseEnter={() => setHoveredShade(shade)}
                    onMouseLeave={() => setHoveredShade(null)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: shade.gradient,
                      border: isSelected
                        ? '2px solid #3A2E2B'
                        : isHovered
                        ? '2px solid rgba(58, 46, 43, 0.6)'
                        : '2px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: isSelected
                        ? '0 0 0 2px rgba(58, 46, 43, 0.25), 0 4px 10px rgba(0,0,0,0.18)'
                        : '0 2px 6px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.14)' : isHovered ? 'scale(1.08)' : 'scale(1)',
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
                          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
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
                  Glide directly onto bare lips day or night for an instant burst of barrier hydration and glazed color. Layer over our Lip Shaping Pencil for sculpted editorial dimension, or apply a generous coat before sleep as an intensive restorative lip mask.
                </div>
              )}
            </div>

            {/* Accordion 2: Formulation & Key Actives */}
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
                  KEY ACTIVES & INGREDIENTS
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
                  Formulated with Palmitoyl Tripeptide-38 to visibly plump and soften fine lip lines, cold-pressed Cupuaçu & Shea butter for deep moisture lock, and Babassu oil with bio-identical squalane for a weightless, non-sticky glass finish. 100% vegan, cruelty-free, and fragrance-neutral.
                </div>
              )}
            </div>

            {/* Accordion 3: Clinical Results */}
            <div style={{ borderBottom: '1px solid rgba(58, 46, 43, 0.08)' }}>
              <button
                onClick={() => toggleAccordion('clinicals')}
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
                  CLINICAL PERFORMANCE
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'clinicals' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    color: '#3A2E2B',
                  }}
                />
              </button>
              {openAccordion === 'clinicals' && (
                <div
                  style={{
                    paddingBottom: '12px',
                    fontSize: '0.8rem',
                    color: '#65584F',
                    lineHeight: 1.6,
                  }}
                >
                  100% of subjects measured immediate barrier replenishment. 98% confirmed continuous 12-hour hydration with zero stickiness. 95% noticed visibly softer, plumped, and smoother lips after one week of daily wear.
                </div>
              )}
            </div>

            {/* Accordion 4: Delivery & Guarantee */}
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
                  Complimentary climate-neutral express shipping on orders over $80. Every order includes bespoke Élora botanical samples. 30-day effortless return guarantee.
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

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
