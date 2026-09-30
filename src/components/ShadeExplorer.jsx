import React, { useState, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { ELORA_SHADES } from '../data/shades';
import ShadeDetailView from './ShadeDetailView';

export default function ShadeExplorer({ onAddToCart, onSelectShade, buttonText = "Shades" }) {
  const [isShadeModalOpen, setIsShadeModalOpen] = useState(false);
  const [selectedShade, setSelectedShade] = useState(ELORA_SHADES[1]); // Default to Rosé Glacé (02) matching reference
  const [isShadePdpOpen, setIsShadePdpOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isShadeModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsShadeModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShadeModalOpen]);

  const handleSelect = (shade) => {
    setSelectedShade(shade);
    if (onSelectShade) onSelectShade(shade);
  };

  const handleAddShadeToBag = () => {
    if (onAddToCart) {
      onAddToCart({
        id: `tint-${selectedShade.id}`,
        name: `Peptide Lip Tint — ${selectedShade.name}`,
        variantName: selectedShade.name,
        price: 54,
        image: '/images/products/mist-packshot.jpg',
        volume: '10 ml / 0.34 fl oz',
      }, 1);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsShadeModalOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* 1. Expandable Pill Button (Élora Themed) */}
      <button
        type="button"
        onClick={() => setIsShadeModalOpen(true)}
        className="group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#3A2E2B] text-[#FAF6F0] border border-[#3A2E2B]/20 transition-all duration-300 hover:w-36 shadow-lg elora-expandable-shade-btn"
        aria-label="Explore Shades"
        title="Explore Shades"
      >
        <span className="inline-flex whitespace-nowrap text-xs uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100 elora-shade-btn-label">
          {buttonText}
        </span>
        <div className="absolute right-3.5 elora-shade-btn-icon">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="h-4 w-4">
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* 2. Shade Selector Overlay Panel */}
      {isShadeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 elora-shade-modal-overlay"
          onClick={() => setIsShadeModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg bg-[#FAF6F0] rounded-[28px] border border-white/60 p-8 shadow-2xl relative text-[#3A2E2B] elora-shade-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsShadeModalOpen(false)}
              className="absolute top-6 right-6 text-sm text-[#3A2E2B]/70 hover:text-[#3A2E2B] p-2"
              aria-label="Close shade modal"
            >
              ✕
            </button>

            {/* Dynamic Shade Showcase: Image + Info */}
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#3A2E2B]/60 font-semibold block mb-1">
                Select Your Glaze
              </span>
              <h3 className="font-serif text-2xl text-[#3A2E2B] mt-1 font-normal tracking-wide">
                {selectedShade.name}
              </h3>
              <p className="text-xs text-[#3A2E2B]/75 mt-1.5 max-w-xs mx-auto leading-relaxed">
                {selectedShade.description}
              </p>
            </div>

            {/* Large Interactive Glossy Drop Swatch Preview */}
            <div className="flex justify-center my-4">
              <div
                className="relative rounded-full shadow-lg transition-transform duration-300"
                style={{
                  width: '74px',
                  height: '74px',
                  backgroundColor: selectedShade.hex,
                  background: selectedShade.gradient,
                  boxShadow: '0 12px 28px rgba(58, 46, 43, 0.22), inset -2px -2px 6px rgba(0,0,0,0.25), inset 3px 3px 6px rgba(255,255,255,0.7)',
                }}
              >
                {/* Glossy droplet reflection highlight */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    width: '18px',
                    height: '10px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    transform: 'rotate(-25deg)',
                    filter: 'blur(0.5px)',
                  }}
                />
              </div>
            </div>

            {/* Swatch Selector Row (4 Swatches) */}
            <div className="flex items-center justify-center gap-4 my-6">
              {ELORA_SHADES.map((shade) => {
                const isSelected = selectedShade.id === shade.id;
                return (
                  <div
                    key={shade.id}
                    onClick={() => handleSelect(shade)}
                    className={`p-1 rounded-full cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-1 ring-[#3A2E2B] scale-105' : 'hover:opacity-80'
                    }`}
                    style={{
                      padding: '4px',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: isSelected ? '1.5px solid #3A2E2B' : '1.5px solid transparent',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    }}
                    title={shade.name}
                    aria-label={`Select shade ${shade.name}`}
                  >
                    <div
                      style={{
                        backgroundColor: shade.hex,
                        background: shade.gradient,
                        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.55), inset -2px -2px 4px rgba(0,0,0,0.25)',
                      }}
                      className="w-10 h-10 rounded-full shadow-inner border border-black/5"
                    />
                  </div>
                );
              })}
            </div>

            {/* Action Button: Add Selected Shade */}
            <div className="mt-7 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleAddShadeToBag}
                className="w-full py-3.5 px-6 rounded-full bg-[#3A2E2B] hover:bg-[#261B18] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '999px',
                  backgroundColor: added ? '#27672B' : '#3A2E2B',
                  color: '#FAF6F0',
                  border: 'none',
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {added ? (
                  <>
                    <Check size={14} />
                    <span>SHADE ADDED TO BAG</span>
                  </>
                ) : (
                  <span>SELECT {selectedShade.name.toUpperCase()} — $54</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsShadePdpOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7D4F44',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  marginTop: '4px',
                  transition: 'opacity 0.2s ease',
                }}
                className="hover:opacity-75"
              >
                <span>View Full {selectedShade.name} Page</span>
                <ArrowRight size={12} />
              </button>

              <span className="text-[10px] text-[#3A2E2B]/50 tracking-wider uppercase mt-1">
                Complimentary Privé Shipping Included
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Shade Full-Screen Product Detail Page */}
      <ShadeDetailView
        isOpen={isShadePdpOpen}
        initialShade={selectedShade}
        onClose={() => setIsShadePdpOpen(false)}
        onAddToCart={onAddToCart}
      />
    </>
  );
}
