import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Globe2, Menu, X } from 'lucide-react';
import { business } from './config/business';
import { absoluteUrl, publicRoutes, routeForPath, siteUrl } from './config/site';
import { serviceCategories } from './data/services';
import { openWhatsApp } from './utils/whatsapp';
import { ServiceEnquiry } from './ServiceEnquiry';

const routeLinks = [
  { path: '/', kind: 'home' },
  { path: '/services', kind: 'catalogue' },
  { path: '/about', kind: 'about' },
  { path: '/#how-it-works', kind: 'how' },
  { path: '/contact', kind: 'contact' },
];
const details = {
  government: {
    category: 'government-forms-documents',
    intro: 'PrimeServe can assist customers with preparing and completing selected online government forms, certificate applications, record searches, and document downloads. Each service depends on the relevant portal, current requirements, and the customer’s eligibility.',
    faqs: [
      ['How do I request government form assistance?', 'Contact PrimeServe with the name of the form or service. The team can explain what information and documents may be needed before assistance begins.'],
      ['Are official application fees included?', 'Official portal or department fees are separate from PrimeServe service charges wherever applicable. Charges are explained before work begins.'],
      ['Can PrimeServe guarantee approval?', 'No. Decisions and processing times are determined by the relevant government department. PrimeServe does not guarantee approval or timelines.'],
    ],
    related: ['/services/west-bengal-services', '/services'],
  },
  'west-bengal': {
    category: 'west-bengal-services',
    intro: 'This page covers selected West Bengal specific schemes, certificates, records, scholarships, and recruitment services. These are distinct from the broader online assistance listed in the main catalogue. Availability depends on the relevant service, official portal, location, and eligibility requirements.',
    faqs: [
      ['Which West Bengal services can I ask about?', 'The catalogue includes assistance relating to Lakshmir Bhandar, Aikyashree, Swasthya Sathi, Krishak Bandhu, selected certificates, land records, scholarships, and state recruitment forms.'],
      ['Does PrimeServe decide whether I qualify for a scheme?', 'No. Eligibility and decisions belong to the responsible authority. Check the current rules on the relevant official West Bengal portal.'],
      ['Can I request help from outside West Bengal?', 'You can contact PrimeServe to ask. Some state services may require a West Bengal connection or other eligibility conditions, so availability is service specific.'],
    ],
    related: ['/services/government-document-assistance', '/services'],
  },
  'web-design': {
    category: 'business-professional',
    subsection: 'website-design-development',
    intro: 'PrimeServe accepts enquiries for UI/UX design and website work for individuals and businesses. Requests can cover a new responsive website, a business or portfolio site, a landing page, a redesign, or practical maintenance and performance improvements.',
    faqs: [
      ['What website work can I enquire about?', 'You can ask about UI/UX design, responsive website design and development, business websites, landing pages, portfolio websites, redesigns, content and contact form integration, and maintenance.'],
      ['What should I include in a project enquiry?', 'Share the purpose of the site, its intended audience, the pages or features you need, any existing website link, and your preferred timeline. Do not send passwords or one time codes.'],
      ['Can PrimeServe help with hosting, a domain, or SSL?', 'The catalogue includes deployment and hosting setup, domain and SSL setup assistance. Availability and any third party costs can be discussed before work begins.'],
    ],
    related: ['/services', '/about'],
  },
};

const catalogueFaqs = [
  ['What services does PrimeServe provide?', 'PrimeServe offers assistance across government forms and documents, employment, education, PAN and tax, digital documents, business, banking, bills and recharges, travel, selected West Bengal services, and website design and development.'],
  ['How can I request online form filling assistance?', 'Find the relevant service in the catalogue and contact PrimeServe on WhatsApp, or use the enquiry form on the homepage. The team can explain the next steps and information needed.'],
  ['How do I enquire about service charges?', 'Ask PrimeServe about the specific service. Applicable PrimeServe charges are communicated before work begins.'],
  ['Are official application fees included in service charges?', 'Official portal or department fees and third party charges may be additional wherever applicable.'],
  ['Can I request assistance from home?', 'Many enquiries and services can be handled online. Availability depends on the specific service, location requirements, and applicable eligibility.'],
  ['Can PrimeServe help with scholarship applications?', 'The catalogue includes scholarship application assistance, including selected West Bengal scholarship services. Ask about the specific scheme and check current requirements on its official portal.'],
  ['Does PrimeServe guarantee government application approval?', 'No. Approval decisions and processing timelines are determined by the relevant government authority.'],
  ['How can I request UI/UX design or website development?', 'Review the website design and development service page, then send a project enquiry describing your goals, audience, pages, and requested features.'],
  ['How should I share documents for assistance?', 'Ask PrimeServe which documents are needed and how to share them for your request. Do not share passwords or one time codes.'],
  ['Are West Bengal government scheme services available?', 'PrimeServe lists assistance for selected West Bengal schemes and services. Availability and eligibility are specific to each service.'],
  ['How can I contact PrimeServe through WhatsApp?', 'Use a WhatsApp enquiry button on the website. It opens a prepared message for you to review and send.'],
];

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: business.name,
    url: `${siteUrl}/`,
    contactPoint: [{ '@type': 'ContactPoint', telephone: '+919091295713', contactType: 'customer service', availableLanguage: 'English' }],
  };
}

function structuredData(route) {
  if (!route) return [];
  const nodes = [organizationSchema(), {
    '@context': 'https://schema.org', '@type': 'WebSite', name: business.name, url: `${siteUrl}/`,
    potentialAction: { '@type': 'SearchAction', target: `${siteUrl}/services?search={search_term_string}`, 'query-input': 'required name=search_term_string' },
  }];
  if (route.kind === 'catalogue') nodes.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: catalogueFaqs.map(([name, answer]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  const detail = details[route.kind];
  if (detail) {
    const category = serviceCategories.find((item) => item.id === detail.category);
    const subsection = category?.subsections?.find((item) => item.id === detail.subsection);
    nodes.push({ '@context': 'https://schema.org', '@type': 'Service', name: subsection?.title ?? category.title, description: detail.intro, provider: { '@type': 'Organization', name: business.name, url: `${siteUrl}/` }, areaServed: route.kind === 'west-bengal' ? { '@type': 'AdministrativeArea', name: 'West Bengal, India' } : 'India, subject to service availability and eligibility' });
    nodes.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: detail.faqs.map(([name, answer]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  }
  if (route.path !== '/') {
    const segments = route.path.split('/').filter(Boolean);
    const crumbs = [{ name: 'Home', item: `${siteUrl}/` }];
    let current = '';
    for (const segment of segments) {
      current += `/${segment}`;
      const crumbRoute = publicRoutes.find((item) => item.path === current);
      const name = current === '/services' ? 'Services' : current === route.path ? visiblePageName(route) : crumbRoute?.title.replace(/ \| PrimeServe$/, '') ?? segment.replaceAll('-', ' ');
      crumbs.push({ name, item: absoluteUrl(current) });
    }
    nodes.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: crumb.item })) });
  }
  return nodes;
}

function visiblePageName(route) {
  if (details[route.kind]) {
    const detail = details[route.kind];
    const category = serviceCategories.find((item) => item.id === detail.category);
    return category.subsections?.find((item) => item.id === detail.subsection)?.title ?? category.title;
  }
  return ({ catalogue:'Services', about:'About PrimeServe', contact:'Contact PrimeServe', privacy:'Privacy Policy', terms:'Service Terms', home:'Home' })[route.kind] ?? route.title;
}

export function SeoHead({ pathname }) {
  const route = routeForPath(pathname);
  const title = route?.title ?? 'Page not found | PrimeServe';
  const description = route?.description ?? 'This PrimeServe page could not be found.';
  const canonical = absoluteUrl(route?.path ?? '/');
  const jsonLd = structuredData(route);
  useEffect(() => {
    document.title = title;
    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);
      if (!element) { element = document.createElement('meta'); document.head.append(element); }
      element.setAttribute(attribute, value);
    };
    setMeta('meta[name="description"]', 'name', 'description');
    document.head.querySelector('meta[name="description"]').content = description;
    for (const [name, value] of [['og:title', title], ['og:description', description], ['og:url', canonical], ['og:type', 'website'], ['og:image', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'], ['twitter:card', 'summary_large_image'], ['twitter:title', title], ['twitter:description', description], ['twitter:image', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80']]) {
      const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.head.querySelector(selector);
      if (!element) { element = document.createElement('meta'); element.setAttribute(name.startsWith('og:') ? 'property' : 'name', name); document.head.append(element); }
      element.content = value;
    }
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) { canonicalLink = document.createElement('link'); canonicalLink.rel = 'canonical'; document.head.append(canonicalLink); }
    canonicalLink.href = canonical;
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots); }
    robots.content = route ? 'index,follow' : 'noindex,follow';
    let dataScript = document.head.querySelector('#primeserve-jsonld');
    if (!dataScript) { dataScript = document.createElement('script'); dataScript.id = 'primeserve-jsonld'; dataScript.type = 'application/ld+json'; document.head.append(dataScript); }
    dataScript.textContent = JSON.stringify(jsonLd);
  }, [route, canonical, jsonLd, title, description]);
  return null;
}

function PageHeader() {
  const [open, setOpen] = useState(false);
  const label = (kind) => ({home:'Home',catalogue:'Services',about:'About Us',how:'How It Works',contact:'Contact'}[kind]);
  return <header className="nav"><div className="wrap navrow"><a className="brand" href="/" aria-label="PrimeServe home"><span className="mark"><Globe2 size={19}/></span><span>PrimeServe<small>DIGITAL SERVICES, MADE SIMPLE</small></span></a><nav className={open?'show':''} aria-label="Primary navigation">{routeLinks.map(({ path, kind }) => <a href={path} onClick={()=>setOpen(false)} key={path}>{label(kind)}</a>)}<button type="button" className="btn dark mobile" onClick={() => openWhatsApp('Hello PrimeServe, I would like to enquire about your digital services.')}>Enquire on WhatsApp ↗</button></nav><button type="button" className="btn dark desktop" onClick={() => openWhatsApp('Hello PrimeServe, I would like to enquire about your digital services.')}>Enquire on WhatsApp ↗</button><button type="button" className="menubtn" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header>;
}

function PageFooter() {
  const label = (kind) => ({home:'Home',catalogue:'Services',about:'About Us',how:'How It Works',contact:'Contact'}[kind]);
  return <footer><div className="wrap"><div className="footer-main"><div><a className="brand" href="/"><span className="mark"><Globe2 size={19}/></span><span>PrimeServe<small>DIGITAL SERVICES, MADE SIMPLE</small></span></a><p>Assistance with online applications, documentation, and everyday digital services.</p></div><div><b>EXPLORE</b>{routeLinks.map(({ path, kind }) => <a href={path} key={path}>{label(kind)}</a>)}</div><div><b>GET IN TOUCH</b><a href="/contact">Contact PrimeServe</a><button type="button" onClick={() => openWhatsApp('Hello PrimeServe, I would like to enquire about your digital services.')}>WhatsApp us ↗</button><a href="/privacy-policy">Privacy policy</a><a href="/terms">Service terms</a></div></div><div className="copyright">© {new Date().getFullYear()} PrimeServe. All rights reserved.</div></div></footer>;
}

function Crumb({ title, showServices = false }) { return <div className="breadcrumb"><a href="/">Home</a>{showServices&&<><span>/</span><a href="/services">Services</a></>}<span>/</span><span aria-current="page">{title}</span></div>; }
function EnquiryBanner({ message }) { return <div className="catalogue-contact"><div><span className="eyebrow">TALK TO PRIMESERVE</span><h2>Ask about your requirements</h2><p>Share what you need. Availability and applicable charges are discussed before work begins.</p></div><button type="button" className="btn blue" onClick={() => openWhatsApp(message)}>Enquire on WhatsApp <ArrowUpRight size={16}/></button></div>; }
function FAQ({ items }) { return <section className="seo-faq"><span className="eyebrow">COMMON QUESTIONS</span><h2>Frequently asked questions</h2>{items.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</section>; }

export function SeoFAQSection() { return <FAQ items={catalogueFaqs}/>; }
function RelatedLinks({ paths }) { return <section className="seo-related"><h2>Related information</h2><div>{paths.map((path) => { const route = publicRoutes.find((item) => item.path === path); return route && <a className="link" href={path} key={path}>{route.title.replace(/ \| PrimeServe$/, '')} <ArrowRight size={15}/></a>; })}</div></section>; }

function ServiceLanding({ route }) {
  const [selectedService,setSelectedService]=useState(null);
  const detail = details[route.kind];
  const category = serviceCategories.find((item) => item.id === detail.category);
  const subsection = category.subsections?.find((item) => item.id === detail.subsection);
  const services = subsection?.services ?? category.services;
  const projectMessage = 'Hello PrimeServe, I am interested in your UI/UX design and website development services. I would like to discuss my project.';
  return <><PageHeader/><main className="seo-page"><div className="catalogue-hero"><div className="wrap"><Crumb title={subsection?.title ?? category.title} showServices/><span className="eyebrow">PRIMESERVE · {route.kind === 'west-bengal' ? 'WEST BENGAL SERVICES' : 'ONLINE DIGITAL ASSISTANCE'}</span><h1>{subsection?.title ?? category.title}</h1><p>{detail.intro}</p><div className="catalogue-meta"><span>Availability depends on service</span><span>Official fees may be additional</span></div></div></div><div className="wrap seo-content">{route.kind === 'web-design' ? <section className="seo-explainer"><h2>Website services for your next project</h2><p>Enquiries can cover UI/UX design, visual website design, React website development, responsive layouts, business websites, landing pages, portfolio websites, content integration, and contact or WhatsApp forms. PrimeServe can also discuss website redesign, maintenance, speed improvements, deployment, and domain or SSL setup assistance.</p><h3>How to discuss a project</h3><p>Send the project purpose, intended audience, main pages, requested features, and any existing website link. Include your preferred timeline and any design references. Never share passwords or one time codes in an enquiry.</p><button type="button" className="btn blue" onClick={() => openWhatsApp(projectMessage)}>Discuss Your Project <ArrowUpRight size={16}/></button></section> : <section className="seo-explainer"><h2>Requesting assistance</h2><p>Contact PrimeServe with the specific service you need and ask which information or documents are required. Do not send passwords or one time codes. For changing government requirements, verify current instructions on the relevant official portal before applying.</p></section>}<section className="seo-service-list"><h2>{subsection ? 'Website design and development services' : 'Services in this category'}</h2><ul>{services.map((name) => <li key={name}><span>{name}</span><button type="button" className="seo-get-assist" onClick={() => setSelectedService({name,category})}>Get Assistance <ArrowUpRight size={14}/></button><button type="button" onClick={() => openWhatsApp(`Hello PrimeServe, I would like to enquire about ${name}. Please share the process, required documents, and service charges.`)}>Enquire on WhatsApp <ArrowUpRight size={14}/></button></li>)}</ul></section><FAQ items={detail.faqs}/><section className="seo-policy"><h2>Service information</h2><p>Availability depends on the requested service and applicable eligibility. Service charges are discussed before work begins; official application or third party fees may be additional. Government application approval and processing times are determined by the relevant authority.</p></section><RelatedLinks paths={detail.related}/><EnquiryBanner message={route.kind === 'web-design' ? projectMessage : `Hello PrimeServe, I would like to enquire about ${category.title}. Please share the process and applicable service charges.`}/></div></main><PageFooter/>{selectedService&&<ServiceEnquiry service={selectedService} onClose={()=>setSelectedService(null)}/>}</>;
}

function InfoPage({ route }) {
  if (route.kind === 'privacy') return <><PageHeader/><main className="seo-page"><div className="catalogue-hero"><div className="wrap"><Crumb title="Privacy Policy"/><h1>Privacy Policy</h1><p>How this website handles contact enquiries and external services.</p></div></div><div className="wrap seo-content"><section className="seo-explainer"><h2>Information entered into an enquiry</h2><p>The service enquiry form asks for your name, mobile number, optional email and language, the service you selected, answers to service-related questions, document readiness, and optional notes. The information is held in page memory while the form is open so you can review an enquiry draft. This website does not submit it to a PrimeServe server. Closing the form clears the page state; the site does not use browser storage for this form.</p><p>If you choose to open WhatsApp, the website opens a link containing only a generic note. Your enquiry answers and contact details are not placed in that URL. You can copy the prepared text and paste it into WhatsApp; PrimeServe receives it only if you choose to send it there. WhatsApp is a separate service and processes information under its own terms.</p><h2>How enquiry information is used</h2><p>Details you choose to send are used by PrimeServe to respond to your enquiry. How PrimeServe handles information after receiving a WhatsApp message is outside this website, and this page does not claim a retention or deletion practice on the business's behalf.</p><h2>Use only the information needed</h2><p>Do not enter passwords, one-time passwords, UPI or ATM PINs, card security codes, full Aadhaar or PAN numbers, or upload identity-document scans. The form asks about document availability instead of collecting document numbers or files.</p><h2>Correction or deletion requests</h2><p>If you want to correct or request deletion of information you have sent to PrimeServe, contact PrimeServe through the same communication channel used for the enquiry. This website cannot change or delete WhatsApp messages or information held by PrimeServe.</p><h2>External content</h2><p>The site currently requests font files from Google Fonts and a hero image from Unsplash. Those providers may receive standard connection information from your browser when those resources load.</p></section><EnquiryBanner message="Hello PrimeServe, I have a question about your privacy policy."/></div></main><PageFooter/></>;
  if (route.kind === 'terms') return <><PageHeader/><main className="seo-page"><div className="catalogue-hero"><div className="wrap"><Crumb title="Service Terms"/><h1>Customer Service Policy</h1><p>What to expect when requesting assistance from PrimeServe.</p></div></div><div className="wrap seo-content"><section className="seo-explainer"><h2>Availability and eligibility</h2><p>Services are offered subject to availability, applicable eligibility, and the requirements of the relevant portal or provider. Contact PrimeServe to confirm whether assistance is available for a specific request.</p><h2>Charges and official fees</h2><p>PrimeServe service charges are communicated before work begins. Official application fees and third party charges may be additional wherever applicable.</p><h2>Applications and processing</h2><p>PrimeServe provides assistance; government applications and bill payments are not directly processed by this website. Application decisions and processing times belong to the relevant authority or service provider. Approval and completion dates are not guaranteed.</p><h2>Accurate information</h2><p>Customers should provide accurate information and request help only for genuine applications and authorised services. Do not share passwords or one time codes in the public enquiry form.</p></section><EnquiryBanner message="Hello PrimeServe, I have a question about the customer service policy."/></div></main><PageFooter/></>;
  const title = route.kind === 'about' ? 'About PrimeServe' : 'Contact PrimeServe';
  return <><PageHeader/><main className="seo-page"><div className="catalogue-hero"><div className="wrap"><Crumb title={title}/><span className="eyebrow">ONLINE CYBER CAFE & DIGITAL SERVICES</span><h1>{title}</h1><p>{route.description}</p></div></div><div className="wrap seo-content">{route.kind === 'about' ? <section className="seo-explainer"><h2>Online assistance, with a personal touch</h2><p>PrimeServe helps people with government and educational applications, employment forms, document preparation, bill payment assistance, and other online services. Customers contact the business for guidance; applications and transactions are handled separately where applicable.</p><p>Service availability depends on the specific service and applicable eligibility. Official fees may be additional, and approval or processing timelines are determined by the relevant authority.</p><a className="btn blue" href="/services">Explore the service catalogue <ArrowRight size={16}/></a></section> : <section className="seo-explainer"><h2>Choose how to contact us</h2><p>For a quick enquiry, contact PrimeServe on WhatsApp. You can also use the enquiry form on the homepage; it prepares a message for you to review before sending.</p><button type="button" className="btn blue" onClick={() => openWhatsApp('Hello PrimeServe, I would like to enquire about your digital services.')}>WhatsApp PrimeServe <ArrowUpRight size={16}/></button><p><a className="link" href="/#contact">Open the contact form <ArrowRight size={15}/></a></p></section>}<RelatedLinks paths={['/services', '/services/government-document-assistance', '/services/website-design-development']}/></div></main><PageFooter/></>;
}

export function SeoRoutePage({ pathname }) {
  const route = routeForPath(pathname);
  if (!route) return <NotFoundPage/>;
  if (details[route.kind]) return <ServiceLanding route={route}/>;
  return <InfoPage route={route}/>;
}

export function NotFoundPage() {
  return <><PageHeader/><main className="seo-page"><div className="wrap seo-content"><section className="seo-explainer"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>We couldn’t find that page.</h1><p>Try the service catalogue or return to the PrimeServe homepage.</p><div className="actions"><a className="btn blue" href="/services">Explore services <ArrowRight size={16}/></a><a className="btn outline" href="/">Go to homepage</a></div></section></div></main><PageFooter/></>;
}

export function routeStructuredData(pathname) {
  const route = routeForPath(pathname) ?? publicRoutes[0];
  return structuredData(route);
}
