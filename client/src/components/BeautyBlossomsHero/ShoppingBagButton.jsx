import React from 'react';

/**
 * ShoppingBagButton Component
 * 
 * Clean shopping bag outline with top-right notification count badge.
 * Aligns horizontally with the hamburger icon and logo center line.
 */
export default function ShoppingBagButton({ count = 0, onClick }) {
  return (
    <button
      type="button"
      className="bb-nav-btn bb-shopping-bag-btn"
      onClick={onClick}
      aria-label={`Shopping bag containing ${count} items`}
      title="Shopping Bag"
    >
      <div className="bb-bag-icon-wrapper">
        <svg
          className="bb-shopping-bag-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Rounded base fashion bag matching reference */}
          <path d="M6 8h12l-1.2 12.5a1.5 1.5 0 0 1-1.5 1.5H8.7a1.5 1.5 0 0 1-1.5-1.5L6 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>

        {/* Small circular red badge */}
        <span className="bb-cart-notification-badge" aria-hidden="true">
          {count}
        </span>
      </div>
    </button>
  );
}
