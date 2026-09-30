import React, { useState, useEffect, useRef } from 'react';

const milkLayers = [
  {
    id: 'cap',
    badge: 'AIRTIGHT BARRIER',
    name: 'Soft-Touch Alabaster Cap',
    description: 'Precision-molded seal prevents oxidation of delicate botanical actives and preserves formula freshness.'
  },
  {
    id: 'core',
    badge: 'BIO-CELLULAR COMPLEX',
    name: 'Luminous Ceramide Milk Core',
    description: 'Alpine rose stem cells micro-emulsified in cold-pressed plum ceramides to drench the stratum corneum in all-day glass glow.'
  },
  {
    id: 'flacon',
    badge: 'SUSTAINABLE OPULENCE',
    name: 'UV-Shielded Recycled Flacon',
    description: 'Custom heavyweight ceramic-glass flacon designed to protect light-sensitive phyto-nutrients.'
  }
];

export default function ExplodedGlazingMilk() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollPercent = Math.min(
        Math.max(-rect.top / (rect.height - windowHeight), 0),
        1
      );
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth explosion distance
  const explode = Math.min(Math.max((progress - 0.15) / 0.7, 0), 1);

  return (
    <section 
      ref={containerRef}
      className="exploded-glazing-milk-section"
      style={{
        position: 'relative',
        height: '240vh',
        backgroundColor: '#F9F6F0',
        color: '#3A2E2B',
        overflow: 'visible',
        width: '100%'
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .exploded-stage-inner {
            height: 600px !important;
          }
          .exploded-card-wrap {
            position: static !important;
            padding: 10px 0 !important;
          }
          .exploded-callout-card {
            max-width: 100% !important;
            margin-bottom: 12px !important;
            align-self: center !important;
          }
        }
      `}</style>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', zIndex: 10 }}>
          <span 
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#3A2E2B',
              display: 'inline-block',
              border: '1px solid rgba(58, 46, 43, 0.25)',
              borderRadius: '9999px',
              padding: '4px 16px',
              marginBottom: '14px',
              fontWeight: 500
            }}
          >
            Formulation Architecture
          </span>
          <h2 
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 400,
              lineHeight: 1.15,
              margin: 0,
              color: '#3A2E2B'
            }}
          >
            Anatomy of the Glazing Milk
          </h2>
        </div>

        {/* Central Stage */}
        <div 
          className="exploded-stage-inner"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            height: '560px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Bottle Assembly Wrapper */}
          <div 
            style={{
              position: 'relative',
              width: '180px',
              height: '460px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Top Cap */}
            <div
              style={{
                position: 'absolute',
                top: '55px',
                transform: `translateY(-${explode * 110}px)`,
                transition: 'transform 0.08s linear',
                zIndex: 3
              }}
            >
              <div 
                style={{
                  width: '110px',
                  height: '100px',
                  backgroundColor: '#ECE5DB',
                  borderRadius: '38px 38px 10px 10px',
                  border: '1px solid rgba(58, 46, 43, 0.08)',
                  boxShadow: '0 15px 35px rgba(58, 46, 43, 0.12)'
                }}
              />
            </div>

            {/* Middle Formula Droplet / Suspension Core */}
            <div
              style={{
                position: 'absolute',
                top: '190px',
                opacity: explode,
                transform: `scale(${0.6 + explode * 0.5})`,
                transition: 'opacity 0.2s ease, transform 0.15s ease',
                zIndex: 4,
                pointerEvents: 'none'
              }}
            >
              <div 
                style={{
                  width: '65px',
                  height: '65px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #FFFFFF 0%, #EDE6DC 70%, #D4C5BD 100%)',
                  boxShadow: '0 0 35px rgba(255, 255, 255, 0.9), 0 10px 25px rgba(58, 46, 43, 0.15)',
                  filter: 'blur(0.5px)'
                }}
              />
            </div>

            {/* Bottom Flacon Body */}
            <div
              style={{
                position: 'absolute',
                top: '155px',
                transform: `translateY(${explode * 110}px)`,
                transition: 'transform 0.08s linear',
                zIndex: 2
              }}
            >
              <div 
                style={{
                  width: '110px',
                  height: '240px',
                  backgroundColor: '#EDE7DE',
                  borderRadius: '10px 10px 32px 32px',
                  border: '1px solid rgba(58, 46, 43, 0.08)',
                  boxShadow: '0 25px 45px rgba(58, 46, 43, 0.14)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '30px 12px 24px 12px',
                  boxSizing: 'border-box'
                }}
              >
                <span 
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '18px',
                    letterSpacing: '0.28em',
                    color: '#3A2E2B',
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                    fontWeight: 600
                  }}
                >
                  ÉLORA
                </span>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, color: '#3A2E2B', fontWeight: 600 }}>
                    Glazing Milk
                  </p>
                  <p style={{ fontSize: '7px', color: 'rgba(58, 46, 43, 0.6)', margin: '2px 0 0 0' }}>
                    160 mL / 5.4 fl oz
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Callout Cards */}
          <div 
            className="exploded-card-wrap"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              padding: '20px 0'
            }}
          >
            {milkLayers.map((layer, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={layer.id}
                  className="exploded-callout-card"
                  style={{
                    alignSelf: isLeft ? 'flex-start' : 'flex-end',
                    maxWidth: '310px',
                    opacity: explode > 0.35 ? 1 : 0,
                    transform: `translateX(${isLeft ? (1 - explode) * -35 : (1 - explode) * 35}px)`,
                    transition: 'opacity 0.35s ease, transform 0.35s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(58, 46, 43, 0.12)',
                    borderRadius: '20px',
                    padding: '18px 22px',
                    boxShadow: '0 15px 30px rgba(58, 46, 43, 0.06)'
                  }}
                >
                  <span 
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      color: '#8C6D62',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}
                  >
                    {layer.badge}
                  </span>
                  <h4 
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '20px',
                      margin: '6px 0 6px 0',
                      color: '#3A2E2B'
                    }}
                  >
                    {layer.name}
                  </h4>
                  <p 
                    style={{
                      fontSize: '12px',
                      lineHeight: '1.55',
                      color: 'rgba(58, 46, 43, 0.75)',
                      margin: 0
                    }}
                  >
                    {layer.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Helper */}
        <div 
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(58, 46, 43, 0.45)'
          }}
        >
          {progress < 0.85 ? 'Scroll to explore formulation' : 'Complete Formula'}
        </div>
      </div>
    </section>
  );
}
