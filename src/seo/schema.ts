// schema.org JSON-LD builders.
//
// Structured data is how an AI search engine learns that this site is one
// specific workshop in Oslo rather than a page of text that mentions Oslo.
// Every builder returns a plain object; `renderHead` serialises them into
// <script type="application/ld+json"> tags at build time, so the markup is in
// the static HTML and needs no JavaScript to be read.

import {
  BUSINESS,
  FULL_ADDRESS,
  LAST_UPDATED,
  LOGO_URL,
  OG_IMAGE,
  OPENING_HOURS,
  SAME_AS,
  SITE_URL,
  absoluteUrl,
} from '../seo.config';
import { services } from '../data/content';
import type { FaqItem, SeoPage } from '../types';

/** Stable @id values so every graph node points at the same entity. */
export const ID = {
  business: `${SITE_URL}/#business`,
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
};

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: BUSINESS.streetAddress,
  postalCode: BUSINESS.postalCode,
  addressLocality: BUSINESS.addressLocality,
  addressRegion: BUSINESS.addressRegion,
  addressCountry: BUSINESS.addressCountry,
};

const openingHoursSpecification = OPENING_HOURS.map(h => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days.map(d => `https://schema.org/${d}`),
  opens: h.opens,
  closes: h.closes,
}));

/**
 * AutoRepair is a subtype of LocalBusiness and the single most important node
 * on the site: it carries the NAP, geo, hours and service area that local and
 * AI search results are built from.
 */
export function autoRepairSchema() {
  return {
    '@type': 'AutoRepair',
    '@id': ID.business,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    image: [OG_IMAGE.url, LOGO_URL],
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    address: postalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`,
    openingHoursSpecification,
    // One workshop, one city. Deliberately no other municipalities.
    areaServed: { '@type': 'City', name: 'Oslo', '@id': 'https://www.wikidata.org/wiki/Q585' },
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
    // No `parentOrganization`: the site calls Oljeskiftexpressen a *sister*
    // company, and schema.org has no sibling property. Calling it the parent
    // would state a corporate relationship the business never claimed.
    makesOffer: services.map(s => ({
      '@type': 'Offer',
      name: s.title,
      description: s.shortDescription,
      priceCurrency: 'NOK',
      ...offerPrice(s.price.standard),
      availableAtOrFrom: { '@id': ID.business },
    })),
  };
}

/**
 * Turns Norwegian price copy into schema.org price fields.
 *
 * "Kr 990,-" is a fixed price and becomes `price`. "Fra kr 1 490,-" is a
 * starting price and becomes a PriceSpecification with `minPrice` — publishing
 * it as `price` would advertise a figure the customer may not actually pay.
 * Copy with no figure at all ("Kontakt oss for pris") yields nothing, because an
 * invented price in structured data is worse than an absent one.
 */
function offerPrice(raw: string): Record<string, unknown> {
  const match = raw.match(/kr\s*([\d\s]+)/i);
  if (!match) return {};
  const digits = match[1].replace(/[\s]/g, '');
  const value = Number(digits);
  if (!digits || !Number.isFinite(value) || value <= 0) return {};

  const isFromPrice = /^\s*fra\b/i.test(raw);
  return isFromPrice
    ? {
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: value,
          priceCurrency: 'NOK',
        },
      }
    : { price: value };
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ID.organization,
    name: BUSINESS.name,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
    description: BUSINESS.description,
    address: postalAddress,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS.phoneE164,
        email: BUSINESS.email,
        contactType: 'customer service',
        areaServed: 'NO',
        // The site is Norwegian only; nothing on it promises support in English.
        availableLanguage: ['Norwegian'],
      },
    ],
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  };
}

export function webSiteSchema() {
  // No `potentialAction: SearchAction`. The site has no search endpoint, so the
  // markup would describe a URL that does not work, and Google retired the
  // sitelinks searchbox it used to feed.
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: `${SITE_URL}/`,
    name: BUSINESS.name,
    inLanguage: 'nb-NO',
    publisher: { '@id': ID.organization },
  };
}

/**
 * FAQPage. Answers must match the visible text on the page exactly — Google
 * treats a mismatch as a structured-data violation, and it is also what makes
 * the answer safe for an LLM to quote.
 */
export function faqSchema(items: FaqItem[], pagePath: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(pagePath)}#faq`,
    inLanguage: 'nb-NO',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Service node for a landing page, tied to the business as provider. */
export function serviceSchema(page: SeoPage) {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(page.slug)}#service`,
    name: page.serviceType,
    description: page.intro,
    serviceType: page.serviceType,
    url: absoluteUrl(page.slug),
    provider: { '@id': ID.business },
    areaServed: { '@type': 'City', name: 'Oslo' },
    audience: { '@type': 'Audience', audienceType: 'Eiere av el- og hybridbiler i Oslo' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: absoluteUrl(page.slug),
      servicePhone: BUSINESS.phoneE164,
      serviceLocation: { '@id': ID.business },
    },
  };
}

/** WebPage node — ties a URL to the site, the language and the business. */
export function webPageSchema(opts: { path: string; title: string; description: string }) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: 'nb-NO',
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.business },
    primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE.url },
    // Both read LAST_UPDATED so the schema dates, the visible 'Sist oppdatert'
    // line and the sitemap lastmod cannot tell three different stories.
    datePublished: LAST_UPDATED,
    dateModified: LAST_UPDATED,
  };
}

/** Wraps nodes in a single @graph so crawlers resolve the @id references. */
export function graph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
