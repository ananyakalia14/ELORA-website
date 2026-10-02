import React, { useState } from 'react';

const valuesData = {
  mission: {
    title: 'mission',
    text: 'To RESTORE, PROTECT, and NURTURE the skin you have now for lasting results that reveal themselves over time.'
  },
  philanthropy: {
    title: 'philanthropy',
    text: 'ÉLORA FUTURES FOUNDATION supports organizations that work to dismantle the barriers that hold women back.'
  },
  sustainability: {
    title: 'sustainability',
    text: 'From consciously-sourced ingredients to packaging made with post-consumer recycled materials, we’re committed to MINDFUL SKINCARE.'
  }
};

export default function ValuesSection() {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <section 
      style={{
        width: '100%',
        backgroundColor: '#FAF6F0',
        overflow: 'hidden'
      }}
    >
      <div className="elora-values-grid">
        {/* LEFT 50% COLUMN */}
        <div className="elora-values-left-col">
          {/* Top: Dynamic Statement + Badge */}
          <div>
            {/* Dynamic Text Container - Generous minHeight with visible overflow so text is NEVER hidden */}
            <div 
              style={{ 
                minHeight: '210px', 
                display: 'flex', 
                alignItems: 'flex-start', 
                margin: '0 0 24px 0',
                overflow: 'visible'
              }}
            >
              <p 
                key={activeTab}
                style={{
                  fontFamily: 'Cormorant Garamond, Playfair Display, serif',
                  fontSize: 'clamp(22px, 2.4vw, 34px)',
                  lineHeight: '1.35',
                  color: '#3A2E2B',
                  margin: 0,
                  animation: 'fadeIn 0.25s ease-in-out'
                }}
              >
                {valuesData[activeTab].text}
              </p>
            </div>

            <span 
              style={{
                display: 'inline-block',
                border: '1px solid rgba(58, 46, 43, 0.35)',
                borderRadius: '9999px',
                padding: '4px 14px',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#3A2E2B',
                fontWeight: 500
              }}
            >
              OUR VALUES
            </span>
          </div>

          {/* Bottom: Tabs with '+' indicator - Borderless Clean Layout */}
          <div style={{ width: '100%', marginTop: '40px' }}>
            {['mission', 'philanthropy', 'sustainability'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'color 0.2s ease'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Cormorant Garamond, Playfair Display, serif',
                      fontSize: 'clamp(22px, 2vw, 28px)',
                      color: isActive ? '#3A2E2B' : 'rgba(58, 46, 43, 0.45)',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {tab}
                  </span>
                  <span
                    style={{
                      fontSize: '20px',
                      color: isActive ? '#3A2E2B' : 'rgba(58, 46, 43, 0.35)',
                      transform: isActive ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.25s ease, color 0.2s ease'
                    }}
                  >
                    +
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 50% COLUMN - LOCKED IMAGE CONTAINER */}
        <div className="elora-values-right-col">
          <img 
            src="/images/elora-bottles.jpg"
            alt="Élora Skincare Collection"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    </section>
  );
}
