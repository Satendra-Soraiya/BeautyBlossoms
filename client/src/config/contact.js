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
    display: '+91 85160 51495',
    tel: '+918516051495',
  },
  
  // WhatsApp contact for "Enquire on WhatsApp" action
  whatsapp: {
    number: '918516051495', // Country code + number without plus or special chars
    display: '+91 85160 51495',
  },
  
  // Email contact
  email: 'beautyblossoms@gmail.com',
  
  // Studio & Boutique Address
  studio: {
    title: 'Beauty Blossoms Studio',
    addressLine1: '184, Press Colony',
    addressLine2: 'Anand Nagar',
    city: 'Bhopal, Madhya Pradesh',
    timings: '10:00 AM – 7:00 PM',
    note: 'Visits and bridal trials are by prior appointment.',
  },
  
  // Social channels
  socials: {
    instagram: 'https://instagram.com/beautyblossom878',
    whatsapp: 'https://wa.me/918516051495',
  },

  /**
   * Generates WhatsApp prefilled enquiry link for a specific lehenga product.
   */
  getWhatsAppEnquiryUrl: (productName, productCode, formattedRentPrice) => {
    const rentText = formattedRentPrice ? ` to rent for Garba night (${formattedRentPrice}) or purchase` : ' to rent for Garba night or buy';
    const text = `Hello Beauty Blossoms! I would like to enquire about ${productName} (Code: ${productCode})${rentText}. Could you please share its availability and studio trial details?`;
    return `https://wa.me/918516051495?text=${encodeURIComponent(text)}`;
  },

  /**
   * Generates WhatsApp link for general consultation and studio appointments.
   */
  getGeneralWhatsAppUrl: () => {
    const text = `Hello Beauty Blossoms! I would like to enquire about your Dandiya Night Lehengas collection and book a styling appointment.`;
    return `https://wa.me/918516051495?text=${encodeURIComponent(text)}`;
  },

  /**
   * Generates WhatsApp enquiry link for customer's saved wishlist items.
   */
  getWishlistWhatsAppUrl: (savedProducts) => {
    const itemsList = savedProducts.map(p => `• ${p.name} (Code: ${p.productCode})`).join('\n');
    const text = `Hello Beauty Blossoms! I have shortlisted the following lehengas from your Dandiya Night Collection:\n\n${itemsList}\n\nCould you please share availability and appointment booking details for these?`;
    return `https://wa.me/918516051495?text=${encodeURIComponent(text)}`;
  }
};
