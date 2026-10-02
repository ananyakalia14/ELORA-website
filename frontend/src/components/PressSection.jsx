import React, { useState, useEffect } from 'react';
import { PRESS_QUOTES } from '../data/products';

/**
 * Editorial & Beauty Quotes Carousel
 * Rotates quotes every 7 seconds with smooth cross-fade animation.
 */
export default function PressSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Automatically rotates every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleSelectQuote((activeIndex + 1) % PRESS_QUOTES.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleSelectQuote = (index) => {
    if (index === activeIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsFading(false);
    }, 280);
  };

  const activeQuote = PRESS_QUOTES[activeIndex] || PRESS_QUOTES[0];

  return (
    <section className="press-section" id="press" aria-label="Editorial & Celebrity Beauty Quotes">
      <div 
        className="press-container"
        style={{ 
          maxWidth: '920px', 
          margin: '0 auto', 
          minHeight: '210px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}
      >
        {/* Animated quote text & attribution */}
        <div 
          className={`press-content-wrapper ${isFading ? 'is-fading' : 'is-visible'}`}
          style={{
            opacity: isFading ? 0 : 1,
            transform: isFading ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <p className="press-quote-text">
            &ldquo;{activeQuote.quote}&rdquo;
          </p>
          <p className="press-source-tag">
            {activeQuote.attribution || (activeQuote.author ? `${activeQuote.source} — ${activeQuote.author}` : activeQuote.source)}
          </p>
        </div>

        {/* Carousel indicators */}
        <div 
          className="press-indicators"
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '6px', 
            marginTop: '2.2rem', 
            flexWrap: 'wrap' 
          }}
          role="tablist"
          aria-label="Quote slides"
        >
          {PRESS_QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelectQuote(i)}
              aria-label={`Go to beauty quote ${i + 1}`}
              role="tab"
              aria-selected={activeIndex === i}
              style={{
                width: activeIndex === i ? '28px' : '7px',
                height: '5px',
                borderRadius: '9999px',
                background: activeIndex === i ? '#FFFDF9' : 'rgba(255, 253, 249, 0.28)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
