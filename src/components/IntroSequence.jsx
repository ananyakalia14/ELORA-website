import React, { useState, useEffect, useRef } from 'react';
import EloraLogo from './EloraLogo';

/**
 * IntroSequence Component
 * Buttery smooth 60fps GPU-composited intro sequence:
 * 1. Stroke draws Élora wordmark + leaf + subtitle with hollow 'A' and 'O'.
 * 2. Glides and scales into the top header using pure transform3d (zero layout reflow, zero lag).
 */
export default function IntroSequence({
  onTransitionStart,
  onIntroComplete,
}) {
  // 'drawing' | 'transitioning' | 'complete'
  const [phase, setPhase] = useState('drawing');
  const [transformStyle, setTransformStyle] = useState({
    transform: 'translate3d(-50%, -50%, 0) scale(1)',
  });
  const actorRef = useRef(null);

  useEffect(() => {
    setPhase('drawing');
    setTransformStyle({
      transform: 'translate3d(-50%, -50%, 0) scale(1)',
    });

    // Auto-advance to transition after logo forms (~2.2s)
    const transitionTimer = setTimeout(() => {
      triggerTransition();
    }, 2200);

    return () => clearTimeout(transitionTimer);
  }, []);

  const triggerTransition = () => {
    // Measure target header slot
    const headerSlot = document.getElementById('header-logo-slot');
    let deltaY = 74 - window.innerHeight / 2;
    let targetScale = 140 / 320; // 0.4375

    if (headerSlot) {
      const rect = headerSlot.getBoundingClientRect();
      if (rect.height > 0) {
        const targetCenterY = rect.top + rect.height / 2;
        deltaY = targetCenterY - window.innerHeight / 2;
      }
      const logoSvg = headerSlot.querySelector('svg');
      if (logoSvg) {
        const svgRect = logoSvg.getBoundingClientRect();
        if (svgRect.width > 0) {
          targetScale = svgRect.width / 320;
        }
      }
    }

    setPhase('transitioning');
    if (onTransitionStart) {
      onTransitionStart();
    }

    // Apply hardware-accelerated transform3d
    setTransformStyle({
      transform: `translate3d(-50%, calc(-50% + ${deltaY}px), 0) scale(${targetScale})`,
      transition: 'transform 900ms cubic-bezier(0.76, 0, 0.24, 1)',
    });

    // Complete transition after animation ends
    setTimeout(() => {
      setPhase('complete');
      if (onIntroComplete) onIntroComplete();
    }, 950);
  };

  if (phase === 'complete') {
    return null;
  }

  const isTransitioning = phase === 'transitioning';

  return (
    <>
      {/* Alabaster background overlay */}
      <div
        className={`intro-overlay ${isTransitioning ? 'is-transitioning' : ''}`}
        aria-hidden="true"
      >
        <button
          className="intro-skip-btn"
          onClick={triggerTransition}
          aria-label="Skip intro animation"
        >
          Skip Intro &rarr;
        </button>
      </div>

      {/* GPU-composited moving actor */}
      <div
        ref={actorRef}
        className="transition-logo-actor"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          zIndex: 1000,
          pointerEvents: 'none',
          willChange: 'transform',
          ...transformStyle,
        }}
      >
        <EloraLogo
          variant="vector"
          animated={true}
          width={320}
          className="intro-center-logo"
        />
      </div>
    </>
  );
}
