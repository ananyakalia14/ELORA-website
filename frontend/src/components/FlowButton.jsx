import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * FlowButton Component
 * Features morphing border-radius, expanding liquid circle fill, 
 * and bidirectional arrow transition (flowing from right to left).
 */
export default function FlowButton({ 
  text = "SHOP THE ELIXIR", 
  onClick,
  className = "",
  ariaLabel = "Shop The Elixir"
}) {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flow-btn ${className}`}
    >
      {/* Left arrow (arr-2): enters from left on hover */}
      <ArrowRight 
        size={16}
        className="flow-arrow-left" 
      />

      {/* Text: slides from -12px to +12px as arrows transition */}
      <span className="flow-btn-text">
        {text}
      </span>

      {/* Circle: liquid expansion from center */}
      <span className="flow-btn-circle" />

      {/* Right arrow (arr-1): exits to right on hover */}
      <ArrowRight 
        size={16}
        className="flow-arrow-right" 
      />
    </button>
  );
}
