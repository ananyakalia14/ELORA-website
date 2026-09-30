import React from 'react';
import ProductCarousel from './ProductCarousel';
import ExplodedGlazingMilkVideo from './GlazingMilkExploded';
import ShadeExplorer from './ShadeExplorer';
import { DEFAULT_CAROUSEL_PRODUCTS } from '../data/carouselProducts';

/**
 * The Botanical Edit Section
 * Powered by the Glazing Milk Anatomy Exploded View and Standalone Product Carousel
 */
export default function ProductSection({ onAddToCart, onQuickView }) {
  return (
    <section id="shop-section" style={{ position: 'relative', overflow: 'visible' }}>
      {/* 1. Scroll-driven Glazing Milk Anatomy Exploded View */}
      <ExplodedGlazingMilkVideo />

      {/* 2. Header: The Élora Edit - Five Essentials (Positioned directly ABOVE cards and BELOW video) */}
      <div
        id="shop"
        className="section-padding"
        style={{
          paddingTop: '3.75rem',
          paddingBottom: '2.5rem',
          scrollMarginTop: '80px',
        }}
      >
        <div className="section-header" style={{ marginBottom: 0, maxWidth: '100%', width: '100%' }}>
          <span
            className="section-eyebrow"
            style={{
              color: '#C29F82',
              letterSpacing: '0.22em',
              fontSize: '0.78rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              display: 'inline-block',
            }}
          >
            THE ÉLORA EDIT
          </span>

          <h2
            className="section-title"
            style={{
              fontFamily: "var(--font-serif-display, 'Italiana', 'Cormorant Garamond', Georgia, serif)",
              fontSize: 'clamp(1.35rem, 3.6vw, 3.3rem)',
              lineHeight: 1.2,
              fontWeight: 400,
              color: '#2E1A16',
              margin: '0 auto 1.4rem auto',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
              textAlign: 'center',
            }}
          >
            Five essentials. One signature glow.
          </h2>

          <p
            className="section-description"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(0.95rem, 1.2vw, 1.08rem)',
              color: '#5A4A45',
              fontWeight: 400,
              letterSpacing: '0.02em',
              margin: 0,
            }}
          >
            Prep. Tint. Flush. Nourish. Glow.
          </p>

          {/* Interactive Expandable Shade Explorer */}
          <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem' }}>
            <ShadeExplorer onAddToCart={onAddToCart} buttonText="Shades" />
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#7F6B64',
                fontWeight: 600,
              }}
            >
              Explore Shades
            </span>
          </div>
        </div>
      </div>

      {/* 3. Standalone Carousel Cards */}
      <div style={{ padding: '0 4vw 4.5rem 4vw' }}>
        <ProductCarousel
          products={DEFAULT_CAROUSEL_PRODUCTS}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      </div>
    </section>
  );
}

