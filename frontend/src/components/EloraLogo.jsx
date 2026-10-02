import React from 'react';
import { LOGO_VIEWBOX, LOGO_GLYPHS, LOGO_COMBINED_PATH } from '../logoData';

/**
 * EloraLogo Component
 * Accurately renders the Élora wordmark with proper compound paths
 * ensuring hollow counters in 'A', 'O', and 'R', and seamless GPU-accelerated drawing.
 */
export default function EloraLogo({
  variant = 'vector',
  className = '',
  width = 160,
  animated = false,
  strokeColor = '#3A2E2B',
  fillColor = '#3A2E2B',
  style = {},
}) {
  if (variant === 'image') {
    return (
      <img
        src="/elora-logo.png"
        alt="Élora Skin & Beauty"
        className={`elora-logo-img ${className}`}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: 'auto',
          display: 'block',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={`elora-logo-wrapper ${animated ? 'is-animating' : ''} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        aspectRatio: '432 / 188',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <svg
        viewBox={LOGO_VIEWBOX}
        className="elora-svg-root"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          display: 'block',
        }}
        aria-label="Élora Skin & Beauty"
      >
        {animated ? (
          <g className="elora-animated-group">
            {LOGO_GLYPHS.map((glyph) => (
              <path
                key={glyph.id}
                id={`glyph-${glyph.id}`}
                d={glyph.d}
                fillRule="evenodd"
                clipRule="evenodd"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`elora-glyph-path ${glyph.isLeaf ? 'is-leaf-accent' : ''}`}
                style={{
                  strokeDasharray: glyph.length,
                  strokeDashoffset: glyph.length,
                  animation: `glyphDraw 1.3s cubic-bezier(0.25, 1, 0.5, 1) ${glyph.delay}s forwards, glyphFill 0.65s ease-out ${0.7 + glyph.delay}s forwards`,
                }}
              />
            ))}
          </g>
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={LOGO_COMBINED_PATH}
            fill={fillColor}
            className="elora-static-path"
          />
        )}
      </svg>
    </div>
  );
}
