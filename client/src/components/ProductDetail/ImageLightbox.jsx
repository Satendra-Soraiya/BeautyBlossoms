import React, { useEffect, useState } from 'react';

/**
 * ImageLightbox Component
 * 
 * Accessible full-screen modal allowing high-definition zoom and examination
 * of outfit embroidery, border craftsmanship, and colors.
 */
export default function ImageLightbox({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  productName = '',
}) {
  const [indexOffset, setIndexOffset] = useState(0);

  const currentIndex = images.length > 0 
    ? (initialIndex + indexOffset + images.length * 1000) % images.length 
    : 0;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndexOffset((prev) => prev + 1);
      if (e.key === 'ArrowLeft') setIndexOffset((prev) => prev - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || !images.length) return null;

  const current = images[currentIndex];

  return (
    <div
      className="bb-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Full screen image viewer for ${productName}`}
      onClick={onClose}
    >
      {/* Header bar */}
      <div className="bb-lightbox-header" onClick={(e) => e.stopPropagation()}>
        <div className="bb-lightbox-title-box">
          <span className="bb-lightbox-product-name">{productName}</span>
          <span className="bb-lightbox-counter">
            {currentIndex + 1} of {images.length}
          </span>
        </div>
        <button
          type="button"
          className="bb-lightbox-close-btn"
          onClick={onClose}
          aria-label="Close full-screen image viewer"
        >
          ✕
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="bb-lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <img
          src={current.url}
          alt={current.alt || `${productName} view ${currentIndex + 1}`}
          className="bb-lightbox-img"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="bb-lightbox-nav-btn bb-lightbox-prev"
              onClick={() => setIndexOffset((prev) => prev - 1)}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="bb-lightbox-nav-btn bb-lightbox-next"
              onClick={() => setIndexOffset((prev) => prev + 1)}
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Caption footer */}
      {current.title && (
        <div className="bb-lightbox-caption" onClick={(e) => e.stopPropagation()}>
          <p>{current.title}</p>
        </div>
      )}
    </div>
  );
}
