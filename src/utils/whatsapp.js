import {business} from '../config/business.js';
export function whatsappUrl(message){if(!/^\d{8,15}$/.test(business.whatsapp))return null;return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;}
export function openWhatsApp(message){const url=whatsappUrl(message);if(!url){window.alert('WhatsApp enquiries are not configured yet. Please use the contact details on this page.');return false;}window.open(url,'_blank','noopener,noreferrer');return true;}

