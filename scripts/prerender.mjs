// Build-time prerenderer.
//
// Renders every route to static HTML and writes sitemap.xml and llms.txt.
//
// Why this exists: the site was a client-rendered SPA, so dist/index.html
// shipped an empty <div id="root"> and every heading, price and FAQ answer
// appeared only after JavaScript ran. Googlebot renders JS on a delayed second
// pass, but GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot and CCBot do not
// execute JavaScript at all — they saw a blank page. After this step each URL is
// a complete HTML document that needs no JavaScript to be read.
//
// Run by `npm run build` after the client and SSR bundles are built.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js');

const { render, allPageMeta, SITE_URL, SAME_AS, PLACEHOLDER_SAME_AS } = await import(
  pathToFileURL(ssrEntry).href
);

const template = await readFile(join(distDir, 'index.html'), 'utf8');

if (!template.includes('<!--app-html-->') || !template.includes('<!--seo-head-->')) {
  throw new Error('index.html is missing the <!--app-html--> or <!--seo-head--> placeholder');
}

/** Maps a route path to the file it is written to. */
function outputPath(routePath) {
  if (routePath === '/') return join(distDir, 'index.html');
  if (routePath === '/404') return join(distDir, '404.html');
  return join(distDir, routePath.replace(/^\//, ''), 'index.html');
}

const pages = allPageMeta();
const routes = [...pages.map(p => p.path), '/404'];

const warnings = [];

// A sameAs pointing at a profile that does not exist, or at an account someone
// else owns, actively harms the entity Google builds for this business. Fail
// loudly for as long as the guessed defaults are still in place.
for (const url of SAME_AS) {
  if (PLACEHOLDER_SAME_AS.includes(url)) {
    warnings.push(`sameAs still holds the unverified placeholder ${url} — replace it in src/seo.config.ts`);
  }
}

for (const routePath of routes) {
  const { html, head, title } = render(routePath);
  const page = template
    .replace('<!--seo-head-->', head)
    .replace('<!--app-html-->', html);

  const file = outputPath(routePath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page, 'utf8');

  const meta = pages.find(p => p.path === routePath);
  if (meta) {
    if (title.length < 45 || title.length > 62) {
      warnings.push(`${routePath}: title is ${title.length} chars (target 50-60)`);
    }
    if (meta.description.length < 130 || meta.description.length > 165) {
      warnings.push(`${routePath}: description is ${meta.description.length} chars (target 140-160)`);
    }
  }

  // A prerendered page must contain real copy, not just the shell.
  const textLength = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
  if (textLength < 500) {
    warnings.push(`${routePath}: only ${textLength} characters of rendered text`);
  }

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (routePath !== '/404' && h1Count !== 1) {
    warnings.push(`${routePath}: found ${h1Count} <h1> elements, expected exactly 1`);
  }

  console.log(`  ${routePath.padEnd(38)} ${String(textLength).padStart(6)} chars of text`);
}

// ---------------------------------------------------------------------------
// sitemap.xml — only indexable pages, so the 404 is deliberately excluded.
// ---------------------------------------------------------------------------
const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(page =>
    [
      '  <url>',
      `    <loc>${page.canonical}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${page.path === '/' ? 'weekly' : 'monthly'}</changefreq>`,
      `    <priority>${page.path === '/' ? '1.0' : page.path === '/elbil-service-oslo' ? '0.9' : '0.8'}</priority>`,
      '  </url>',
    ].join('\n')
  ),
  '</urlset>',
  '',
].join('\n');

await writeFile(join(distDir, 'sitemap.xml'), sitemap, 'utf8');

// ---------------------------------------------------------------------------
// llms.txt — a plain-text brief for LLM crawlers, in the emerging convention of
// a single markdown file at the site root. It states the facts an AI engine
// needs to answer "which workshop in Oslo services EVs" without parsing the site.
// ---------------------------------------------------------------------------
const dataRaw = JSON.parse(await readFile(join(root, 'data.json'), 'utf8'));

const llms = `# Elbilexpressen

> Elbilexpressen er et verksted for el- og hybridbiler i Konows gate 67B, 0196 Oslo, Norge.
> Vi utfører service, EU-kontroll, diagnostikk, bremse- og dekkarbeid samt reparasjon av
> høyvoltsystemer på alle bilmerker med el- og hybriddrift. Vi betjener kun Oslo.

## Fakta

- Navn: Elbilexpressen
- Adresse: Konows gate 67B, 0196 Oslo, Norge
- Telefon: +47 24 20 00 23
- E-post: kontakt@elbilexpressen.no
- Nettsted: ${SITE_URL}
- Språk: Norsk (bokmål)
- Åpningstider: Mandag–fredag 08:00–17:00, lørdag 10:00–15:00, søndag stengt
- Verkstedareal: ca. 3 500 m²
- Godkjenning: Kategori 01-verksted med egen EU-kontrollinje
- Diagnoseutstyr: Tesla Toolbox 3, Autel, Bosch, Launch, Hunter hjulstilling
- Serviceområde: Oslo (kun denne byen – ingen andre lokasjoner)
- Samarbeidspartnere: EV Hub (teknisk), Tesla Owners Club Norway (TOCN)
- Søsterselskap: Oljeskiftexpressen

## Priser (per ${lastmod})

${dataRaw.services
  .map(s => `- ${s.title}: ${s.price.standard}${s.price.tocn ? ` — TOCN: ${s.price.tocn}` : ''}`)
  .join('\n')}
- Tesla liten service Model 3/Y: kr 3 490,- (TOCN kr 3 400,-)
- Tesla stor service Model 3/Y: kr 4 999,- (TOCN kr 3 999,-)
- Tesla liten service Model S/X: kr 4 399,- (TOCN kr 3 519,-)
- Tesla stor service Model S/X: kr 5 900,- (TOCN kr 4 720,-)

## Bilmerker

Alle merker med el- og hybriddrift. Særlig kompetanse på ${dataRaw.meta.targetBrands.join(', ')}.
Andre merker: ${dataRaw.brands.others.filter(b => !b.startsWith('Andre')).join(', ')}.

## Sider

- [Forsiden](${SITE_URL}/): oversikt over tjenester, priser og verkstedet
- [Elbil service Oslo](${SITE_URL}/elbil-service-oslo/): adresse, åpningstider, serviceområde og veibeskrivelse
- [Om oss](${SITE_URL}/om-oss/): fakta om verkstedet, utstyr, godkjenning og samarbeidspartnere
${dataRaw.seoPages.map(p => `- [${p.label}](${SITE_URL}/${p.slug}/): ${p.metaDescription}`).join('\n')}

## Vilkår og garantier

- Prisgaranti: skriftlig, spesifisert og sammenlignbart tilbud fra registrert, offentlig godkjent
  verksted i Norge, maks 14 dager gammelt, avklart før arbeidet bestilles.
- Mobilitetsgaranti: 12 måneder uten egenandel ved kvalifiserende service, døgnåpen assistanse i Norden.
- Service utføres og dokumenteres etter produsentens serviceprogram med deler av original eller
  tilsvarende kvalitet, slik at garantirettigheter ivaretas.
- Alle servicekunder får gratis innvendig rengjøring og utvendig håndvask.

## Kontakt

Ring +47 24 20 00 23, send e-post til kontakt@elbilexpressen.no, eller bestill time på ${SITE_URL}/.
`;

await writeFile(join(distDir, 'llms.txt'), llms, 'utf8');

console.log(`\n  ${routes.length} pages, sitemap.xml (${pages.length} urls) and llms.txt written`);

if (warnings.length > 0) {
  console.log('\n  SEO warnings:');
  for (const warning of warnings) console.log(`    - ${warning}`);
}
