// Builds the <head> markup for a page as an HTML string.
//
// This runs at build time inside the prerenderer, not in the browser. Writing
// the tags as a string (rather than letting React emit them during hydration)
// guarantees that title, canonical, Open Graph and JSON-LD are present in the
// served HTML — which is the only thing non-JavaScript crawlers such as GPTBot,
// PerplexityBot, ClaudeBot and CCBot will ever see.

import { LOCALE, OG_IMAGE, OG_LOCALE, SITE_URL } from '../seo.config';
import { graph } from './schema';
import type { PageMeta } from './meta';

/** Escapes text for use inside an HTML attribute. */
function attr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escapes text for use inside an element's text content. */
function text(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Escapes a JSON-LD payload so it cannot break out of the <script> element.
 * `</script>` inside the JSON would otherwise terminate the block early.
 */
function jsonLd(value: object): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function renderHead(meta: PageMeta): string {
  const tags: string[] = [];

  tags.push(`<title>${text(meta.title)}</title>`);
  tags.push(`<meta name="description" content="${attr(meta.description)}" />`);
  tags.push(`<link rel="canonical" href="${attr(meta.canonical)}" />`);

  if (meta.noindex) {
    tags.push('<meta name="robots" content="noindex, follow" />');
  } else {
    // max-image-preview:large and max-snippet:-1 let Google and AI Overviews
    // quote the full answer text rather than a truncated fragment.
    tags.push(
      '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />'
    );
  }

  // Single-language site: the page is its own hreflang target, plus x-default.
  tags.push(`<link rel="alternate" hreflang="${LOCALE}" href="${attr(meta.canonical)}" />`);
  tags.push(`<link rel="alternate" hreflang="x-default" href="${attr(meta.canonical)}" />`);

  tags.push(`<meta property="og:type" content="${attr(meta.ogType)}" />`);
  tags.push(`<meta property="og:site_name" content="Elbilexpressen" />`);
  tags.push(`<meta property="og:locale" content="${attr(OG_LOCALE)}" />`);
  tags.push(`<meta property="og:title" content="${attr(meta.title)}" />`);
  tags.push(`<meta property="og:description" content="${attr(meta.description)}" />`);
  tags.push(`<meta property="og:url" content="${attr(meta.canonical)}" />`);
  tags.push(`<meta property="og:image" content="${attr(OG_IMAGE.url)}" />`);
  tags.push(`<meta property="og:image:width" content="${OG_IMAGE.width}" />`);
  tags.push(`<meta property="og:image:height" content="${OG_IMAGE.height}" />`);
  tags.push(`<meta property="og:image:alt" content="${attr(OG_IMAGE.alt)}" />`);

  tags.push('<meta name="twitter:card" content="summary_large_image" />');
  tags.push(`<meta name="twitter:title" content="${attr(meta.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${attr(meta.description)}" />`);
  tags.push(`<meta name="twitter:image" content="${attr(OG_IMAGE.url)}" />`);
  tags.push(`<meta name="twitter:image:alt" content="${attr(OG_IMAGE.alt)}" />`);

  // Local-business hints for crawlers that read plain meta tags.
  tags.push('<meta name="geo.region" content="NO-03" />');
  tags.push('<meta name="geo.placename" content="Oslo" />');
  tags.push(`<meta name="author" content="Elbilexpressen" />`);

  tags.push(`<script type="application/ld+json">${jsonLd(graph(meta.schema))}</script>`);

  return tags.map(tag => `    ${tag}`).join('\n');
}

export { SITE_URL };
