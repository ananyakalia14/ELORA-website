import React from 'react';
import ProductCarousel from './ProductCarousel';
import ExplodedGlazingMilkVideo from './GlazingMilkExploded';
import { DEFAULT_CAROUSEL_PRODUCTS } from '../data/carouselProducts';

/**
 * The Botanical Edit Section
 * Powered by the Glazing Milk Anatomy Exploded View and Standalone Product Carousel
 */
export default function ProductSection({ onAddToCart, onQuickView }) {
  return (
    <section id="shop" style={{ position: 'relative', overflow: 'visible' }}>
      {/* Header: Five Essentials */}
      <div className="section-padding" style={{ paddingBottom: '2rem' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="section-eyebrow">THE ÉLORA EDIT</span>
          <h2 className="section-title">Five essentials. One signature glow.</h2>
          <p className="section-description">
            Prep. Tint. Flush. Nourish. Glow.
          </p>
        </div>
      </div>

      {/* Scroll-driven Glazing Milk Anatomy Exploded View */}
      <ExplodedGlazingMilkVideo />

      {/* Standalone Carousel Cards */}
      <div className="section-padding" style={{ paddingTop: '3rem' }}>
        <ProductCarousel
          products={DEFAULT_CAROUSEL_PRODUCTS}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      </div>
    </section>
  );
}

