import React, { useRef, useState } from 'react';
import { adminService } from '../../services/adminService';

/**
 * AdminImageManager Component
 * 
 * Mobile-first photo manager with:
 * - Direct back camera capture for phone photography
 * - Multi-image gallery upload
 * - Primary thumbnail selection
 * - Image order reordering
 * - Instant removal of unwanted photos
 */
export default function AdminImageManager({
  images = [],
  thumbnail = '',
  productCode = 'BB-NEW',
  onChangeImages,
  onChangeThumbnail,
}) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFilesSelected = async (e, sourceName = 'Camera') => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(`Optimizing ${files.length} photo${files.length > 1 ? 's' : ''}...`);

    try {
      const newImagesList = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Processing photo ${i + 1} of ${files.length}...`);
        
        const uploaded = await adminService.uploadImage(
          file,
          productCode,
          `${productCode} ${sourceName} Photograph`
        );

        if (uploaded && uploaded.url) {
          newImagesList.push({
            url: uploaded.url,
            title: uploaded.title || 'Outfit Detail',
            alt: uploaded.alt || `${productCode} detail photograph`,
          });
        }
      }

      onChangeImages(newImagesList);

      // If no thumbnail set yet, set the first uploaded image as primary thumbnail
      if (!thumbnail && newImagesList.length > 0) {
        onChangeThumbnail(newImagesList[0].url);
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to process photo upload');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      // Reset input value so same photo can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const removedUrl = images[indexToRemove]?.url;
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChangeImages(updated);

    // If removed image was the active thumbnail, update thumbnail
    if (thumbnail === removedUrl) {
      onChangeThumbnail(updated.length > 0 ? updated[0].url : '');
    }
  };

  const handleMoveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChangeImages(updated);
  };

  const handleSetPrimary = (url) => {
    onChangeThumbnail(url);
  };

  return (
    <div className="bb-admin-image-manager">
      <div className="bb-aim-header">
        <label className="bb-aim-label">
          Outfit Photography ({images.length} photo{images.length !== 1 ? 's' : ''})
        </label>
        <span className="bb-aim-sub">
          Take live photos in studio or choose from phone gallery
        </span>
      </div>

      {/* Mobile-First Camera & Gallery Dual Buttons */}
      <div className="bb-aim-actions-grid">
        {/* 1. Camera Direct Capture (opens mobile back camera) */}
        <button
          type="button"
          className="bb-aim-btn bb-aim-camera-btn"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isUploading}
        >
          <svg className="bb-aim-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <div className="bb-aim-btn-text">
            <strong>Take Photo</strong>
            <span>Direct Camera</span>
          </div>
        </button>

        {/* Hidden Camera Input with HTML5 environment capture */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleFilesSelected(e, 'Studio Camera')}
        />

        {/* 2. Gallery Upload (select from phone photos or files) */}
        <button
          type="button"
          className="bb-aim-btn bb-aim-gallery-btn"
          onClick={() => galleryInputRef.current?.click()}
          disabled={isUploading}
        >
          <svg className="bb-aim-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <div className="bb-aim-btn-text">
            <strong>Photo Gallery</strong>
            <span>Upload Files</span>
          </div>
        </button>

        {/* Hidden Gallery Input */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFilesSelected(e, 'Gallery')}
        />
      </div>

      {/* Upload Progress & Error Messages */}
      {isUploading && (
        <div className="bb-aim-status-box bb-aim-uploading">
          <span className="bb-aim-spinner" aria-hidden="true" />
          <span>{uploadProgress || 'Optimizing & saving photo...'}</span>
        </div>
      )}

      {uploadError && (
        <div className="bb-aim-status-box bb-aim-error" role="alert">
          <span>⚠️ {uploadError}</span>
        </div>
      )}

      {/* Existing Attached Images Gallery */}
      {images.length > 0 ? (
        <div className="bb-aim-gallery-grid">
          {images.map((img, idx) => {
            const isPrimary = (thumbnail === img.url) || (!thumbnail && idx === 0);

            return (
              <div
                key={`${img.url}-${idx}`}
                className={`bb-aim-card ${isPrimary ? 'is-primary' : ''}`}
              >
                <div className="bb-aim-img-wrapper">
                  <img
                    src={img.url}
                    alt={img.alt || `Photo ${idx + 1}`}
                    className="bb-aim-thumb-img"
                    loading="lazy"
                  />
                  {isPrimary && (
                    <span className="bb-aim-primary-badge">★ Primary Cover</span>
                  )}
                </div>

                <div className="bb-aim-card-controls">
                  {/* Order controls */}
                  <div className="bb-aim-order-btns">
                    <button
                      type="button"
                      className="bb-aim-icon-btn"
                      onClick={() => handleMoveImage(idx, idx - 1)}
                      disabled={idx === 0}
                      title="Move photo earlier"
                      aria-label="Move photo earlier"
                    >
                      ‹
                    </button>
                    <span className="bb-aim-index-num">#{idx + 1}</span>
                    <button
                      type="button"
                      className="bb-aim-icon-btn"
                      onClick={() => handleMoveImage(idx, idx + 1)}
                      disabled={idx === images.length - 1}
                      title="Move photo later"
                      aria-label="Move photo later"
                    >
                      ›
                    </button>
                  </div>

                  {/* Primary Toggle */}
                  <button
                    type="button"
                    className={`bb-aim-action-btn ${isPrimary ? 'is-active-star' : ''}`}
                    onClick={() => handleSetPrimary(img.url)}
                    title={isPrimary ? 'Current Cover Photo' : 'Set as Primary Cover Photo'}
                  >
                    {isPrimary ? '★ Cover' : '☆ Set Cover'}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="bb-aim-delete-btn"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove this photo"
                    aria-label={`Remove photo ${idx + 1}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bb-aim-trash-svg">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bb-aim-empty">
          <p>No photos attached yet. Tap <strong>Take Photo</strong> or <strong>Photo Gallery</strong> above.</p>
        </div>
      )}
    </div>
  );
}
