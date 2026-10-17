/**
 * Beauty Blossoms — Centralized Business Contact Configuration
 * 
 * Configures all concierge, phone, WhatsApp, and studio booking details.
 * All customer enquiry actions connect to these configurable values.
 */
export const CONTACT_CONFIG = {
  brandName: 'Beauty Blossoms',
  legalName: 'Beauty Blossoms Couture Studio',
  tagline: 'Tradition. Elegance. You.',
  
  // Phone contact for "Call to Book" action
  phone: {
    display: '+91 98765 43210',
    tel: '+919876543210',
  },
  
  // WhatsApp contact for "Enquire on WhatsApp" action
  whatsapp: {
    number: '919876543210', // Country code + number without plus or special chars
    display: '+91 98765 43210',
  },
  
  // Email contact
  email: 'concierge@beautyblossoms.com',
  
  // Studio & Boutique Address
  studio: {
    title: 'Beauty Blossoms Flagship Studio',
    addressLine1: 'Boutique Studio 4, Heritage Galleria',
    addressLine2: 'Linking Road, Bandra West',
    city: 'Mumbai, Maharashtra 400050',
    timings: 'Mon – Sat: 11:00 AM – 8:00 PM',
    note: 'Visits and bridal trials are by prior appointment only.',
  },
  
  // Social channels
  socials: {
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/919876543210',
    pinterest: 'https://pinterest.com',
  },

  /**
   * Generates WhatsApp prefilled enquiry link for a specific lehenga product.
   */
  getWhatsAppEnquiryUrl: (productName, productCode) => {
    const text = `Hello Beauty Blossoms! I would like to enquire about ${productName} (Code: ${productCode}). Could you please share its availability and booking details?`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  },

  /**
   * Generates WhatsApp link for general consultation and studio appointments.
   */
  getGeneralWhatsAppUrl: () => {
    const text = `Hello Beauty Blossoms! I would like to enquire about your Dandiya Night Lehengas collection and book a styling appointment.`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  },

  /**
   * Generates WhatsApp enquiry link for customer's saved wishlist items.
   */
  getWishlistWhatsAppUrl: (savedProducts) => {
    const itemsList = savedProducts.map(p => `• ${p.name} (Code: ${p.productCode})`).join('\n');
    const text = `Hello Beauty Blossoms! I have shortlisted the following lehengas from your Dandiya Night Collection:\n\n${itemsList}\n\nCould you please share availability and appointment booking details for these?`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  }
};
