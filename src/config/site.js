// The canonical production origin. Replace only after a custom domain is verified.
export const siteUrl = 'https://primeserve-kappa.vercel.app';

export const publicRoutes = [
  {
    path: '/',
    kind: 'home',
    title: 'PrimeServe | Online Cyber Cafe & Digital Services',
    description: 'Get assistance with online applications, government forms, documents, education, employment, bill payments, and digital services through PrimeServe.',
  },
  {
    path: '/services',
    kind: 'catalogue',
    title: 'Online Digital Services Catalogue | PrimeServe',
    description: 'Browse PrimeServe assistance for government forms, jobs, education, PAN and tax, documents, business, banking, bills, travel, West Bengal services, and websites.',
  },
  {
    path: '/services/government-document-assistance',
    kind: 'government',
    title: 'Government Form & Document Assistance | PrimeServe',
    description: 'Explore assistance with online government forms, certificates, records, and applications. Availability and eligibility depend on the specific service.',
  },
  {
    path: '/services/west-bengal-services',
    kind: 'west-bengal',
    title: 'West Bengal Scheme & Online Service Assistance | PrimeServe',
    description: 'Find assistance and information for selected West Bengal government schemes, certificates, records, scholarships, and recruitment services.',
  },
  {
    path: '/services/website-design-development',
    kind: 'web-design',
    title: 'UI/UX & Website Design and Development | PrimeServe',
    description: 'Enquire about UI/UX design, responsive business websites, landing pages, portfolio websites, redesigns, maintenance, and website improvements.',
  },
  {
    path: '/about',
    kind: 'about',
    title: 'About PrimeServe | Online Cyber Cafe & Digital Services',
    description: 'Learn how PrimeServe assists customers with online applications, documentation, and digital services across India, subject to availability.',
  },
  {
    path: '/contact',
    kind: 'contact',
    title: 'Contact PrimeServe | Digital Services Enquiries',
    description: 'Contact PrimeServe by WhatsApp or prepare a service enquiry through the website contact form.',
  },
  {
    path: '/privacy-policy',
    kind: 'privacy',
    title: 'Privacy Policy | PrimeServe',
    description: 'Read how PrimeServe website enquiries are prepared and what happens when you choose to continue in WhatsApp.',
  },
  {
    path: '/terms',
    kind: 'terms',
    title: 'Service Terms & Customer Policy | PrimeServe',
    description: 'Review PrimeServe service availability, fees, processing expectations, eligibility, and customer enquiry terms.',
  },
];

export function routeForPath(pathname) {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return publicRoutes.find((route) => route.path === normalized) ?? null;
}

export function absoluteUrl(path) {
  return new URL(path, `${siteUrl}/`).href;
}
