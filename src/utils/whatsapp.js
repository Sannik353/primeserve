import {business} from '../config/business.js';
export function openWhatsApp(message){if(!/^\d{8,15}$/.test(business.whatsapp)){window.alert('WhatsApp enquiries are not configured yet. Please use the contact details on this page.');return;}window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');}

