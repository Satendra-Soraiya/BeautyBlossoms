import React, { useState, useEffect } from 'react';
import BeautyBlossomsHero from './components/BeautyBlossomsHero/BeautyBlossomsHero';
import DandiyaCollectionSection from './components/Collection/DandiyaCollectionSection';
import ProductDetailPage from './components/ProductDetail/ProductDetailPage';
import BrandFooter from './components/Footer/BrandFooter';
import WishlistDrawer from './components/WishlistDrawer/WishlistDrawer';
import { getProducts, getProduct } from './services/productService';
import { LEHENGA_PRODUCTS } from './data/products';

/**
 * Beauty Blossoms Root Application
 * 
 * Mobile-first lehenga showcase & bespoke booking platform:
 * - Untouched luxury curved floral header & hero section
 * - Fully synchronized initial screen load (Header + Hero background load together)
 * - Seamless Dandiya Night Lehengas collection section
 * - Dedicated product detail view with multi-image gallery & accordions
 * - Non-commercial "Call to Book" & "Enquire on WhatsApp" workflows
 * - Wishlist shortlist drawer replacing traditional shopping cart
 * - Brand footer featuring royal Indian palace heritage
 */
export default function App() {
  const [products, setProducts] = useState(LEHENGA_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_shortlist_favorites');
      return saved ? JSON.parse(saved) : ['bb-01']; // BB-01 pre-shortlisted for demonstration
    } catch {
      return ['bb-01'];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Synchronize Hero Image & Header Loading so both reveal at the exact same instant
  useEffect(() => {
    const heroSrc = '/Pink-Gold Dandiya Celebration.webp';
    const img = new Image();
    img.src = heroSrc;

    const onReady = () => {
      if (img.decode) {
        img.decode()
          .then(() => setIsHeroLoaded(true))
          .catch(() => setIsHeroLoaded(true));
      } else {
        setIsHeroLoaded(true);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      onReady();
    } else {
      img.onload = onReady;
      img.onerror = () => {
        // Fallback to png if webp error
        const fallback = new Image();
        fallback.src = '/Pink-Gold Dandiya Celebration.png';
        fallback.onload = () => setIsHeroLoaded(true);
        fallback.onerror = () => setIsHeroLoaded(true);
      };
    }

    // Safety timeout: ensure page is never blocked if network stalls
    const timer = setTimeout(() => setIsHeroLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load products from Supabase (with seamless local fallback)
  useEffect(() => {
    let isMounted = true;
    getProducts().then((loaded) => {
      if (isMounted && Array.isArray(loaded) && loaded.length > 0) {
        setProducts(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bb_shortlist_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [favorites]);

  // Handle URL hash changes for deep linking & browser back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const slug = hash.replace('#product/', '');
        getProduct(slug).then((found) => {
          if (found) {
            setSelectedProduct(found);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      } else if (hash === '#collection-section') {
        setSelectedProduct(null);
        const el = document.getElementById('collection-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (!hash || hash === '#') {
        setSelectedProduct(null);
      }
    };

    // Check on initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    window.location.hash = `#product/${product.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCollection = () => {
    setSelectedProduct(null);
    window.location.hash = '#collection-section';
    setTimeout(() => {
      const el = document.getElementById('collection-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleExploreClick = () => {
    const el = document.getElementById('collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCartOrWishlistClick = () => {
    setIsWishlistOpen(true);
  };

  const handleMenuClick = () => {
    setIsWishlistOpen(true);
  };

  return (
    <div className="bb-root-layout">
      {/* Synchronized Screen Transition Veil (dissolves only when both header and hero background are ready) */}
      {!isHeroLoaded && !selectedProduct && (
        <div className="bb-screen-loader" aria-label="Loading Beauty Blossoms">
          <div className="bb-loader-inner">
            <span className="bb-loader-flourish" aria-hidden="true">✿</span>
            <span className="bb-loader-brand">Beauty Blossoms</span>
            <span className="bb-loader-sub">Haute Couture • Dandiya Nights</span>
            <div className="bb-loader-bar">
              <div className="bb-loader-progress" />
            </div>
          </div>
        </div>
      )}

      {selectedProduct ? (
        /* Dedicated Lehenga Product Detail View (Screen 3) */
        <ProductDetailPage
          product={selectedProduct}
          onBack={handleBackToCollection}
          onSelectProduct={handleSelectProduct}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        /* Homepage Flow: Header and Hero background load together simultaneously */
        <div className={`bb-homepage-wrapper ${isHeroLoaded ? 'is-ready' : 'is-loading'}`}>
          {/* 1. Preserved Haute Couture Hero Section with Curved Header */}
          <BeautyBlossomsHero
            cartCount={favorites.length}
            onMenuClick={handleMenuClick}
            onCartClick={handleCartOrWishlistClick}
            onExploreClick={handleExploreClick}
            heroImageSrc="/Pink-Gold Dandiya Celebration.webp"
            onImageLoaded={() => setIsHeroLoaded(true)}
          />

          {/* 2. Dandiya Night Lehengas Seamless Collection Section (Screen 2) */}
          <DandiyaCollectionSection
            products={products}
            onSelectProduct={handleSelectProduct}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />

          {/* 3. Heritage Brand Footer */}
          <BrandFooter onAboutClick={handleExploreClick} />
        </div>
      )}

      {/* Bespoke Saved Shortlist Drawer (Non-eCommerce enquiry cart) */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favoriteIds={favorites}
        products={products}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}
