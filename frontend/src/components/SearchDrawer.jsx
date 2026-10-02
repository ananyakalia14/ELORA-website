import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, MapPin, Mail, HelpCircle } from 'lucide-react';
import { DEFAULT_CAROUSEL_PRODUCTS } from '../data/carouselProducts';

/**
 * Slide-out Search Drawer for Élora Skin & Beauty
 * Shows ONLY authentic, existing products and store pages.
 */

const SUGGESTIONS = [
  'glazing milk essence',
  'the glazed barrier elixir',
  'peptide lip tint',
  'barrier repair nectar',
  'lip liner',
  'the journal',
  'store locator',
  'contact us',
  'faq',
];

// Curated search index containing only authentic Élora Edit products and valid shades
const AUTHENTIC_PRODUCTS = [
  {
    id: 'lumineuse',
    name: 'GLAZING MILK ESSENCE',
    subtitle: 'Milky ceramide essence for a glazed, barrier-strengthened finish',
    category: 'Lait',
    price: 115,
    formattedPrice: '$115.00',
    image: '/images/elora-glazing-milk.jpg',
    keywords: 'glazing milk essence ceramide lait facial hydration barrier dew l\'essence standard reserve',
    rawProduct: {
      id: 'lumineuse',
      name: 'GLAZING MILK ESSENCE',
      category: 'lait',
      price: 115,
      image: '/images/elora-glazing-milk.jpg',
      isGlazingMilk: true,
      description: 'Milky ceramide essence for a glazed, barrier-strengthened finish',
    },
  },
  {
    id: 'elixir',
    name: 'THE GLAZED BARRIER ELIXIR',
    subtitle: 'Tinted skincare for a sheer, glazed finish',
    category: 'Éclat',
    price: 128,
    formattedPrice: '$128.00',
    image: '/images/products/elixir-packshot.jpg',
    keywords: 'the glazed barrier elixir tinted skincare sheer glow éclat alpine rose cellular serum',
    rawProduct: {
      id: 'elixir',
      name: 'THE GLAZED BARRIER ELIXIR',
      category: 'éclat',
      price: 128,
      image: '/images/products/elixir-packshot.jpg',
      description: 'Tinted skincare for a sheer, glazed finish',
    },
  },
  {
    id: 'brume',
    name: 'PEPTIDE LIP TINT',
    subtitle: 'Peptide lip tint with a soft, glossy finish',
    category: 'Teinte',
    price: 54,
    formattedPrice: '$54.00',
    image: '/images/products/mist-packshot.jpg',
    keywords: 'peptide lip tint balm butterscotch cinnamon coffee lemon pistachio raspberry strawberry gloss treatment glaze teinte',
    rawProduct: {
      id: 'brume',
      name: 'PEPTIDE LIP TINT',
      category: 'teinte',
      price: 54,
      image: '/images/products/mist-packshot.jpg',
      description: 'Peptide lip tint with a soft, glossy finish',
    },
  },
  {
    id: 'hero-serum',
    name: 'COLOR, THE ÉLORA WAY',
    subtitle: 'Precision contouring & shaping lip liner',
    category: 'La Couleur',
    price: 98,
    formattedPrice: '$98.00',
    image: '/images/elora-hero-serum.jpg',
    keywords: 'color the elora way lip liner shape sculpt lean stretch flex spin move contour la couleur',
    rawProduct: {
      id: 'hero-serum',
      name: 'COLOR, THE ÉLORA WAY',
      category: 'la couleur',
      price: 98,
      image: '/images/elora-hero-serum.jpg',
      description: 'A little flush, wherever you want it.',
    },
  },
  {
    id: 'nectar',
    name: 'BARRIER REPAIR NECTAR',
    subtitle: 'Alpine rose cellular infusion',
    category: 'Nectar',
    price: 48,
    formattedPrice: '$48.00',
    image: '/images/products/nectar-packshot.jpg',
    keywords: 'barrier repair nectar alpine rose cellular infusion soothing calming treatment',
    rawProduct: {
      id: 'nectar',
      name: 'BARRIER REPAIR NECTAR',
      category: 'nectar',
      price: 48,
      image: '/images/products/nectar-packshot.jpg',
      description: 'Alpine rose cellular infusion',
    },
  },
];

export default function SearchDrawer({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  onNavigate,
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

  // Filter products by query strictly against authentic catalogue
  const filteredProducts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return AUTHENTIC_PRODUCTS.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const subMatch = (p.subtitle || '').toLowerCase().includes(q);
      const catMatch = (p.category || '').toLowerCase().includes(q);
      const keyMatch = (p.keywords || '').toLowerCase().includes(q);
      return nameMatch || subMatch || catMatch || keyMatch;
    });
  }, [query]);

  // Handle suggestion click
  const handleSuggestionClick = (term) => {
    const t = term.toLowerCase().trim();
    if (t === 'contact us' || t === 'contact') {
      onClose();
      if (onNavigate) {
        onNavigate('#contact');
      } else {
        window.location.hash = '#contact';
      }
    } else if (t === 'faq' || t === 'faqs') {
      onClose();
      if (onNavigate) {
        onNavigate('#faq');
      } else {
        window.location.hash = '#faq';
      }
    } else if (t === 'store locator' || t === 'stores') {
      onClose();
      if (onNavigate) {
        onNavigate('#stores');
      } else {
        window.location.hash = '#stores';
      }
    } else if (t === 'the journal' || t === 'journal') {
      onClose();
      if (onNavigate) {
        onNavigate('#journal');
      } else {
        window.location.hash = '#journal';
      }
    } else {
      setQuery(term);
    }
  };

  // Glazing milk product for bottom pinned recommendation bar
  const glazingMilkProduct = AUTHENTIC_PRODUCTS[0];

  const handleOpenGlazingMilk = () => {
    if (onSelectProduct) {
      onSelectProduct(glazingMilkProduct.rawProduct);
    }
    onClose();
  };

  return (
    <>
      {/* 1. DRAWER ARCHITECTURE & OVERLAY */}
      <div
        className={`search-drawer-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Slide-over Panel */}
      <aside
        className={`search-drawer-panel ${isOpen ? 'is-open' : ''}`}
        aria-label="Search Drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* 2. HEADER & INPUT */}
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
                    Try searching for botanical terms like <span className="search-empty-highlight" onClick={() => setQuery('milk')}>milk</span>, <span className="search-empty-highlight" onClick={() => setQuery('tint')}>tint</span>, <span className="search-empty-highlight" onClick={() => setQuery('elixir')}>elixir</span>, <span className="search-empty-highlight" onClick={() => setQuery('nectar')}>nectar</span>, or <span className="search-empty-highlight" onClick={() => setQuery('liner')}>liner</span>.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. PINNED BOTTOM RECOMMENDATION BAR */}
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
