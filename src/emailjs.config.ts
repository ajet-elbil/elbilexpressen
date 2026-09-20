// EmailJS Configuration
// Reads from environment variables (VITE_ prefix required for Vite)
// Set these in your .env file:
// VITE_EMAILJS_SERVICE_ID=your_service_id
// VITE_EMAILJS_TEMPLATE_ID=your_template_id
// VITE_EMAILJS_PUBLIC_KEY=your_public_key

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',

  // Your EmailJS Template ID
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',

  // Your EmailJS Public Key
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

