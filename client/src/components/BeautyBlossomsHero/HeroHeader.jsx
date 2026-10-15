import React from 'react';
import MobileMenuButton from './MobileMenuButton';
import BrandLogo from './BrandLogo';
import ShoppingBagButton from './ShoppingBagButton';
import HeroCurve from './HeroCurve';

/**
 * HeroHeader Component
 * 
 * Houses the top navigation controls with the pale blush-pink/cream background,
 * viewport-centered brand identity, and the organic curved transition.
 */
export default function HeroHeader({ cartCount = 0, onMenuClick, onCartClick }) {
  return (
    <header className="bb-hero-header" role="banner">
      {/* Top action row containing hamburger, centered logo, and shopping bag */}
      <div className="bb-header-nav-row">
        <div className="bb-nav-left">
          <MobileMenuButton onClick={onMenuClick} />
        </div>

        <div className="bb-nav-center">
          <BrandLogo logoSrc="/logo.svg" />
        </div>

        <div className="bb-nav-right">
          <ShoppingBagButton count={cartCount} onClick={onCartClick} />
        </div>
      </div>

      {/* Organic curved transition into the hero photograph */}
      <HeroCurve />
    </header>
  );
}
