import React, { useState } from 'react';

/**
 * ProductImageGallery Component
 * 
 * Recreates the luxury product gallery from Screen 3:
 * - High-resolution portrait photograph of complete lehenga
 * - Touch swipeable image navigation
 * - Image counter pill (e.g. 1 / 4)
 * - Thumbnail preview strip with active border
 * - Full-screen lightbox trigger
 */
export default function ProductImageGallery({
  images = [],
  productName = '',
  onOpenLightbox,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  if (!images || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next
        handleNext(e);
      } else {
        // Swiped right -> prev
        handlePrev(e);
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="bb-gallery-container">
      {/* Primary Portrait Photograph Stage */}
      <div
        className="bb-gallery-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => onOpenLightbox && onOpenLightbox(activeIndex)}
        role="button"
        tabIndex={0}
        aria-label="Tap to view full-screen image and zoom"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onOpenLightbox) {
            onOpenLightbox(activeIndex);
          }
        }}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt || `${productName} photograph ${activeIndex + 1}`}
          className="bb-gallery-main-img"
          loading="eager"
          onError={(e) => {
            if (!e.currentTarget.dataset.fallbackApplied) {
              e.currentTarget.dataset.fallbackApplied = 'true';
              e.currentTarget.src = '/products/bb-01.webp';
            }
          }}
        />

        {/* Previous Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            className="bb-gallery-nav-btn bb-gallery-prev"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        {/* Next Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            className="bb-gallery-nav-btn bb-gallery-next"
            onClick={handleNext}
            aria-label="Next image"
          >
            ›
          </button>
        )}

        {/* Image Counter Badge (Screen 3 Reference: 1/5) */}
        <div className="bb-gallery-counter-badge" aria-label={`Image ${activeIndex + 1} of ${images.length}`}>
          {activeIndex + 1} / {images.length}
        </div>

        {/* Full-screen Hint Overlay */}
        <div className="bb-gallery-zoom-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>
      </div>

      {/* Thumbnail Strip (Underneath main image) */}
      {images.length > 1 && (
        <div className="bb-gallery-thumbnails-strip" role="tablist" aria-label="Product thumbnails">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={img.title || `View image ${idx + 1}`}
              className={`bb-gallery-thumb-btn ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <img
                src={img.url}
                alt=""
                className="bb-gallery-thumb-img"
                loading="lazy"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallbackApplied) {
                    e.currentTarget.dataset.fallbackApplied = 'true';
                    e.currentTarget.src = '/products/bb-01.webp';
                  }
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
