import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, X } from 'lucide-react';
import EloraLogo from './EloraLogo';

/**
 * Élora Transparent Navigation Header
 * Left Zone:   SHOP • ABOUT • JOURNAL
 * Center Zone: Centered Élora Logo (id="header-logo-slot")
 * Right Zone:  SEARCH • ACCOUNT • BAG (N)
 */
export default function Header({
  cartCount = 0,
  onOpenCart,
  introFinished = false,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`site-header elora-header ${isScrolled ? 'is-scrolled' : ''}`}
        id="main-site-header"
      >
        {/* Left Zone: SHOP, ABOUT, JOURNAL */}
        <div className="header-left">
          <nav className="header-nav-left" aria-label="Primary Navigation">
            <a
              href="#shop"
              onClick={(e) => scrollToSection(e, '#shop')}
              className="header-nav-link"
            >
              SHOP
            </a>
            <a
              href="#philosophy"
              onClick={(e) => scrollToSection(e, '#philosophy')}
              className="header-nav-link"
            >
              ABOUT
            </a>
            <a
              href="#press"
              onClick={(e) => scrollToSection(e, '#press')}
              className="header-nav-link"
            >
              JOURNAL
            </a>
          </nav>
        </div>

        {/* Center Zone: Centered Élora Logo Target */}
        <div className="header-center" id="header-logo-slot">
          <a
            href="#"
            className="header-logo-anchor"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Élora Skin & Beauty Home"
          >
            <div
              style={{
                opacity: introFinished ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            >
              <EloraLogo
                variant="vector"
                width={140}
                className="header-center-logo"
              />
            </div>
          </a>
        </div>

        {/* Right Zone: SEARCH, ACCOUNT, BAG (N) */}
        <div className="header-right">
          {/* Search Action */}
          <button
            className="header-nav-link header-action-text desktop-only"
            onClick={() => setSearchModalOpen(true)}
            aria-label="Search products"
          >
            SEARCH
          </button>

          {/* Account Action */}
          <button
            className="header-nav-link header-action-text desktop-only"
            onClick={() => alert('Élora Account portal: Please log in or register.')}
            aria-label="User Account"
          >
            ACCOUNT
          </button>

          {/* Bag with Count Badge */}
          <button
            className="header-cart-btn"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
          >
            <span className="cart-text">BAG</span>
            <span className="cart-count-pill">({cartCount})</span>
          </button>
        </div>
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div
          className="drawer-overlay is-open"
          onClick={() => setSearchModalOpen(false)}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}
        >
          <div
            className="search-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <Search size={18} color="#776863" />
              <input
                type="text"
                placeholder="Search the collection (e.g. Hero Serum, Dew Mist)..."
                autoFocus
                className="search-modal-input"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-espresso)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: '#776863' }}>Popular:</span>
              {['The Hero Serum', 'Crème Lumineuse', 'Dew Mist', 'Peptide Lip Tint'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchModalOpen(false)}
                  style={{
                    background: '#F4EFE7',
                    border: '1px solid var(--color-border)',
                    borderRadius: '9999px',
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    color: 'var(--color-espresso)'
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


    </>
  );
}
