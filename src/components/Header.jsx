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
  onOpenSearch,
  onOpenAccount,
  introFinished = false,
  onNavigate,
}) {
  const [isScrolled, setIsScrolled] = useState(false);

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
    </>
  );
}
