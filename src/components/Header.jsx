import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, X, Menu, ArrowRight } from 'lucide-react';
import EloraLogo from './EloraLogo';

/**
 * Élora Transparent Navigation Header
 * Left Zone:   SHOP • ABOUT • JOURNAL (Desktop) / Hamburger Menu (Mobile)
 * Center Zone: Centered Élora Logo (id="header-logo-slot")
 * Right Zone:  SEARCH • ACCOUNT • BAG (N)
 */
export default function Header({
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  introFinished = false,
  onNavigate,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
      return;
    }
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
        {/* Left Zone: SHOP, ABOUT, JOURNAL (Desktop) & Menu Toggle (Mobile) */}
        <div className="header-left">
          <button
            className="header-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="header-nav-left desktop-only" aria-label="Primary Navigation">
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
              href="#journal"
              onClick={(e) => scrollToSection(e, '#journal')}
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
              if (onNavigate) {
                onNavigate('#');
                return;
              }
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
          {/* Search Action Desktop */}
          <button
            className="header-nav-link header-action-text desktop-only"
            onClick={onOpenSearch}
            aria-label="Search products"
          >
            SEARCH
          </button>

          {/* Search Action Mobile */}
          <button
            className="header-search-btn-mobile"
            onClick={onOpenSearch}
            aria-label="Search products"
          >
            <Search size={18} />
          </button>

          {/* Account Action Desktop */}
          <button
            className="header-nav-link header-action-text desktop-only"
            onClick={onOpenAccount}
            aria-label="User Account"
          >
            ACCOUNT
          </button>

          {/* Account Action Mobile */}
          <button
            className="header-search-btn-mobile"
            onClick={onOpenAccount}
            aria-label="User Account"
          >
            <User size={18} />
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

      {/* Luxury Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="elora-mobile-nav-drawer" role="dialog" aria-modal="true">
          <div className="elora-mobile-nav-inner">
            <div className="elora-mobile-nav-header">
              <span className="elora-mobile-nav-tag">ÉLORA DIRECTORY</span>
              <button
                className="elora-mobile-nav-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="elora-mobile-nav-links">
              {[
                { label: 'Shop The Collection', href: '#shop', desc: 'Five essentials, one signature glow' },
                { label: 'Our Story & Philosophy', href: '#story', desc: 'French botanical tradition & cellular science' },
                { label: 'French Alpine Actives', href: '#science', desc: 'Sub-zero cryo-distilled Alpine Rose stem cells' },
                { label: 'Cellular Science', href: '#science', desc: '5-tier oligo molecular delivery' },
                { label: 'The Journal', href: '#journal', desc: 'Inaugural Volume I • Essays & ritual guides' },
                { label: 'Store Locator', href: '#stores', desc: 'Paris, New York, Tokyo flagships' },
                { label: 'Atelier Admin', href: '#admin', desc: 'Boutique inventory & order fulfillment' },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="elora-mobile-nav-item"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    scrollToSection(e, link.href);
                  }}
                >
                  <div className="elora-mobile-nav-item-text">
                    <span className="elora-mobile-nav-title">{link.label}</span>
                    <span className="elora-mobile-nav-desc">{link.desc}</span>
                  </div>
                  <ArrowRight size={16} className="elora-mobile-nav-arrow" />
                </a>
              ))}
            </nav>

            <div className="elora-mobile-nav-footer">
              <button
                className="elora-mobile-nav-action-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
              >
                <Search size={16} />
                <span>Search Products</span>
              </button>
              <button
                className="elora-mobile-nav-action-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccount();
                }}
              >
                <User size={16} />
                <span>Client Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
