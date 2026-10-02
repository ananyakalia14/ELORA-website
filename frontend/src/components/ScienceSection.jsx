import React from 'react';
import { Sparkles, Dna, Shield, Droplets } from 'lucide-react';

export default function ScienceSection() {
  const pillars = [
    {
      title: 'High-Altitude Alpine Botanicals',
      desc: 'French Alpine Roses flourish under intense UV exposure and extreme sub-zero winds, concentrating potent epigenetic protective enzymes and bio-flavonoids.',
      icon: Sparkles
    },
    {
      title: '5-Tier Oligo Molecular Delivery',
      desc: 'Conventional hyaluronic acid sits superficially. Our 5-tier formula spans from macro molecules down to 5 kDa micro-peptides that penetrate the deepest epidermal layers.',
      icon: Droplets
    },
    {
      title: 'Phyto-Retinol Bio-Synergy',
      desc: '1.5% cold-pressed Babchi Bakuchiol combined with 5% purified Niacinamide accelerates healthy turnover without redness, photosensitivity, or barrier peeling.',
      icon: Dna
    },
    {
      title: 'Cold-Spun Lipid Envelope',
      desc: 'Never heated past 32°C. Cold-pressed French Plum Kernel and biomimetic ceramides lock in hydration while fortifying the cutaneous microbiome.',
      icon: Shield
    }
  ];

  return (
    <section className="section-padding" id="science" style={{ background: '#FFFDF9' }}>
      <div className="science-container">
        {/* Left Column: Macro Botanical Visual */}
        <div style={{ position: 'relative' }}>
          <div className="science-media-frame">
            <img
              src="/images/elora-botanical-rose.jpg"
              alt="Macro close up of wild French Alpine Rose with glistening botanical nectar dew droplet"
              loading="lazy"
            />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '20px',
              background: 'rgba(249, 246, 240, 0.95)',
              backdropFilter: 'blur(12px)',
              padding: '16px 24px',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 12px 30px rgba(58, 46, 43, 0.1)',
            }}
          >
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#776863' }}>
              Alpine Extraction Method
            </div>
            <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.25rem', color: 'var(--color-espresso)' }}>
              Sub-Zero Cryo-Distillation
            </div>
          </div>
        </div>

        {/* Right Column: Science Explanation */}
        <div>
          <span className="section-eyebrow">Botanical Alchemy &amp; Dermatology</span>
          <h2 className="section-title">Formulation Without Compromise</h2>
          <p className="section-description" style={{ marginBottom: '2rem' }}>
            We reject the false dichotomy between pure botanical gentleness and aggressive clinical results.
            Every Élora bottle harmonizes high-potency cellular actives with restorative natural lipids.
          </p>

          <div className="science-pill-row">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="science-pill-item">
                  <div className="science-bullet-dot" />
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--color-espresso)', marginBottom: '4px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-espresso-light)', lineHeight: 1.6, fontWeight: 300 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
