import React, { useEffect, useRef } from 'react';

/**
 * GlazingMilkExploded Video Section
 * 
 * Features:
 * 1. Automatic playback as soon as the user scrolls into view ("when I reach here").
 * 2. Pauses gracefully when scrolled away to preserve performance.
 * 3. Fully dissolved, feathered borders on all sides — eliminates all sharp rectangular video cutoffs.
 * 4. Multi-layer vignette and perimeter gradient dissolves that seamlessly blend the video into the warm silk backdrop.
 */
export default function ExplodedGlazingMilkVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Browser autoplay policy requires muted=true to start playing reliably
    video.muted = true;
    video.defaultMuted = true;

    const playVideo = () => {
      if (!video) return;
      video.muted = true;
      if (video.ended) {
        video.currentTime = 0;
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry muted if needed
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    const pauseVideo = () => {
      if (video && !video.paused) {
        video.pause();
      }
    };

    // 1. IntersectionObserver: triggers as soon as the user reaches this section
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          playVideo();
        } else {
          pauseVideo();
        }
      },
      {
        root: null,
        rootMargin: '80px 0px 80px 0px', // Pre-trigger slightly so it's already playing when reaching here
        threshold: [0, 0.05, 0.15, 0.3],
      }
    );

    observer.observe(container);

    // 2. Scroll listener fallback for instantaneous response on user reach
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!container || !video) {
            ticking = false;
            return;
          }
          const rect = container.getBoundingClientRect();
          const inViewport = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
          if (inViewport) {
            if (video.paused) {
              playVideo();
            }
          } else {
            if (!video.paused) {
              pauseVideo();
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check on load
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="glazing-milk-exploded-section"
      style={{
        position: 'relative',
        background: `
          radial-gradient(ellipse 90% 80% at 50% 55%, #E5DACD 0%, #DBCBBA 40%, #CFBDAA 75%, transparent 100%),
          linear-gradient(to right, #D8C8B7 0%, #E0D3C4 35%, #D7C6B3 65%, #C6B39E 100%)
        `,
        padding: '3.5rem 0 0.5rem 0',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Top transition: smoothly dissolves from page cream (#F9F6F0) into silk atmosphere */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(to bottom, #F9F6F0 0%, rgba(249, 246, 240, 0.8) 35%, rgba(249, 246, 240, 0) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Bottom transition: smoothly dissolves into page cream (#F9F6F0) right above the cards */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '130px',
          background: 'linear-gradient(to top, #F9F6F0 0%, rgba(249, 246, 240, 0.8) 35%, rgba(249, 246, 240, 0) 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Left edge transition: dissolves into the warm background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '180px',
          background: 'linear-gradient(to right, #D8C8B7 0%, rgba(216, 200, 183, 0.7) 45%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Right edge transition: dissolves into the warm background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '180px',
          background: 'linear-gradient(to left, #C6B39E 0%, rgba(198, 179, 158, 0.7) 45%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Editorial Header */}
      <div
        style={{
          maxWidth: '840px',
          margin: '0 auto 1.8rem auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 6,
          padding: '0 4vw',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 400,
            color: '#2E221F',
            margin: '0 0 0.75rem 0',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          Anatomy of the Glazing Milk
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.88rem, 1.2vw, 1.02rem)',
            color: 'rgba(58, 46, 43, 0.78)',
            maxWidth: '580px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}
        >
          French alpine rose stem cells and micronized ceramides suspended in delicate balance to drench skin in barrier-strengthening dew.
        </p>
      </div>

      {/* Cinematic Video Stage */}
      <div
        style={{
          width: '100%',
          maxWidth: '1540px',
          margin: '0 auto',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2vw',
          zIndex: 2,
        }}
      >
        {/* Soft Ambient Glow Halo behind the floating droplets */}
        <div
          style={{
            position: 'absolute',
            inset: '-10%',
            background: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(255, 250, 244, 0.9) 0%, rgba(240, 227, 214, 0.5) 45%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Video Masked Container — applies both CSS hardware-accelerated masks and edge feathering */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            backgroundColor: 'transparent',
            overflow: 'hidden',
            isolation: 'isolate',
            transform: 'translateZ(0)',
            WebkitMaskImage: 'radial-gradient(ellipse 76% 74% at 50% 50%, #000000 40%, rgba(0, 0, 0, 0.85) 60%, rgba(0, 0, 0, 0.4) 75%, transparent 96%)',
            maskImage: 'radial-gradient(ellipse 76% 74% at 50% 50%, #000000 40%, rgba(0, 0, 0, 0.85) 60%, rgba(0, 0, 0, 0.4) 75%, transparent 96%)',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            zIndex: 2,
          }}
        >
          <video
            ref={videoRef}
            playsInline
            loop
            muted
            autoPlay
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: 'transparent',
              pointerEvents: 'none',
            }}
          >
            <source src="/glazing-milk-exploded.mp4" type="video/mp4" />
            <source src="/videos/glazing-milk-exploded.mp4" type="video/mp4" />
            <source src="/glazing-milk-exploded.mp4.mp4" type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>

          {/* Top border dissolve overlay — completely blends the top edge into surrounding tone */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(to bottom, #D7C6B3 0%, rgba(215, 198, 179, 0.85) 30%, rgba(215, 198, 179, 0.4) 65%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Bottom border dissolve overlay — completely blends bottom edge */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(to top, #D4C1AE 0%, rgba(212, 193, 174, 0.85) 30%, rgba(212, 193, 174, 0.4) 65%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Left border dissolve overlay — completely blends left edge */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '160px',
              background: 'linear-gradient(to right, #D8C8B7 0%, rgba(216, 200, 183, 0.9) 35%, rgba(216, 200, 183, 0.3) 75%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Right border dissolve overlay — completely blends right edge */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '160px',
              background: 'linear-gradient(to left, #C6B39E 0%, rgba(198, 179, 158, 0.9) 35%, rgba(198, 179, 158, 0.3) 75%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Perimeter Vignette Feather Overlay — guarantees 0 hard borders anywhere */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 82% 80% at 50% 50%, transparent 55%, rgba(215, 198, 179, 0.45) 75%, rgba(200, 180, 160, 0.95) 98%)',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />
        </div>
      </div>
    </section>
  );
}

