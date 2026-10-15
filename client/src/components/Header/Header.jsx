import React from 'react';
import './Header.css';
import HeaderActions from './HeaderActions';
import HeroCurve from './HeroCurve';
import { BRAND_ASSETS } from '../../config/assets';

/**
 * Header Component
 * 
 * Production-ready mobile-first header with:
 * - Clean left hamburger navigation toggle
 * - True viewport-centered transparent Beauty Blossoms logo
 * - Responsive right-side customer actions (Search, Wishlist, Cart with red badge)
 * - Seamless organic asymmetric curved bottom boundary into the Hero section
 */
export default function Header({ cartCount = 0, onMenuClick }) {
  return (
    <header className="bb-header" role="banner">
      <div className="bb-header-bar">
        {/* Left Side: Mobile Navigation Hamburger */}
        <div className="bb-header-left">
          <button
            type="button"
            className="bb-icon-btn bb-hamburger-btn"
            onClick={onMenuClick}
            aria-label="Open mobile navigation menu"
            title="Menu"
          >
            <svg
              className="bb-hamburger-icon"
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
        </div>

        {/* Center: Brand Logo (Visually and geometrically centered to the viewport) */}
        <div className="bb-header-center">
          <a
            href="/"
            className="bb-logo-link"
            aria-label="Beauty Blossoms - Home"
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Beauty Blossoms Haute Couture"
              className="bb-logo-image"
              loading="eager"
            />
          </a>
        </div>

        {/* Right Side: Action icons with badge */}
        <div className="bb-header-right">
          <HeaderActions cartCount={cartCount} />
        </div>
      </div>

      {/* Organic Curved Silhouette at the bottom edge */}
      <HeroCurve />
    </header>
  );
}
