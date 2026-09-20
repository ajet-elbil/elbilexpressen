// Per-page metadata registry.
//
// One function, `getPageMeta(path)`, is the single source for a page's title,
// description, canonical URL, breadcrumbs and JSON-LD graph. The build-time
// prerenderer uses it to write real <head> tags into each static HTML file, and
// the client-side <Seo> component uses the same object to keep the head correct
// after an in-page navigation. Because both read the same registry, the static
// HTML and the hydrated app can never disagree.

import { aboutPage, faq as homeFaq, locationPage, seoPages } from '../data/content';
import { BUSINESS, LAST_UPDATED, SITE_URL, absoluteUrl } from '../seo.config';
import {
  autoRepairSchema,
  breadcrumbSchema,
  faqSchema,
  organizationSchema,
  serviceSchema,
  webPageSchema,
  webSiteSchema,
} from './schema';
import type { SeoPage } from '../types';

export interface Breadcrumb {
  name: string;
  path: string;
}

export interface PageMeta {
  /** Route path, always with a leading slash and no trailing slash ('/' excepted). */
  path: string;
  title: string;
  description: string;
  /** Absolute canonical URL. */
  canonical: string;
  ogType: string;
  breadcrumbs: Breadcrumb[];
  /** JSON-LD nodes for this page, emitted as one @graph. */
  schema: object[];
  /** Excluded from sitemap.xml and marked noindex (only the 404 page). */
  noindex?: boolean;
}

export const HOME_TITLE = 'Elbilexpressen – verksted for elbil og hybrid i Oslo';
export const HOME_DESCRIPTION =
  'Verksted for el- og hybridbiler i Konows gate 67B i Oslo. EU-kontroll kr 990,-, ' +
  'diagnostikk fra kr 990,- og Tesla-service fra kr 3 490,-. Rask time og prisgaranti.';

const HOME_CRUMB: Breadcrumb = { name: 'Hjem', path: '/' };

/** Nodes that describe the business itself and belong on every page. */
function globalNodes() {
  return [autoRepairSchema(), organizationSchema(), webSiteSchema()];
}

function homeMeta(): PageMeta {
  return {
    path: '/',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonical: absoluteUrl('/'),
    ogType: 'website',
    breadcrumbs: [],
    schema: [
      ...globalNodes(),
      webPageSchema({ path: '/', title: HOME_TITLE, description: HOME_DESCRIPTION }),
      faqSchema(homeFaq, '/'),
    ],
  };
}

function landingMeta(page: SeoPage): PageMeta {
  const path = `/${page.slug}`;
  const breadcrumbs = [HOME_CRUMB, { name: page.label, path }];
  return {
    path,
    title: page.title,
    description: page.metaDescription,
    canonical: absoluteUrl(page.slug),
    ogType: 'article',
    breadcrumbs,
    schema: [
      ...globalNodes(),
      webPageSchema({ path, title: page.title, description: page.metaDescription }),
      serviceSchema(page),
      faqSchema(page.faq, path),
      breadcrumbSchema(breadcrumbs),
    ],
  };
}

function locationMeta(): PageMeta {
  const path = `/${locationPage.slug}`;
  const breadcrumbs = [HOME_CRUMB, { name: locationPage.label, path }];
  return {
    path,
    title: locationPage.title,
    description: locationPage.metaDescription,
    canonical: absoluteUrl(locationPage.slug),
    ogType: 'website',
    breadcrumbs,
    schema: [
      ...globalNodes(),
      webPageSchema({
        path,
        title: locationPage.title,
        description: locationPage.metaDescription,
      }),
      faqSchema(locationPage.faq, path),
      breadcrumbSchema(breadcrumbs),
    ],
  };
}

function aboutMeta(): PageMeta {
  const path = `/${aboutPage.slug}`;
  const breadcrumbs = [HOME_CRUMB, { name: aboutPage.label, path }];
  return {
    path,
    title: aboutPage.title,
    description: aboutPage.metaDescription,
    canonical: absoluteUrl(aboutPage.slug),
    ogType: 'website',
    breadcrumbs,
    schema: [
      ...globalNodes(),
      {
        '@type': 'AboutPage',
        '@id': `${absoluteUrl(aboutPage.slug)}#webpage`,
        url: absoluteUrl(aboutPage.slug),
        name: aboutPage.title,
        description: aboutPage.metaDescription,
        inLanguage: 'nb-NO',
        mainEntity: { '@id': `${absoluteUrl('/')}#business` },
        // AboutPage replaces the generic WebPage node here, so it has to carry
        // the same isPartOf link and freshness dates to stay part of one graph.
        isPartOf: { '@id': `${SITE_URL}/#website` },
        datePublished: LAST_UPDATED,
        dateModified: LAST_UPDATED,
      },
      faqSchema(aboutPage.faq, path),
      breadcrumbSchema(breadcrumbs),
    ],
  };
}

export function notFoundMeta(): PageMeta {
  return {
    path: '/404',
    title: 'Siden finnes ikke (404) | Elbilexpressen',
    description: `Vi fant ikke siden du leter etter. Ring ${BUSINESS.phone} eller gå tilbake til forsiden.`,
    canonical: absoluteUrl('/'),
    ogType: 'website',
    breadcrumbs: [],
    schema: globalNodes(),
    noindex: true,
  };
}

/** Normalises '/Foo/' and 'foo' alike to '/foo'; the site root stays '/'. */
export function normalizePath(raw: string): string {
  if (!raw) return '/';
  const [withoutHash] = raw.split('#');
  const [pathOnly] = withoutHash.split('?');
  const trimmed = pathOnly.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed.toLowerCase()}` : '/';
}

/** Every indexable route, in sitemap order. */
export function allPageMeta(): PageMeta[] {
  return [
    homeMeta(),
    locationMeta(),
    aboutMeta(),
    ...seoPages.map(landingMeta),
  ];
}

/** Metadata for a path, or the 404 metadata when nothing matches. */
export function getPageMeta(path: string): PageMeta {
  const normalized = normalizePath(path);
  return allPageMeta().find(m => m.path === normalized) ?? notFoundMeta();
}

/** True when the path maps to a real page. Drives the 404 rendering. */
export function isKnownPath(path: string): boolean {
  const normalized = normalizePath(path);
  return allPageMeta().some(m => m.path === normalized);
}

/** Human label for a path, used by related-page links and breadcrumbs. */
export function labelForPath(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/') return 'Hjem';
  if (normalized === `/${locationPage.slug}`) return locationPage.label;
  if (normalized === `/${aboutPage.slug}`) return aboutPage.label;
  return seoPages.find(p => `/${p.slug}` === normalized)?.label ?? normalized;
}
