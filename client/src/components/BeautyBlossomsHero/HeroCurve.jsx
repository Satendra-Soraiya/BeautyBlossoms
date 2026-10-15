import React from 'react';

/**
 * HeroCurve Component
 * 
 * Renders the flowing, organic asymmetric curved lower boundary of the header.
 * Seamlessly transitions from the pale blush-pink/cream header into the
 * floral fashion photography, cradling the centered logo wreath.
 */
export default function HeroCurve() {
  return (
    <div className="bb-curved-boundary" aria-hidden="true">
      <svg
        className="bb-curve-svg"
        viewBox="0 0 1000 125"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bbCurvedHeaderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDF5F2" />
            <stop offset="60%" stopColor="#FAF0EB" />
            <stop offset="100%" stopColor="#F8ECE7" />
          </linearGradient>
        </defs>
        <path
          d="M 0 0
             L 1000 0
             L 1000 34
             C 860 44, 680 116, 500 119
             C 320 116, 140 44, 0 32
             Z"
          fill="url(#bbCurvedHeaderGrad)"
        />
      </svg>
    </div>
  );
}
