import React from 'react';

/**
 * HeaderActions Component
 * 
 * Houses Search, Wishlist, and Shopping Bag actions with responsive layout,
 * consistent stroke weights, accessible touch targets, and precision cart badge.
 */
export default function HeaderActions({ cartCount = 0 }) {
  return (
    <div className="bb-header-actions" role="toolbar" aria-label="Customer actions">
      {/* Search Icon Button */}
      <button
        type="button"
        className="bb-icon-btn bb-search-btn"
        aria-label="Search lehengas and collections"
        title="Search"
      >
        <svg
          className="bb-action-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* Wishlist Heart Button */}
      <button
        type="button"
        className="bb-icon-btn bb-wishlist-btn"
        aria-label="View Wishlist"
        title="Wishlist"
      >
        <svg
          className="bb-action-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Shopping Bag / Cart Button */}
      <button
        type="button"
        className="bb-icon-btn bb-cart-btn"
        aria-label={`Shopping bag containing ${cartCount} items`}
        title="Shopping Bag"
      >
        <div className="bb-cart-icon-wrapper">
          <svg
            className="bb-action-icon bb-cart-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Bag outline matching the reference rounded fashion bag */}
            <path d="M6 8h12l-1.2 12.5a1.5 1.5 0 0 1-1.5 1.5H8.7a1.5 1.5 0 0 1-1.5-1.5L6 8z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          {/* Badge over cart icon matching reference */}
          <span className="bb-cart-badge" aria-hidden="true">
            {cartCount}
          </span>
        </div>
      </button>
    </div>
  );
}
