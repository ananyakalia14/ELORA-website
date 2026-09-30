import React from 'react';

/**
 * Editorial Split-Screen Brand Philosophy Section for Élora Skin & Beauty
 * 
 * 1. SECTION CONTAINER & LAYOUT:
 *    - Warm alabaster cream background (#F9F6F0)
 *    - 2-column split on desktop (grid grid-cols-1 lg:grid-cols-2 min-h-[80vh])
 * 
 * 2. LEFT COLUMN:
 *    - Hand with heart cream swatch (src="/images/philosophy-hand.jpg")
 *    - Dual-direction CSS gradient mask (linear-gradient right & bottom)
 *    - Complementary inset gradient overlay dissolving seamlessly into #F9F6F0
 * 
 * 3. RIGHT COLUMN:
 *    - Editorial typography:
 *      * Eyebrow: "THE ÉLORA PHILOSOPHY"
 *      * Headline: "Beauty, but make it intentional."
 *      * Paragraph 1: French botanical tradition & modern skin science
 *      * Philosophy Pillars: 4 stacked statement lines
 *      * CTA: "Discover the ELORA ritual →" with arrow shift on hover
 */
export default function PhilosophySection() {
  const pillars = [
    "We believe in fewer, better steps.",
    "Purposeful ingredients.",
    "Beautiful textures.",
    "And skin that looks like skin — only more luminous."
  ];

  return (
    <section 
      id="philosophy"
      className="philosophy-section bg-[#F9F6F0] w-full min-h-[80vh] grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden relative"
      aria-label="The Élora Philosophy"
    >
      {/* 2. LEFT COLUMN: Hand with Heart Cream Swatch & Seamless Mask Merge */}
      <div className="philosophy-media-col relative w-full h-[380px] sm:h-[480px] lg:h-full lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#F9F6F0]">
        {/* Hand Holding Heart Cream Image - Positioned to the left so the full hand & heart swatch are visible */}
        <img
          src="/images/philosophy-hand.jpg"
          alt="Hand holding an artisanal heart-shaped cream swatch, representing Élora's intentional skincare ritual"
          className="philosophy-hand-img w-full h-full object-cover object-left select-none"
          style={{
            objectPosition: '0% 50%'
          }}
          loading="lazy"
          decoding="async"
        />

        {/* Top Edge Gradient Overlay: Seamless Dissolve into Page Background #F9F6F0 (Desktop & Mobile) */}
        <div 
          className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, #F9F6F0 0%, rgba(249, 246, 240, 0.85) 40%, transparent 100%)'
          }}
          aria-hidden="true" 
        />

        {/* Desktop Gradient Overlay: Right Edge Seamless Dissolve into #F9F6F0 */}
        <div 
          className="absolute inset-y-0 right-0 w-2/5 pointer-events-none hidden lg:block z-10"
          style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(249, 246, 240, 0.5) 40%, #F9F6F0 100%)'
          }}
          aria-hidden="true" 
        />

        {/* Bottom Edge Gradient Overlay: Dissolves into Background (Desktop & Mobile) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, #F9F6F0 0%, rgba(249, 246, 240, 0.85) 45%, transparent 100%)'
          }}
          aria-hidden="true" 
        />
      </div>

      {/* 3. RIGHT COLUMN: The Élora Philosophy Editorial Content */}
      <div className="philosophy-content-col w-full flex flex-col justify-center px-8 md:px-16 lg:px-20 xl:px-24 py-12 lg:py-20 z-10">
        <div className="max-w-xl">
          {/* Micro-Header / Eyebrow */}
          <p className="philosophy-eyebrow uppercase tracking-[0.25em] text-xs md:text-sm font-medium text-[#3A2E2B]/70 mb-4 select-none">
            THE ÉLORA PHILOSOPHY
          </p>

          {/* Main Headline: Editorial High-Contrast Serif */}
          <h2 
            className="philosophy-headline font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3A2E2B] leading-[1.15] mb-8 font-normal"
            style={{
              fontFamily: "var(--font-serif-editorial, 'Cormorant Garamond', 'Playfair Display', Georgia, serif)"
            }}
          >
            Beauty, but make it intentional.
          </h2>

          {/* Paragraph 1: French Botanical Tradition & Skin Science */}
          <p className="philosophy-paragraph text-base md:text-lg text-[#3A2E2B]/85 leading-relaxed mb-6 font-light max-w-xl">
            Born at the intersection of French botanical tradition and modern skin science,
            Élora creates sensorial formulas designed to make everyday skincare feel extraordinary.
          </p>

          {/* Philosophy Pillar List: 4 Key Statements as Elegant Stacked Lines */}
          <ul className="philosophy-pillar-list text-base md:text-lg text-[#3A2E2B] font-light leading-relaxed mb-10 space-y-2 list-none p-0">
            {pillars.map((pillar, idx) => (
              <li key={idx} className="flex items-start">
                <span className="block">{pillar}</span>
              </li>
            ))}
          </ul>

          {/* Call To Action Link: Interactive Border & Glide Arrow */}
          <a
            href="#shop"
            className="philosophy-cta inline-flex items-center gap-2 text-sm md:text-base uppercase tracking-[0.15em] font-medium text-[#3A2E2B] hover:text-[#3A2E2B]/70 transition-all duration-300 border-b border-[#3A2E2B] pb-1 w-fit group"
          >
            <span>Discover the ELORA ritual</span>
            <span 
              className="philosophy-cta-arrow inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
