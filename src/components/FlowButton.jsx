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
      className={`flow-btn group relative flex items-center justify-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-[#3A2E2B]/40 bg-[rgba(255,253,249,0.85)] backdrop-blur-md px-8 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#3A2E2B] cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-white hover:rounded-[12px] active:scale-[0.95] ${className}`}
    >
      {/* Left arrow (arr-2): enters from left on hover */}
      <ArrowRight 
        size={16}
        className="flow-arrow-left absolute w-4 h-4 left-[-25%] stroke-[#3A2E2B] fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />

      {/* Text: slides from -translate-x-3 to translate-x-3 */}
      <span className="flow-btn-text relative z-[2] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out select-none">
        {text}
      </span>

      {/* Circle: liquid expansion from center */}
      <span 
        className="flow-btn-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#3A2E2B] rounded-[50%] opacity-0 group-hover:w-[320px] group-hover:h-[320px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none" 
      />

      {/* Right arrow (arr-1): exits to right on hover */}
      <ArrowRight 
        size={16}
        className="flow-arrow-right absolute w-4 h-4 right-4 stroke-[#3A2E2B] fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
      />
    </button>
  );
}
