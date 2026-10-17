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

  const { details = {}, sizeFitting = {} } = product;

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
        </dl>
      ),
    },
    {
      key: 'booking',
      title: 'Garba 1-Day Rental & Purchase Policy',
      icon: (
        <svg className="bb-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      content: (
        <dl className="bb-details-list">
          <div className="bb-detail-row">
            <dt>1-Day Garba Rental:</dt>
            <dd className="bb-highlight-text">₹500 to ₹1,000 / day — Rent for your Garba night and slay!</dd>
          </div>
          <div className="bb-detail-row">
            <dt>Direct Purchase:</dt>
            <dd>You can also purchase this outfit directly to own forever.</dd>
          </div>
          <div className="bb-detail-row">
            <dt>Studio Trials & Fitting:</dt>
            <dd>184, Press Colony, Anand Nagar, Bhopal, Madhya Pradesh</dd>
          </div>
          <div className="bb-detail-row">
            <dt>Visiting Hours:</dt>
            <dd>10:00 AM – 7:00 PM</dd>
          </div>
          <div className="bb-detail-row">
            <dt>How to Reserve:</dt>
            <dd>Enquire on WhatsApp (+91 85160 51495) to reserve your 1-day rental date or visit our Bhopal studio directly.</dd>
          </div>
          <div className="bb-detail-row">
            <dt>Pick-up & Trials:</dt>
            <dd>Direct in-studio trials and pick-up only in Bhopal.</dd>
          </div>
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
