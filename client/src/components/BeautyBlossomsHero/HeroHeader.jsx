import React from 'react';
import MobileMenuButton from './MobileMenuButton';
import BrandLogo from './BrandLogo';
import ShoppingBagButton from './ShoppingBagButton';
import HeroCurve from './HeroCurve';

/**
 * HeroHeader Component
 * 
 * Implements the three distinct visual header layers:
 * 1. Top layer: Upper rectangular bar containing navigation controls and centered logo zone
 * 2. Middle layer: Central region extending vertically around the logo (identical solid blush-cream)
 * 3. Bottom layer: Completely transparent downward-facing U-shaped edge revealing the hero photograph
 */
export default function HeroHeader({ cartCount = 0, onMenuClick, onCartClick }) {
  return (
    <header className="bb-hero-header" role="banner">
      {/* Layer 1: Top Layer — Upper rectangular header */}
      <div className="bb-header-top-layer bb-header-nav-row">
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

      {/* Layer 2: Middle Layer & Layer 3: Bottom Layer via HeroCurve component */}
      <HeroCurve />
    </header>
  );
}

