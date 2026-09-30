import React, { useEffect, useRef } from 'react';

/**
 * GlazingMilkExploded Video Section
 * 
 * Requirements:
 * 1. Expanded video stage with seamless background merging (no floating box or isolated oval).
 *    Section background matches the video's warm silk tones and smoothly dissolves into page cream above and below.
 * 2. Reduced vertical space below the video and above the product carousel (no wasted space).
 * 3. Plays automatically when user scrolls into view.
 * 4. Pauses automatically when user scrolls away.
 * 5. Plays again whenever the user scrolls back to this part of the screen.
 * 6. Sound is ON (unmuted, volume=1.0) with seamless gesture-based browser autoplay policy handling.
 * 7. Completely clean: zero badges, zero controls, zero pause/mute buttons.
 */
export default function ExplodedGlazingMilkVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Ensure volume is 100%
    video.volume = 1.0;

    // Function to ensure audio is unmuted on any user activity
    const enableAudio = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
    };

    const gestureEvents = ['click', 'touchstart', 'keydown', 'scroll', 'wheel', 'pointerdown'];
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, enableAudio, { passive: true });
    });

    // IntersectionObserver: plays when in view, pauses when out of view, replays when returning
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          // User is on this part of the screen -> play
          if (video.ended) {
            video.currentTime = 0;
          }
          video.muted = false;
          video.volume = 1.0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // If browser blocks unmuted autoplay without prior gesture,
              // play muted first and immediately unmute on the very next movement/scroll
              video.muted = true;
              video.play().then(() => {
                const unmuteOnce = () => {
                  if (videoRef.current) {
                    videoRef.current.muted = false;
                    videoRef.current.volume = 1.0;
                  }
                  gestureEvents.forEach((e) => window.removeEventListener(e, unmuteOnce));
                };
                gestureEvents.forEach((e) => {
                  window.addEventListener(e, unmuteOnce, { passive: true, once: true });
                });
              }).catch(() => {});
            });
          }
        } else {
          // User scrolled away from this part of the screen -> pause
          if (!video.paused) {
            video.pause();
          }
        }
      },
      {
        threshold: [0, 0.15, 0.4, 0.7, 1.0],
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, enableAudio);
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="glazing-milk-exploded-section"
      style={{
        position: 'relative',
        // Background matches the video's exact warm silk tones (#D8C8B7 on left, #C6B39E on right, #E5DACD center)
        background: `
          radial-gradient(ellipse 90% 80% at 50% 55%, #E5DACD 0%, #DBCBBA 40%, #CFBDAA 75%, transparent 100%),
          linear-gradient(to right, #D8C8B7 0%, #E0D3C4 35%, #D7C6B3 65%, #C6B39E 100%)
        `,
        padding: '3.5rem 0 0.5rem 0', // Compact bottom padding to eliminate dead space before cards
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Top transition: smoothly dissolves from page cream (#F9F6F0) into the silk atmosphere */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, #F9F6F0 0%, rgba(249, 246, 240, 0.7) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Bottom transition: smoothly dissolves into page cream (#F9F6F0) right above the cards */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, #F9F6F0 0%, rgba(249, 246, 240, 0.7) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Left edge transition: dissolves into the warm background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '160px',
          background: 'linear-gradient(to right, #D8C8B7 0%, rgba(216, 200, 183, 0.6) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Right edge transition: dissolves into the warm background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '160px',
          background: 'linear-gradient(to left, #C6B39E 0%, rgba(198, 179, 158, 0.6) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Editorial Header */}
      <div
        style={{
          maxWidth: '840px',
          margin: '0 auto 1.8rem auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 4,
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

      {/* Expanded Cinematic Video Stage */}
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

        {/* Video Wrapper */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            backgroundColor: 'transparent',
            overflow: 'visible',
            zIndex: 2,
          }}
        >
          <video
            ref={videoRef}
            playsInline
            loop
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: 'transparent',
              pointerEvents: 'none',
              /* Aggressive feathered mask on ALL sides — edges dissolve completely into the background */
              WebkitMaskImage: 'radial-gradient(ellipse 78% 82% at 50% 50%, #000000 50%, rgba(0, 0, 0, 0.8) 65%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.1) 92%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 78% 82% at 50% 50%, #000000 50%, rgba(0, 0, 0, 0.8) 65%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.1) 92%, transparent 100%)',
            }}
          >
            <source src="/glazing-milk-exploded.mp4" type="video/mp4" />
            <source src="/videos/glazing-milk-exploded.mp4" type="video/mp4" />
            <source src="/glazing-milk-exploded.mp4.mp4" type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>
        </div>
      </div>
    </section>
  );
}
