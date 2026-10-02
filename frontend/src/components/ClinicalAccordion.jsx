import React, { useState } from 'react';
import { CLINICAL_STATS, KEY_ACTIVES_ACCORDION } from '../data/products';
import { ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ClinicalAccordion() {
  const [openActiveId, setOpenActiveId] = useState('active-ectoin'); // open first by default

  const toggleAccordion = (id) => {
    setOpenActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="section-padding clinical-section" id="science">
      <div className="section-header">
        <span className="section-eyebrow">Clinical Performance</span>
        <h2 className="section-title">Verified by Dermatology</h2>
        <p className="section-description">
          Clinically formulated for deep dermal restoration without barrier irritation. Every claim is validated
          by independent 28-day clinical trials.
        </p>
      </div>

      {/* High-Contrast Clinical Statistics Grid */}
      <div className="clinical-stats-grid">
        {CLINICAL_STATS.map((stat, idx) => (
          <div key={idx} className="clinical-stat-card">
            <div className="clinical-stat-percent">{stat.percentage}</div>
            <h3 className="clinical-stat-title">{stat.title}</h3>
            <p className="clinical-stat-desc">{stat.description}</p>
            <div className="clinical-stat-badge">
              <CheckCircle2 size={13} color="#C4A265" />
              <span>Independent In-Vivo Trial</span>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Key Actives Micro-Accordions */}
      <div className="actives-accordion-wrap">
        <div className="actives-header">
          <span className="section-eyebrow" style={{ marginBottom: '0.4rem' }}>
            Bio-Active Formulation Library
          </span>
          <h3 className="actives-title">Key Actives &amp; Cellular Mechanisms</h3>
          <p className="actives-subtitle">
            Explore the bio-technology and sustainable botanical harvesting behind each formula.
          </p>
        </div>

        <div className="accordion-list">
          {KEY_ACTIVES_ACCORDION.map((item) => {
            const isOpen = openActiveId === item.id;
            return (
              <div
                key={item.id}
                className={`accordion-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  className="accordion-trigger"
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-panel-${item.id}`}
                >
                  <div className="accordion-trigger-left">
                    <span className="accordion-item-title">{item.name}</span>
                    <span className="accordion-item-role">{item.role}</span>
                  </div>
                  <div className="accordion-icon-wrap">
                    <ChevronDown
                      size={18}
                      className={`accordion-chevron ${isOpen ? 'is-rotated' : ''}`}
                    />
                  </div>
                </button>

                <div
                  id={`accordion-panel-${item.id}`}
                  className={`accordion-content ${isOpen ? 'is-open' : ''}`}
                  role="region"
                >
                  <div className="accordion-body">
                    <div className="accordion-meta-row">
                      <span className="meta-tag-label">Origin &amp; Extraction:</span>
                      <span className="meta-tag-value">{item.origin}</span>
                    </div>
                    <p className="accordion-text">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
