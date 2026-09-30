import React, { useEffect, useRef, useState } from 'react';

interface Annotation {
  id: string;
  badge: string;
  title: string;
  desc: string;
  start: number;
  end: number;
  position: React.CSSProperties;
}

const annotations: Annotation[] = [
  {
    id: 'cap',
    badge: 'AIRTIGHT BARRIER',
    title: 'Soft-Touch Alabaster Cap',
    desc: 'Precision seal prevents oxidation and locks in botanical active potency.',
    start: 0.15,
    end: 0.45,
    position: { top: '22%', left: '8%' }
  },
  {
    id: 'core',
    badge: 'BIO-CELLULAR COMPLEX',
    title: 'Luminous Ceramide Milk',
    desc: 'Alpine rose stem cells micro-emulsified in cold-pressed plum ceramides.',
    start: 0.4,
    end: 0.7,
    position: { top: '45%', right: '8%' }
  },
  {
    id: 'flacon',
    badge: 'SUSTAINABLE LUXURY',
    title: 'UV-Shielded Recycled Flacon',
    desc: 'Heavyweight flacon engineered to protect light-sensitive phyto-nutrients.',
    start: 0.65,
    end: 0.95,
    position: { bottom: '18%', left: '8%' }
  }
];

export default function ExplodedGlazingMilkVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      
      const currentScroll = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
      setProgress(currentScroll);

      if (videoRef.current.duration) {
        videoRef.current.currentTime = currentScroll * videoRef.current.duration;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      style={{
        position: 'relative',
        height: '240vh',
        backgroundColor: '#FAF6F0',
        color: '#3A2E2B'
      }}
    >
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
          padding: '0 24px'
        }}
      >
        <div style={{ textAlign: 'center', zIndex: 10, marginBottom: '16px' }}>
          <span 
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#3A2E2B',
              border: '1px solid rgba(58, 46, 43, 0.25)',
              borderRadius: '9999px',
              padding: '4px 16px',
              display: 'inline-block',
              marginBottom: '10px'
            }}
          >
            Formulation Architecture
          </span>
          <h2 
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 400,
              margin: 0,
              color: '#3A2E2B'
            }}
          >
            Anatomy of the Glazing Milk
          </h2>
        </div>

        <div 
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            height: '65vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(58, 46, 43, 0.1)',
              backgroundColor: '#EDE7DE'
            }}
          >
            <video
              ref={videoRef}
              src="/videos/glazing-milk-exploded.mp4"
              playsInline
              muted
              preload="auto"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {annotations.map((item) => {
            const isVisible = progress >= item.start && progress <= item.end;
            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  ...item.position,
                  maxWidth: '280px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(58, 46, 43, 0.12)',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  boxShadow: '0 12px 30px rgba(58, 46, 43, 0.08)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                  pointerEvents: isVisible ? 'auto' : 'none',
                  zIndex: 20
                }}
              >
                <span 
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: '#8C6D62'
                  }}
                >
                  {item.badge}
                </span>
                <h4 
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '19px',
                    margin: '4px 0 6px 0',
                    color: '#3A2E2B'
                  }}
                >
                  {item.title}
                </h4>
                <p 
                  style={{
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: 'rgba(58, 46, 43, 0.75)',
                    margin: 0
                  }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div 
          style={{
            position: 'absolute',
            bottom: '20px',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(58, 46, 43, 0.45)'
          }}
        >
          {progress < 0.9 ? 'Scroll to disassemble formula' : 'Formula Breakdown Complete'}
        </div>
      </div>
    </section>
  );
}
