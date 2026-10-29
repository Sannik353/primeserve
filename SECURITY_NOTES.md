# PrimeServe security audit notes

## Scope and results

- Reviewed the React/Vite source, WhatsApp helper, package manifest/lockfile, `.gitignore`, public assets, build output, and Vercel configuration.
- `npm audit` and `npm audit --omit=dev` both reported zero known vulnerabilities at audit time.
- No API routes, serverless functions, database, uploads, account system, or payment integration were found in the project source. This keeps the application's server-side attack surface relatively small; Vercel account settings and deployment environment variables were not accessible for inspection.
- Static checks found no use of `innerHTML`, `dangerouslySetInnerHTML`, `eval`, browser storage, or source maps. Secret-pattern checks found no likely credentials in tracked application/configuration files. This is not a substitute for reviewing Vercel environment variables.
- The WhatsApp helper uses the configured digits-only number, URL-encodes message text, and opens the fixed `wa.me` host with `noopener,noreferrer`. The contact form prepares its message locally and does not put entered details into a URL.

## Changes made

- `.gitignore` now ignores `.env` and `.env.*` files while allowing a future placeholder-only `.env.example`.
- Contact form fields now cap name, phone, and message lengths and validate phone digit count. This is client-side validation only.
- Vercel responses are configured with `nosniff`, `DENY` framing, a strict referrer policy, a restrictive permissions policy, and a reviewed Content Security Policy in **Report-Only** mode.
- The CSP allows the local application plus the existing Google Fonts and Unsplash resources. The report-only policy is intentional until the deployed site has been exercised in a browser; it does not block violations yet. No remote CSP report collector is configured, so review violations in browser developer tools.
- The live deployment already returned HSTS (`max-age=63072000; includeSubDomains; preload`) before these changes, so the project does not add a duplicate HSTS rule.

## Follow-up after deployment

1. Confirm the Vercel deployment applies the headers to HTML, static assets, `robots.txt`, `sitemap.xml`, and the 404 response.
2. Test the site in a browser and inspect the browser console for CSP violations on the homepage, service routes, search, accordions, forms, Google Fonts, Unsplash images, and WhatsApp links. If clean, promote the report-only policy to enforced `Content-Security-Policy`.
3. Verify Vercel preview deployment access controls and environment variables in the Vercel dashboard; those settings were not accessible in this audit.
4. If a backend is introduced later, add server-side validation, abuse controls, and appropriate data retention safeguards. Current contact form validation runs only in the browser.

No lint or test script is configured. The production build and both npm audits passed.
