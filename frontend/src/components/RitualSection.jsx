import React from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { ROUTINE_BUNDLE } from '../data/products';

export default function RitualSection({ onAddRoutineBundle, onSelectProduct }) {
  const steps = [
    {
      stepNum: '01',
      action: 'PREP',
      name: 'Botanical Dew Mist',
      sequenceBadge: 'AM / PM',
      volume: '100ml',
      price: 54,
      image: '/images/elora-botanical-rose.jpg',
      description: 'Micro-diffused floral hydro-infusion preps the stratum corneum and increases serum absorption by +48%.',
      benefit: 'Skin Barrier Prep'
    },
    {
      stepNum: '02',
      action: 'TREAT',
      name: 'The Hero Serum',
      sequenceBadge: 'AM / PM',
      volume: '30ml',
      price: 98,
      image: '/images/elora-hero-serum.jpg',
      description: 'French Alpine Rose stem cells & 5-tier oligo-hyaluronic molecules penetrate dermal layers to ignite glazed glow.',
      benefit: 'Cellular Glazed Radiance'
    },
    {
      stepNum: '03',
      action: 'SEAL',
      name: 'Crème Lumineuse',
      sequenceBadge: 'PM / Night',
      volume: '50ml',
      price: 115,
      image: '/images/elora-cream-jar.jpg',
      description: 'Velvety cold-pressed plum ceramides seal in moisture reserves and reinforce barrier defense while you sleep.',
      benefit: '24-Hour Lipid Seal'
    }
  ];

  return (
    <section className="section-padding ritual-section-wrap" id="ritual">
      <div className="section-header">
        <span className="section-eyebrow">The 3-Step Method</span>
        <h2 className="section-title">The Daily Glaze Routine</h2>
        <p className="section-description">
          Engineered to layer seamlessly for an all-day glass-skin glow. Three essential steps to prep,
          treat, and seal moisture reserves.
        </p>
      </div>

      {/* 3-Column Dedicated Layout */}
      <div className="ritual-three-col-grid">
        {steps.map((st) => (
          <div key={st.stepNum} className="ritual-step-card">
            <div className="ritual-step-image-wrap">
              <img src={st.image} alt={st.name} loading="lazy" />
              <div className="ritual-step-action-tag">
                <span>STEP {st.stepNum}</span> • <strong>{st.action}</strong>
              </div>
              <div className="ritual-sequence-pill">
                {st.sequenceBadge}
              </div>
            </div>

            <div className="ritual-step-body">
              <h3 className="ritual-step-title">{st.name}</h3>
              <p className="ritual-step-meta">{st.volume} • ${st.price}</p>
              <p className="ritual-step-desc">{st.description}</p>
              <div className="ritual-benefit-tag">
                <Sparkles size={12} color="#C4A265" />
                <span>{st.benefit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complete Routine Bundle Callout (Save 15%) */}
      <div className="ritual-bundle-banner">
        <div className="bundle-banner-content">
          <div className="bundle-tag">
            <Sparkles size={14} color="#C4A265" />
            <span>The Daily Glaze 3-Piece Routine</span>
          </div>
          <h3 className="bundle-title">The Daily Glaze 3-Piece Set</h3>
          <p className="bundle-subtitle">
            Includes Step 1: Prep (Dew Mist), Step 2: Treat (The Hero Serum), and Step 3: Seal (Crème Lumineuse).
          </p>
          <div className="bundle-price-row">
            <span className="bundle-price-current">${ROUTINE_BUNDLE.bundlePrice}</span>
            <span className="bundle-price-original">${ROUTINE_BUNDLE.originalPrice}</span>
            <span className="bundle-savings-badge">Save {ROUTINE_BUNDLE.discountPercent}% ($32 off)</span>
          </div>
        </div>

        <button
          className="btn-bundle-cta"
          onClick={() => onAddRoutineBundle(ROUTINE_BUNDLE)}
          aria-label="Add 3-Piece Set (Save 15%)"
        >
          <span>Add 3-Piece Set (Save 15%) &bull; ${ROUTINE_BUNDLE.bundlePrice}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
