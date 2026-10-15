import React from 'react';

/**
 * MobileMenuButton Component
 * 
 * Elegant three-line hamburger menu icon matching the reference design.
 * Features comfortable 44px mobile touch target and keyboard accessibility.
 */
export default function MobileMenuButton({ onClick }) {
  return (
    <button
      type="button"
      className="bb-nav-btn bb-hamburger-btn"
      onClick={onClick}
      aria-label="Open navigation menu"
      title="Menu"
    >
      <svg
        className="bb-hamburger-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </svg>
    </button>
  );
}
