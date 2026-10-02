import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Star, Check, Sparkles, Minus, Plus } from 'lucide-react';

export default function NectarDetailView({
  isOpen,
  onClose,
  onAddToCart,
  onOpenCart,
  cartCount = 0,
}) {
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
    id: 'nectar',
    productId: 'nectar',
    name: 'Barrier Repair Nectar',
    subtitle: 'Alpine rose cellular infusion',
    volume: '50 ml / 1.7 fl oz',
    price: 48,
    formattedPrice: '$48.00',
    rating: 4.9,
    reviews: 428,
    image: '/honeyglaze.png',
    description: 'A luxurious honey glaze lip mask infused with alpine rose cellular extracts for ultimate barrier repair and deep nourishment.'
  };

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: productData.id,
          productId: productData.productId,
          name: productData.name,
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
        <img
          src={productData.image}
          alt={`Élora ${productData.name}`}
          className="elora-shade-pdp-bg"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            pointerEvents: 'none',
            animation: 'shadeSmoothReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            willChange: 'transform, opacity, filter',
          }}
          loading="eager"
        />
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
        >
          BAG ({cartCount})
        </button>
      </header>

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
              ÉLORA EXCLUSIVE • {productData.volume}
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
              BESTSELLER
            </span>
          </div>

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
            Barrier Repair Nectar
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
            {productData.subtitle}
          </p>

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
            {productData.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.6rem',
            }}
          >
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
              >
                <Plus size={13} />
              </button>
            </div>

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

          <div style={{ borderTop: '1px solid rgba(58, 46, 43, 0.1)' }}>
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
                  Apply a generous layer onto lips at night or anytime during the day to combat dryness and deliver a glass-like finish. Can be worn alone or layered over lip color.
                </div>
              )}
            </div>

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
                  Alpine Rose Stem Cells, Honey Extract, Vegan Squalane, and Ceramide NP. Formulated without parabens, silicones, synthetic sulfates, or artificial fragrances.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
