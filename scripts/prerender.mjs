import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { publicRoutes, siteUrl } from '../src/config/site.js';

const outDir = path.resolve('dist');
const template = await readFile(path.join(outDir, 'index.html'), 'utf8');
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
  const { routeStructuredData } = await vite.ssrLoadModule('/src/SeoPages.jsx');
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  for (const route of publicRoutes) {
    const markup = render(route.path);
    const canonical = new URL(route.path, `${siteUrl}/`).href;
    const image = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';
    const jsonLd = JSON.stringify(routeStructuredData(route.path)).replaceAll('<', '\\u003c');
    const socialMeta = [
      `<meta name="description" content="${escapeHtml(route.description)}">`,
      `<link rel="canonical" href="${escapeHtml(canonical)}">`,
      `<meta property="og:title" content="${escapeHtml(route.title)}">`,
      `<meta property="og:description" content="${escapeHtml(route.description)}">`,
      `<meta property="og:url" content="${escapeHtml(canonical)}">`,
      '<meta property="og:type" content="website">',
      `<meta property="og:image" content="${image}">`,
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:title" content="${escapeHtml(route.title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(route.description)}">`,
      `<meta name="twitter:image" content="${image}">`,
      `<script id="primeserve-jsonld" type="application/ld+json">${jsonLd}</script>`,
    ].join('\n    ');
    let html = template
      .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
      .replace(/<meta\s+(?:name="description"|property="og:[^"]+"|name="twitter:[^"]+")[^>]*>\s*/gi, '')
      .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
      .replace('</head>', `    ${socialMeta}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

    const outputPath = route.path === '/' ? path.join(outDir, 'index.html') : path.join(outDir, route.path.slice(1), 'index.html');
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, 'utf8');
    console.log(`Prerendered ${route.path}`);
  }

  const urls = publicRoutes.map(({ path: routePath }) => `  <url><loc>${new URL(routePath, `${siteUrl}/`).href}</loc></url>`).join('\n');
  await writeFile(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, 'utf8');
  await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
} finally {
  await vite.close();
}
