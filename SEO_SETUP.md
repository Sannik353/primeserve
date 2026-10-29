# PrimeServe SEO implementation notes

## Baseline audit

The project is a Vite and React single-page application. Before this update it exposed the homepage and `/services`, used shared homepage metadata, and had no canonical tags, sitemap, robots file, route-specific landing pages, or structured data. Important React content was emitted client-side, so the HTML response did not contain the service content.

## Implemented

- Added route metadata and the canonical production origin in `src/config/site.js`.
- Added build-time React prerendering for `/`, `/services`, three focused service pages, `/about`, `/contact`, `/privacy-policy`, and `/terms`.
- Added distinct titles, descriptions, canonicals, Open Graph and Twitter tags to each generated route.
- Added Organization, WebSite, Service, FAQPage, and BreadcrumbList JSON-LD where those types match visible page content. No street address, review, rating, hours, social profile, or government affiliation is asserted.
- Added a generated sitemap and robots file. The sitemap only lists the nine generated public routes and omits last-modified dates.
- Added a noindex custom 404 page and removed the old `/services` rewrite so the generated static routes can be served directly.
- Added useful government document, West Bengal, and website design landing pages; the full catalogue remains available and searchable.
- Added visible answer-ready FAQs and matching FAQ structured data. Added a privacy page that describes the current browser-to-WhatsApp enquiry flow and external font/image requests.

## Manual follow-up after deployment

1. If a verified custom domain replaces the current Vercel URL, update `siteUrl` in `src/config/site.js` and rebuild. This regenerates canonical tags, structured data, sitemap, and robots sitemap location.
2. Verify the production deployment serves the generated routes and `404.html` with expected status codes over HTTPS.
3. Add the verified site to Google Search Console and Bing Webmaster Tools, then submit `/sitemap.xml`. No verification tokens or analytics IDs were supplied, so no tracking or verification tags were added.
4. Recheck the privacy copy if the contact workflow, external assets, hosting logs, or analytics change.

Build validation is performed with `npm run build`; no lint or type-check script is configured in this project.

At implementation time, the configured Vercel URL still served the prior homepage title (“PrimeServe — Everyday Services, Made Simpler”) and returned 404 for `/services`, the new landing pages, `/robots.txt`, and `/sitemap.xml`. The local changes therefore still need to be deployed before those live status checks can pass.
