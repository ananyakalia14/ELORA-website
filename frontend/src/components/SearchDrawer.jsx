import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, MapPin, Mail, HelpCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { DEFAULT_CAROUSEL_PRODUCTS } from '../data/carouselProducts';

/**
 * Slide-out Search Drawer for Élora Skin & Beauty
 * Replicating Rhode Skin search panel layout & interaction:
 * 1. Full-screen dark scrim backdrop (fixed inset-0 bg-black/40 backdrop-blur-sm z-40)
 * 2. Slide-over panel (fixed top-0 right-0 h-full w-full max-w-[460px] bg-[#FAF6F0] z-50)
 * 3. Header bar with centered lowercase "search" and right-aligned "✕"
 * 4. Rounded-xl input container with "Type here" placeholder
 * 5. Lowercase suggestions list
 * 6. Pinned bottom recommendation bar with micro packshot and "GLAZING MILK ESSENCE"
 */

const SUGGESTIONS = [
  'peptide lip tint balm',
  'glazing milk essence',
  'barrier repair nectar',
  'crème lumineuse',
  'alpine dew mist',
  'botanical elixir',
  'store locator',
  'contact us',
  'faq',
];

export default function SearchDrawer({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Auto-focus input when drawer opens & reset query
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 150);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Combine products for search index
  const allSearchableProducts = React.useMemo(() => {
    const map = new Map();
    // Add standard catalogue products
    PRODUCTS.forEach((p) => {
      map.set(p.name.toLowerCase(), {
        id: p.id,
        name: p.name,
        subtitle: p.subtitle || p.category,
        category: p.category,
        price: p.price,
        formattedPrice: `$${p.price}.00`,
        image: p.image,
        rawProduct: p,
      });
    });
    // Add carousel items (e.g. Glazed Barrier Elixir, Barrier Repair Nectar)
    DEFAULT_CAROUSEL_PRODUCTS.forEach((cp) => {
      const key = cp.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: cp.id,
          name: cp.name,
          subtitle: cp.description,
          category: cp.category,
          price: cp.numericPrice || 98,
          formattedPrice: cp.price,
          image: cp.primaryImage,
          rawProduct: {
            id: cp.id,
            name: cp.name,
            subtitle: cp.description,
            price: cp.numericPrice || 98,
            image: cp.primaryImage,
            description: cp.description,
            category: cp.category,
          },
        });
      }
    });

    // Explicitly guarantee Glazing Milk Essence exists in index
    if (!map.has('glazing milk essence')) {
      map.set('glazing milk essence', {
        id: 'glazing-milk-essence',
        name: 'GLAZING MILK ESSENCE',
        subtitle: 'Ceramide-Infused Botanical Nutrient Veil',
        category: 'Essence',
        price: 44,
        formattedPrice: '$44.00',
        image: '/images/products/elora-glazing-milk.jpg',
        rawProduct: {
          id: 'glazing-milk-essence',
          name: 'GLAZING MILK ESSENCE',
          subtitle: 'Ceramide-Infused Botanical Nutrient Veil',
          price: 44,
          image: '/images/products/elora-glazing-milk.jpg',
          category: 'Essence',
          description: 'A nutrient-dense ceramide milk essence that drenches skin in barrier-strengthening botanical hydration for a dewy glazed gleam.',
        },
      });
    }

    return Array.from(map.values());
  }, []);

  // Filter products by query
  const filteredProducts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Check query terms
    return allSearchableProducts.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const subMatch = (p.subtitle || '').toLowerCase().includes(q);
      const catMatch = (p.category || '').toLowerCase().includes(q);
      return nameMatch || subMatch || catMatch;
    });
  }, [query, allSearchableProducts]);

  // Handle suggestion click
  const handleSuggestionClick = (term) => {
    if (term === 'contact us') {
      onClose();
      const footer = document.querySelector('footer');
      if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    } else if (term === 'faq') {
      onClose();
      const faqSec = document.querySelector('#clinical-accordion') || document.querySelector('footer');
      if (faqSec) faqSec.scrollIntoView({ behavior: 'smooth' });
    } else if (term === 'store locator') {
      onClose();
      alert('Élora Boutiques: Flagship stores in Paris (Place Vendôme), New York (Madison Ave), Tokyo (Ginza), & London (Mayfair).');
    } else {
      setQuery(term);
    }
  };

  // Glazing milk product for bottom pinned bar
  const glazingMilkProduct = {
    id: 'glazing-milk-essence',
    name: 'GLAZING MILK ESSENCE',
    subtitle: 'Ceramide Nutrient Barrier Veil',
    price: 44,
    formattedPrice: '$44.00',
    image: '/images/products/elora-glazing-milk.jpg',
    rawProduct: {
      id: 'glazing-milk-essence',
      name: 'GLAZING MILK ESSENCE',
      subtitle: 'Ceramide Nutrient Barrier Veil',
      price: 44,
      image: '/images/products/elora-glazing-milk.jpg',
      category: 'Essence',
      description: 'A nutrient-dense ceramide milk essence that drenches skin in barrier-strengthening botanical hydration for a dewy glazed gleam.',
    },
  };

  const handleOpenGlazingMilk = () => {
    if (onSelectProduct) {
      onSelectProduct(glazingMilkProduct.rawProduct);
    }
    onClose();
  };

  return (
    <>
      {/* 1. DRAWER ARCHITECTURE & OVERLAY:
          Backdrop: Full-screen dark scrim (fixed inset-0 bg-black/40 backdrop-blur-sm z-40) */}
      <div
        className={`search-drawer-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Slide-over Panel:
          Fixed on right edge (fixed top-0 right-0 h-full z-50 w-full max-w-[460px] bg-[#FAF6F0])
          Smooth entrance animation (translate-x-0 when open, translate-x-full when closed) */}
      <aside
        className={`search-drawer-panel ${isOpen ? 'is-open' : ''}`}
        aria-label="Search Drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* 2. HEADER & INPUT:
            Top Header Bar: Centered "search", Right-aligned "✕" */}
        <div className="search-drawer-header">
          <div className="search-header-spacer" aria-hidden="true" />
          <h2 className="search-drawer-title">search</h2>
          <button
            type="button"
            className="search-drawer-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        {/* Search Input Field */}
        <div className="search-drawer-input-wrapper">
          <div className="search-drawer-input-container">
            <input
              ref={inputRef}
              type="text"
              className="search-drawer-input"
              placeholder="Type here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products and articles"
            />
            {query.length > 0 && (
              <button
                type="button"
                className="search-input-clear-btn"
                onClick={() => {
                  setQuery('');
                  if (inputRef.current) inputRef.current.focus();
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="search-drawer-content">
          {query.trim().length === 0 ? (
            /* 3. SUGGESTIONS LIST (when input is empty) */
            <div className="search-suggestions-container">
              <h3 className="search-drawer-section-title">suggestions:</h3>
              <div className="search-suggestions-list">
                {SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="search-suggestion-item"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* SEARCH RESULTS (when query is entered) */
            <div className="search-results-container">
              <div className="search-results-header">
                <span className="search-results-count">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{query}"
                </span>
                <button
                  type="button"
                  className="search-reset-link"
                  onClick={() => setQuery('')}
                >
                  view suggestions
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="search-results-list">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="search-product-card"
                      onClick={() => {
                        if (onSelectProduct) onSelectProduct(product.rawProduct);
                        onClose();
                      }}
                    >
                      <div className="search-product-thumb-box">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="search-product-thumb-img"
                          onError={(e) => {
                            e.currentTarget.src = '/images/elora-hero-serum.jpg';
                          }}
                        />
                      </div>
                      <div className="search-product-info">
                        <span className="search-product-category">{product.category}</span>
                        <h4 className="search-product-title">{product.name}</h4>
                        <span className="search-product-price">{product.formattedPrice}</span>
                      </div>
                      <div className="search-product-action">
                        <button
                          type="button"
                          className="search-quick-add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onAddToCart) onAddToCart(product.rawProduct);
                            onClose();
                          }}
                          aria-label={`Add ${product.name} to bag`}
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-empty-state">
                  <p className="search-empty-text">No direct product matches found for "{query}".</p>
                  <p className="search-empty-subtext">
                    Try searching for botanical terms like <span className="search-empty-highlight" onClick={() => setQuery('milk')}>milk</span>, <span className="search-empty-highlight" onClick={() => setQuery('tint')}>tint</span>, <span className="search-empty-highlight" onClick={() => setQuery('serum')}>serum</span>, or <span className="search-empty-highlight" onClick={() => setQuery('creme')}>crème</span>.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. PINNED BOTTOM RECOMMENDATION BAR:
            Docked at bottom (border-t border-[#3A2E2B]/10 p-4 bg-[#FAF6F0] flex items-center gap-3)
            Micro packshot (w-8 h-8 object-contain)
            Product title (uppercase tracking-wider text-[11px] font-medium text-[#3A2E2B]) */}
        <div
          className="search-drawer-bottom-bar"
          onClick={handleOpenGlazingMilk}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenGlazingMilk();
            }
          }}
          aria-label="View featured Glazing Milk Essence"
        >
          <div className="search-bottom-thumb-wrap">
            <img
              src="/images/products/elora-glazing-milk.jpg"
              alt="Glazing Milk Essence Packshot"
              className="search-bottom-thumb"
              onError={(e) => {
                e.currentTarget.src = '/images/elora-glazing-milk.jpg';
              }}
            />
          </div>
          <span className="search-bottom-title">GLAZING MILK ESSENCE</span>
          <ArrowRight size={14} className="search-bottom-arrow" aria-hidden="true" />
        </div>
      </aside>
    </>
  );
}
