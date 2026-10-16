import React from 'react';

/**
 * HeroCurve Component
 * 
 * Refined shallow, symmetrical organic curve with reduced depth.
 */
export default function HeroCurve({ className = '' }) {
  return (
    <div className={`bb-hero-curve-container bb-header-middle-layer ${className}`} aria-hidden="true">
      <svg
        className="bb-hero-curve-svg bb-curve-svg"
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 0
             L 1000 0
             L 1000 24
             C 700 24, 600 60, 500 60
             C 400 60, 300 24, 0 24
             Z"
          className="bb-curve-fill"
          fill="var(--bb-header-bg, #FCEAE3)"
        />
      </svg>
    </div>
  );
}

