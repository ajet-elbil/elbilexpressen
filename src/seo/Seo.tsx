// Keeps <head> in sync after a client-side navigation.
//
// The prerenderer already writes the correct head into every static HTML file,
// so this component does nothing on first paint. It only matters when a visitor
// navigates between pages in the SPA: without it the tab title, canonical URL
// and JSON-LD would still describe the page they arrived on.
//
// It reads the very same PageMeta object the prerenderer used, so the two can
// never drift apart.

import { useEffect } from 'react';
import { LOCALE, OG_IMAGE } from '../seo.config';
import { graph } from './schema';
import type { PageMeta } from './meta';

/** Marks every tag this component owns, so it can replace its own output only. */
const MANAGED = 'data-seo-managed';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  el.href = href;
}

export function Seo({ meta }: { meta: PageMeta }) {
  useEffect(() => {
    document.title = meta.title;
    document.documentElement.lang = LOCALE;

    upsertMeta('meta[name="description"]', { name: 'description', content: meta.description });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: meta.noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    });

    upsertLink('canonical', meta.canonical);
    upsertLink('alternate', meta.canonical, LOCALE);
    upsertLink('alternate', meta.canonical, 'x-default');

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: meta.canonical });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: meta.ogType });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: OG_IMAGE.url });

    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.description,
    });

    // Replace the JSON-LD graph wholesale — merging nodes across pages would
    // leave stale FAQ and breadcrumb entries behind.
    const previous = document.head.querySelectorAll('script[type="application/ld+json"]');
    previous.forEach(node => node.remove());
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(MANAGED, '');
    script.textContent = JSON.stringify(graph(meta.schema));
    document.head.appendChild(script);
  }, [meta]);

  return null;
}
