import React from 'react';

/**
 * CollectionCTA Component
 * 
 * Recreates the prominent rose-pink/raspberry pill-shaped call-to-action button.
 * Features comfortable horizontal padding, rounded pill silhouette, subtle depth,
 * and a right-pointing arrow with micro-interaction hover state.
 */
export default function CollectionCTA({ onClick, label = 'Explore Collection' }) {
  return (
    <div className="bb-collection-cta-wrapper">
      <button
        type="button"
        className="bb-collection-cta-btn"
        onClick={onClick}
        aria-label={`${label} — Browse traditional bridal and festive lehengas`}
      >
        <span className="bb-cta-text">{label}</span>
        <svg
          className="bb-cta-arrow-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}
