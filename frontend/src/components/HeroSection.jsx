import React from 'react';
import FlowButton from './FlowButton';

/**
 * Full-Bleed Élora Hero Section
 * Edge-to-edge background photograph with bottom-left editorial overlay.
 * Image placeholder: /images/hero-model.jpg (object-fit: cover, 100vh)
 */
export default function HeroSection({ onShopHero }) {
  return (
    <section className="elora-full-bleed-hero" id="hero">
      {/* ==========================================================================
          ASSET PATH FOR IMAGE REPLACEMENT:
          Replace '/images/hero-model.jpg' with your custom model/lifestyle photograph
          ========================================================================== */}
      <div className="elora-hero-media-wrap">
        <picture className="elora-hero-picture">
          <img
            src="/images/hero-model.jpg"
            alt="Élora Skin & Beauty — The Glazed Barrier Elixir"
            className="elora-hero-image"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {/* Soft editorial gradient scrim for optimal typography legibility */}
        <div className="elora-hero-scrim" />
      </div>

      {/* Bottom-Left Content Overlay */}
      <div className="elora-hero-content-overlay">
        <div className="elora-hero-content-inner">
          <div className="elora-eyebrow-tag">
            AWARD-WINNING FORMULATION
          </div>

          <h1 className="elora-hero-headline">
            The Glazed<br />
            <em>Barrier Elixir.</em>
          </h1>

          <p className="elora-hero-subtext">
            Instant dew. Lasting barrier care.
          </p>

          <div className="elora-cta-wrap">
            <FlowButton
              text="SHOP THE ELIXIR"
              onClick={onShopHero}
              ariaLabel="Shop The Elixir"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
