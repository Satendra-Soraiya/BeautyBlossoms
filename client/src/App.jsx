import React, { useState } from 'react';
import BeautyBlossomsHero from './components/BeautyBlossomsHero/BeautyBlossomsHero';

/**
 * Beauty Blossoms Root Application
 * 
 * Production implementation of the authoritative mobile hero section.
 */
export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleMenuClick = () => {
    console.log('Open navigation drawer');
  };

  const handleCartClick = () => {
    console.log('Open shopping bag drawer');
  };

  const handleExploreClick = () => {
    console.log('Explore collection clicked');
  };

  return (
    <div className="bb-root-layout">
      {/* Primary Section: Haute Couture Hero Section */}
      <BeautyBlossomsHero
        cartCount={cartCount}
        onMenuClick={handleMenuClick}
        onCartClick={handleCartClick}
        onExploreClick={handleExploreClick}
        heroImageSrc="/hero bg.png"
      />
    </div>
  );
}
