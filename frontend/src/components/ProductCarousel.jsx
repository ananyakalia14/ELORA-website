import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star, Plus } from 'lucide-react';
import { DEFAULT_CAROUSEL_PRODUCTS } from '../data/carouselProducts';


/**
 * Standalone 3-Item Product Carousel Component for Élora Skin & Beauty
 * Inspired by luxury editorial layout:
 * - Desktop: Exactly 3 cards side-by-side with 24px gap
 * - Floating circular navigation chevrons
 * - Mobile/Tablet: Native touch swipe with CSS scroll-snapping
 * - Texts directly on image with zero separate boxes
 * - Dual-layer image hover swap effect with 300ms cross-fade and zero layout shift
 */
export default function ProductCarousel({
  products = DEFAULT_CAROUSEL_PRODUCTS,
  onAddToCart,
  onQuickView
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollState();
      el.addEventListener('scroll', checkScrollState, { passive: true });
      window.addEventListener('resize', checkScrollState, { passive: true });
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollState);
      }
      window.removeEventListener('resize', checkScrollState);
    };
  }, [products]);

  const handleScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardEl = el.querySelector('.elora-carousel-card');
    const cardWidth = cardEl ? cardEl.offsetWidth : 360;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleCardAdd = (product, e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.numericPrice || parseFloat(product.price.replace('$', '')),
        image: product.primaryImage,
        volume: product.description,
      });
    }
  };

  return (
    <div className="elora-carousel-wrapper">
      {/* Floating Left Circular Chevron Button */}
      {canScrollLeft && (
        <button
          className="elora-carousel-chevron elora-carousel-chevron-left"
          onClick={() => handleScroll('left')}
          aria-label="Previous products"
          title="Previous products"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Floating Right Circular Chevron Button */}
      {canScrollRight && (
        <button
          className="elora-carousel-chevron elora-carousel-chevron-right"
          onClick={() => handleScroll('right')}
          aria-label="Next products"
          title="Next products"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Scrollable Track with CSS Scroll-Snapping */}
      <div
        ref={scrollContainerRef}
        className="elora-carousel-track"
        tabIndex={0}
        role="region"
        aria-label="Product Carousel"
      >
        {products.map((item) => {
          const isItemHovered = hoveredCardId === item.id;
          return (
            <article
              key={item.id}
              className={`elora-carousel-card ${isItemHovered ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredCardId(item.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => onQuickView && onQuickView(item)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${item.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onQuickView) onQuickView(item);
                }
              }}
            >
              {/* Edge-to-Edge Media Card: No outer box panels, texts on image itself */}
              <div className="elora-card-media-canvas">
                
                {/* PRIMARY PACKSHOT IMAGE (Visible by default) */}
                <img
                  src={item.primaryImage}
                  alt={`${item.name} studio packshot`}
                  className={`elora-image-primary ${isItemHovered ? 'is-faded' : ''}`}
                  loading="lazy"
                />

                {/* SECONDARY TEXTURE/LIFESTYLE IMAGE (Cross-fades in on hover) */}
                {item.hoverImage && (
                  <img
                    src={item.hoverImage}
                    alt={`${item.name} editorial campaign`}
                    className={`elora-image-hover ${isItemHovered ? 'is-active' : ''}`}
                    loading="eager"
                  />
                )}

              {/* Soft Editorial Scrims right over the photo */}
              <div className="elora-card-scrim-top" aria-hidden="true" />
              <div className="elora-card-scrim-bottom" aria-hidden="true" />

              {/* TOP OVERLAY ON IMAGE: Lowercase Category & Pill Badge */}
              <div className="elora-card-top-overlay">
                <span className="elora-card-category">{item.category}</span>
                <span className="elora-card-badge">{item.badge}</span>
              </div>

              {/* FLOATING HOVER QUICK-ADD BUTTON ON IMAGE */}
              <button
                className="elora-quick-add-btn"
                onClick={(e) => handleCardAdd(item, e)}
                aria-label={`Add ${item.name} to bag`}
                title={`Add ${item.name} to bag`}
              >
                <Plus size={14} />
                <span>Add To Bag</span>
              </button>

              {/* BOTTOM OVERLAY ON IMAGE: Static metadata, zero layout shift */}
              <div className="elora-card-bottom-overlay">
                <div className="elora-card-details-left">
                  {/* Star Rating & Review Count */}
                  <div className="elora-card-stars-row">
                    <div className="elora-stars-group" aria-label={`${item.rating} out of 5 stars`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          fill="#C4A265"
                          color="#C4A265"
                          className="elora-star-icon"
                        />
                      ))}
                    </div>
                    <span className="elora-reviews-count">({item.reviews})</span>
                  </div>

                  {/* Uppercase Product Title */}
                  <h3 className="elora-card-title">{item.name}</h3>

                  {/* One-Line Descriptor */}
                  <p className="elora-card-descriptor">{item.description}</p>
                </div>

                {/* Right: Rich Espresso Price */}
                <div className="elora-card-price-wrap">
                  <span className="elora-card-price">{item.price}</span>
                </div>
              </div>

            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}
