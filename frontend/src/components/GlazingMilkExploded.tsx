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

    // Touch handler for mobile autoplay policies
    const handleTouchStart = () => {
      if (video && video.paused) {
        playVideo();
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true, once: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="glazing-milk-exploded-section"
      id="glazing-milk-anatomy"
    >
      {/* Top transition: smoothly dissolves from page cream into silk atmosphere */}
      <div className="glazing-section-top-scrim" />

      {/* Bottom transition: smoothly dissolves into page cream right above the cards */}
      <div className="glazing-section-bottom-scrim" />

      {/* Side background blend gradients */}
      <div className="glazing-section-left-scrim" />
      <div className="glazing-section-right-scrim" />

      {/* Editorial Header */}
      <div className="glazing-section-header">
        <span className="glazing-section-eyebrow">PATENTED FORMULATION</span>
        <h2 className="glazing-section-title">
          Anatomy of the Glazing Milk
        </h2>
        <p className="glazing-section-subtext">
          French alpine rose stem cells and micronized ceramides suspended in delicate balance to drench skin in barrier-strengthening dew.
        </p>
      </div>

      {/* Cinematic Video Stage */}
      <div className="glazing-video-stage-container">
        {/* Soft Ambient Glow Halo behind the floating droplets */}
        <div className="glazing-video-ambient-glow" />

        {/* Responsive Video Container */}
        <div className="glazing-video-frame">
          <video
            ref={videoRef}
            playsInline
            loop
            muted
            autoPlay
            preload="auto"
            className="glazing-exploded-video-el"
          >
            <source src="/glazing-milk-exploded.mp4" type="video/mp4" />
            <source src="/videos/glazing-milk-exploded.mp4" type="video/mp4" />
            <source src="/glazing-milk-exploded.mp4.mp4" type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>

          {/* Dissolve edge overlays */}
          <div className="glazing-video-edge-top" />
          <div className="glazing-video-edge-bottom" />
          <div className="glazing-video-edge-left" />
          <div className="glazing-video-edge-right" />
          <div className="glazing-video-vignette" />
        </div>
      </div>
    </section>
  );
}

