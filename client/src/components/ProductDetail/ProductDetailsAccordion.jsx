import React, { useState } from 'react';

/**
 * ProductDetailsAccordion Component
 * 
 * Recreates the 4 rounded accordion sections from Screen 3:
 * 1. Outfit Details (Lehenga, choli, dupatta, components)
 * 2. Fabric & Work (Embroidery, mirror work, fabric, care)
 * 3. Size Guide & Fitting (Measurements, custom tailoring, alterations)
 * 4. Availability & Booking (Studio trial, booking steps, dispatch)
 */
export default function ProductDetailsAccordion({ product }) {
  // First accordion open by default
  const [openSections, setOpenSections] = useState({
    outfit: true,
    fabric: false,
    size: false,
    booking: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const { details = {}, sizeFitting = {}, bookingInfo = {} } = product;

  const accordionItems = [
    {
      key: 'outfit',
      title: 'Product Details',
      icon: (
        <svg className="bb-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
        </svg>
      ),
      content: (
        <dl className="bb-details-list">
          {details.components && (
            <div className="bb-detail-row">
              <dt>Components:</dt>
              <dd>{details.components}</dd>
            </div>
          )}
          {details.flare && (
            <div className="bb-detail-row">
              <dt>Lehenga Flare:</dt>
              <dd>{details.flare}</dd>
            </div>
          )}
          {details.lining && (
            <div className="bb-detail-row">
              <dt>Inner Lining:</dt>
              <dd>{details.lining}</dd>
            </div>
          )}
          {details.closure && (
            <div className="bb-detail-row">
              <dt>Waist Closure:</dt>
              <dd>{details.closure}</dd>
            </div>
          )}
        </dl>
      ),
    },
    {
      key: 'fabric',
      title: 'Fabric & Work',
      icon: (
        <svg className="bb-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
      content: (
        <dl className="bb-details-list">
          {details.fabric && (
            <div className="bb-detail-row">
              <dt>Fabric:</dt>
              <dd>{details.fabric}</dd>
            </div>
          )}
          {details.work && (
            <div className="bb-detail-row">
              <dt>Embroidery & Craft:</dt>
              <dd>{details.work}</dd>
            </div>
          )}
          {details.colour && (
            <div className="bb-detail-row">
              <dt>Colour Palette:</dt>
              <dd>{details.colour}</dd>
            </div>
          )}
          {details.care && (
            <div className="bb-detail-row">
              <dt>Care Instructions:</dt>
              <dd>{details.care}</dd>
            </div>
          )}
        </dl>
      ),
    },
    {
      key: 'size',
      title: 'Size Guide & Custom Fitting',
      icon: (
        <svg className="bb-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h20M2 12l5-5m15 5l-5 5M7 7l2 2m3-2l2 2m3-2l2 2" />
        </svg>
      ),
      content: (
        <dl className="bb-details-list">
          {sizeFitting.standardSizes && (
            <div className="bb-detail-row">
              <dt>Available Sizes:</dt>
              <dd>{sizeFitting.standardSizes}</dd>
            </div>
          )}
          {sizeFitting.skirtLength && (
            <div className="bb-detail-row">
              <dt>Skirt Length:</dt>
              <dd>{sizeFitting.skirtLength}</dd>
            </div>
          )}
          {sizeFitting.waistFitting && (
            <div className="bb-detail-row">
              <dt>Waist Fit:</dt>
              <dd>{sizeFitting.waistFitting}</dd>
            </div>
          )}
          {sizeFitting.alterations && (
            <div className="bb-detail-row">
              <dt>Alteration Policy:</dt>
              <dd>{sizeFitting.alterations}</dd>
            </div>
          )}
          {sizeFitting.consultation && (
            <div className="bb-detail-row">
              <dt>Fitting Consultation:</dt>
              <dd>{sizeFitting.consultation}</dd>
            </div>
          )}
        </dl>
      ),
    },
    {
      key: 'booking',
      title: 'Availability & Booking',
      icon: (
        <svg className="bb-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      content: (
        <dl className="bb-details-list">
          {bookingInfo.status && (
            <div className="bb-detail-row">
              <dt>Reservation Status:</dt>
              <dd className="bb-highlight-text">{bookingInfo.status}</dd>
            </div>
          )}
          {bookingInfo.trials && (
            <div className="bb-detail-row">
              <dt>Studio Trials:</dt>
              <dd>{bookingInfo.trials}</dd>
            </div>
          )}
          {bookingInfo.deliveryTimeline && (
            <div className="bb-detail-row">
              <dt>Timeline:</dt>
              <dd>{bookingInfo.deliveryTimeline}</dd>
            </div>
          )}
          {bookingInfo.shipping && (
            <div className="bb-detail-row">
              <dt>Courier & Delivery:</dt>
              <dd>{bookingInfo.shipping}</dd>
            </div>
          )}
        </dl>
      ),
    },
  ];

  return (
    <div className="bb-product-accordions" aria-label="Detailed garment specifications">
      {accordionItems.map((item) => {
        const isOpen = openSections[item.key];
        return (
          <div
            key={item.key}
            className={`bb-accordion-item ${isOpen ? 'is-open' : ''}`}
          >
            <button
              type="button"
              className="bb-accordion-header-btn"
              onClick={() => toggleSection(item.key)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.key}`}
            >
              <div className="bb-accordion-title-row">
                <span className="bb-accordion-icon-wrap" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="bb-accordion-title-text">{item.title}</span>
              </div>
              <svg
                className={`bb-accordion-chevron ${isOpen ? 'is-rotated' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isOpen && (
              <div
                id={`accordion-panel-${item.key}`}
                className="bb-accordion-panel"
                role="region"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
