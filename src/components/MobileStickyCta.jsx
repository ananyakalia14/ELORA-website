import React, { useState, useEffect } from 'react';
import { Star, Plus, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function MobileStickyCta({ onAddToCart }) {
  const [visible, setVisible] = useState(false);
  const heroProduct = PRODUCTS[0]; // The Hero Serum

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero section (~480px)
      const pastHero = window.scrollY > 480;
      setVisible(pastHero);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="mobile-sticky-cta-dock" role="region" aria-label="Quick Add to Bag">
      <div className="mobile-sticky-cta-inner">
        <div className="mobile-sticky-product-thumb">
          <img src={heroProduct.image} alt={heroProduct.name} />
        </div>

        <div className="mobile-sticky-product-details">
          <h4 className="mobile-sticky-title">{heroProduct.name}</h4>
          <div className="mobile-sticky-meta">
            <div className="mobile-sticky-rating">
              <Star size={11} fill="#C4A265" color="#C4A265" />
              <span>4.95</span>
            </div>
            <span className="mobile-sticky-dot">•</span>
            <span className="mobile-sticky-price">${heroProduct.price}</span>
          </div>
        </div>

        <button
          className="mobile-sticky-add-btn"
          onClick={() => onAddToCart(heroProduct)}
          aria-label={`Add ${heroProduct.name} to bag`}
        >
          <Plus size={14} />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
}
