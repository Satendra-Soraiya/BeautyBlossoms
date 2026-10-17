import React, { useState, useEffect } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import BookingContactBar from './BookingContactBar';
import ImageLightbox from './ImageLightbox';
import { LEHENGA_PRODUCTS } from '../../data/products';
import './ProductDetailPage.css';

/**
 * ProductDetailPage Component
 * 
 * Implements the dedicated product detail view matching Screen 3:
 * - High resolution portrait gallery with thumbnail preview strip
 * - Editorial typography and clear pricing / availability
 * - Expandable specification accordions
 * - Non-commercial "Call to Book" & "Enquire on WhatsApp" sticky actions
 */
export default function ProductDetailPage({
  product,
  onBack,
  onSelectProduct,
  favorites = [],
  onToggleFavorite,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Scroll to top on mount or product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id]);

  if (!product) return null;

  const isFav = favorites.includes(product.id);

  const handleOpenLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Other related lehengas from the same collection
  const relatedLehengas = LEHENGA_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="bb-product-page-root">
      {/* Top Navigation Bar with Back Action & Logo */}
      <header className="bb-product-nav-header">
        <button
          type="button"
          className="bb-product-back-btn"
          onClick={onBack}
          aria-label="Back to Dandiya Night Lehengas collection"
        >
          <svg className="bb-back-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="bb-back-btn-text">Collection</span>
        </button>

        <a href="#collection-section" onClick={(e) => { e.preventDefault(); onBack(); }} className="bb-product-logo-link">
          <img src="/logo.svg" alt="Beauty Blossoms" className="bb-product-header-logo" />
        </a>

        <button
          type="button"
          className={`bb-product-nav-fav-btn ${isFav ? 'is-active' : ''}`}
          onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
          aria-label={isFav ? 'Remove from shortlist' : 'Save to shortlist'}
        >
          <svg
            className="bb-nav-heart-svg"
            viewBox="0 0 24 24"
            fill={isFav ? '#CF2A52' : 'none'}
            stroke={isFav ? '#CF2A52' : '#4A232B'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="bb-product-page-main">
        {/* Breadcrumb */}
        <nav className="bb-product-breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={onBack} className="bb-breadcrumb-link">
            Dandiya Nights
          </button>
          <span className="bb-breadcrumb-sep" aria-hidden="true">/</span>
          <span className="bb-breadcrumb-current" aria-current="page">
            {product.name}
          </span>
        </nav>

        {/* Section A: Portrait Image Gallery */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* Section B: Product Information Header */}
        <section className="bb-product-info-section" aria-label="Product overview">
          <div className="bb-product-title-row">
            <h1 className="bb-product-name">{product.name}</h1>
            <span className="bb-product-code-pill">({product.productCode})</span>
          </div>

          <div className="bb-product-price-row">
            <span className="bb-product-price-amount">{product.formattedPrice}</span>
            {product.availability && (
              <span className={`bb-product-status-tag bb-badge-${product.availabilityBadge || 'available'}`}>
                ● {product.availability}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="bb-product-description-text">{product.description}</p>

          {/* Quick Specifications Highlights */}
          <div className="bb-quick-specs-grid">
            <div className="bb-quick-spec-card">
              <span className="bb-spec-label">Fabric</span>
              <span className="bb-spec-value">{product.details.fabric?.split(' with ')[0]}</span>
            </div>
            <div className="bb-quick-spec-card">
              <span className="bb-spec-label">Embroidery</span>
              <span className="bb-spec-value">{product.details.work?.split(',')[0]}</span>
            </div>
            <div className="bb-quick-spec-card">
              <span className="bb-spec-label">Colour</span>
              <span className="bb-spec-value">{product.details.colour?.split(' with ')[0]}</span>
            </div>
            <div className="bb-quick-spec-card">
              <span className="bb-spec-label">Flare</span>
              <span className="bb-spec-value">{product.details.flare?.split(' ')[1] || '5+'} Meters</span>
            </div>
          </div>
        </section>

        {/* Section C: Expandable Information Accordions */}
        <ProductDetailsAccordion product={product} />

        {/* Reservation & Booking Guidance Banner */}
        <div className="bb-booking-guidance-card">
          <div className="bb-guidance-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bb-guidance-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="bb-guidance-text">
            <h4>Bespoke Reservation Policy</h4>
            <p>
              To maintain exclusivity and impeccable fitting, this lehenga is reserved directly via our styling concierge. Contact us below to schedule your private trial or confirm availability.
            </p>
          </div>
        </div>

        {/* More Outfits from the Dandiya Night Collection */}
        {relatedLehengas.length > 0 && (
          <section className="bb-related-products-section" aria-label="More from Dandiya Night Collection">
            <h3 className="bb-related-heading">More from Dandiya Nights</h3>
            <div className="bb-related-scroll-row">
              {relatedLehengas.map((rel) => (
                <article
                  key={rel.id}
                  className="bb-related-card"
                  onClick={() => onSelectProduct && onSelectProduct(rel)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && onSelectProduct) {
                      onSelectProduct(rel);
                    }
                  }}
                >
                  <img src={rel.thumbnail} alt={rel.name} className="bb-related-img" loading="lazy" />
                  <div className="bb-related-info">
                    <span className="bb-related-code">{rel.productCode}</span>
                    <h4 className="bb-related-title">{rel.name}</h4>
                    <span className="bb-related-price">{rel.formattedPrice}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Section D: Sticky Non-eCommerce Booking Actions Bar */}
      <BookingContactBar
        product={product}
        isFavorite={isFav}
        onToggleFavorite={onToggleFavorite}
      />

      {/* Lightbox Modal for High-Def Inspection */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={product.images}
        initialIndex={lightboxIndex}
        productName={product.name}
      />
    </div>
  );
}
