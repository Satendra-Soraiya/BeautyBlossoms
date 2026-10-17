import React, { useState, useMemo } from 'react';

/**
 * ProductImageGallery Component
 * 
 * Recreates the luxury product gallery from Screen 3:
 * - High-resolution portrait photograph of complete lehenga
 * - Touch swipeable image navigation
 * - Image counter pill (e.g. 1 / 2)
 * - Thumbnail preview strip with active border
 * - Strict image sanitization: rejects legacy placeholders & unrelated product fallbacks
 * - Full-screen lightbox trigger
 */
export default function ProductImageGallery({
  images = [],
  productName = '',
  productId = '',
  productCode = '',
  onOpenLightbox,
}) {
  const [userIndex, setUserIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  // Sanitize images to strictly display only authentic assets for this outfit
  const validImages = useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) return [];

    const normId = (productId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCode = (productCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const isBB01 = normId === 'bb01' || normId === 'bb1' || normCode === 'bb01' || normCode === 'bb1';

    const seenUrls = new Set();
    const filtered = [];

    for (const img of images) {
      if (!img || !img.url) continue;
      const url = img.url.toLowerCase();

      // Eliminate obsolete placeholder mockups
      if (url.includes('-choli.') || url.includes('-embroidery.') || url.includes('-back.')) {
        continue;
      }

      // If this is NOT BB-01, strictly prevent BB-01 (white lehenga) images from appearing
      if (!isBB01 && (url.includes('bb-01') || url.includes('bb01'))) {
        continue;
      }

      // Prevent duplicate URLs
      if (seenUrls.has(img.url)) {
        continue;
      }
      seenUrls.add(img.url);

      filtered.push(img);
    }

    // If all were somehow filtered out, provide this outfit's primary image
    if (filtered.length === 0 && productId) {
      filtered.push({
        url: `/products/${productId}.webp`,
        title: 'Full Front Silhouette',
        alt: `${productName} — Silhouette`,
      });
    }

    return filtered;
  }, [images, productId, productCode, productName]);

  if (!validImages || validImages.length === 0) return null;

  const activeIndex = userIndex < validImages.length ? userIndex : 0;
  const currentImage = validImages[activeIndex] || validImages[0];
  const primaryFallbackUrl = validImages[0]?.url || '';

  const handlePrev = (e) => {
    e.stopPropagation();
    setUserIndex((prev) => {
      const cur = prev < validImages.length ? prev : 0;
      return cur === 0 ? validImages.length - 1 : cur - 1;
    });
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setUserIndex((prev) => {
      const cur = prev < validImages.length ? prev : 0;
      return cur === validImages.length - 1 ? 0 : cur + 1;
    });
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
        handleNext(e);
      } else {
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
            if (!e.currentTarget.dataset.fallbackApplied && primaryFallbackUrl) {
              e.currentTarget.dataset.fallbackApplied = 'true';
              e.currentTarget.src = primaryFallbackUrl;
            }
          }}
        />

        {/* Previous Arrow Button */}
        {validImages.length > 1 && (
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
        {validImages.length > 1 && (
          <button
            type="button"
            className="bb-gallery-nav-btn bb-gallery-next"
            onClick={handleNext}
            aria-label="Next image"
          >
            ›
          </button>
        )}

        {/* Image Counter Badge (Screen 3 Reference: 1/2) */}
        <div className="bb-gallery-counter-badge" aria-label={`Image ${activeIndex + 1} of ${validImages.length}`}>
          {activeIndex + 1} / {validImages.length}
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
      {validImages.length > 1 && (
        <div className="bb-gallery-thumbnails-strip" role="tablist" aria-label="Product thumbnails">
          {validImages.map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={img.title || `View image ${idx + 1}`}
              className={`bb-gallery-thumb-btn ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setUserIndex(idx)}
            >
              <img
                src={img.url}
                alt=""
                className="bb-gallery-thumb-img"
                loading="lazy"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallbackApplied && primaryFallbackUrl) {
                    e.currentTarget.dataset.fallbackApplied = 'true';
                    e.currentTarget.src = primaryFallbackUrl;
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
