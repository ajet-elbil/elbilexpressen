// Central SEO / business configuration.
//
// Everything here is NAP (Name, Address, Phone) and identity data that must stay
// byte-identical across the header, footer, contact section, JSON-LD schema,
// sitemap and llms.txt. Import from here instead of re-typing a value anywhere —
// inconsistent NAP is the single most common local-SEO defect.
//
// Human-facing copy still lives in data.json; this file holds only machine-facing
// and structural facts.

import { meta } from './data/content';

/** Canonical origin. No trailing slash. Used for canonical URLs, OG, sitemap, schema. */
export const SITE_URL = 'https://elbilexpressen.no';

/** BCP-47 primary language. The site is Norwegian Bokmål only. */
export const LOCALE = 'nb-NO';
export const OG_LOCALE = 'nb_NO';

/**
 * Date the site content was last reviewed, ISO 8601 (YYYY-MM-DD).
 *
 * Feeds `datePublished`/`dateModified` in the WebPage schema and the visible
 * "Sist oppdatert" line on inner pages. Bump it here — and only here — whenever
 * prices, services or opening hours change. Leaving it stale while the content
 * moves on is worse than having no date at all, because it tells a crawler the
 * old figures are current.
 */
export const LAST_UPDATED = '2026-09-20';

/** LAST_UPDATED formatted for display, e.g. "20. september 2026". */
export function formatNorwegianDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Only facts that appear in data.json or were confirmed by the business belong in
// BUSINESS: it feeds the visible NAP and the JSON-LD alike. Deliberately absent —
// add them back once confirmed, never guessed:
//   legalName         (registered name, e.g. with "AS")
//   paymentAccepted   (which payment methods the workshop takes)
//   priceRange        (must agree with the prices in data.json, which reach kr 12 300)
export const BUSINESS = {
  name: meta.brand,
  /** Short factual description reused in meta tags, schema and llms.txt. */
  description:
    'Elbilexpressen er et verksted for el- og hybridbiler i Konows gate 67B i Oslo. ' +
    'Vi utfører service, EU-kontroll, diagnostikk, bremse- og dekkarbeid samt avanserte ' +
    'reparasjoner på høyvoltsystemer, med rask timebestilling og prisgaranti.',
  phone: meta.phone,
  /** E.164 form — required by schema.org and tel: links. */
  phoneE164: '+4724200023',
  email: meta.email,
  streetAddress: 'Konows gate 67B',
  postalCode: '0196',
  addressLocality: 'Oslo',
  addressRegion: 'Oslo',
  addressCountry: 'NO',
  /**
   * Geocoded from OpenStreetMap for "67B, Konows gate, 0196 Oslo" (about 10 m
   * accuracy). The previous value, 59.9008 / 10.7793, was roughly 300 m off.
   * Worth a glance against the Google Business Profile pin.
   */
  geo: { latitude: 59.9022, longitude: 10.7837 },
  currenciesAccepted: 'NOK',
} as const;

/** Single formatted address string — the only address rendering used on the site. */
export const FULL_ADDRESS = `${BUSINESS.streetAddress}, ${BUSINESS.postalCode} ${BUSINESS.addressLocality}`;

/** tel: href derived from the E.164 number so every phone link is identical. */
export const TEL_HREF = `tel:${BUSINESS.phoneE164}`;
export const MAILTO_HREF = `mailto:${BUSINESS.email}`;

/** Google Maps links: one for humans (directions), one for the lazy-loaded embed. */
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${FULL_ADDRESS}, Norge`
)}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  `${FULL_ADDRESS}, Norge`
)}&output=embed`;

/**
 * Opening hours. `days` uses schema.org DayOfWeek values; `label` is the
 * Norwegian rendering. Both the visible table and openingHoursSpecification are
 * generated from this array so they can never drift apart.
 */
export const OPENING_HOURS = [
  { label: 'Mandag – fredag', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  { label: 'Lørdag', days: ['Saturday'], opens: '10:00', closes: '15:00' },
] as const;

/** Days with no opening-hours entry, rendered as "Stengt". */
export const CLOSED_DAYS = [{ label: 'Søndag', days: ['Sunday'] }] as const;

/**
 * Public profiles, emitted as schema.org `sameAs` on AutoRepair and Organization.
 *
 * These are guessed URL patterns, not confirmed profiles. A `sameAs` pointing at
 * a page that does not exist, or at someone else's account, weakens the entity
 * instead of strengthening it — so the build warns while any entry still appears
 * in PLACEHOLDER_SAME_AS below, and you should replace them before deploying.
 */
// TODO: Replace with verified URLs from Google Business Profile, Facebook, Instagram
export const SAME_AS: string[] = [];

/**
 * The unverified defaults above. `scripts/prerender.mjs` compares SAME_AS
 * against this list and prints a warning for every entry still unchanged, so
 * placeholder profiles cannot reach production unnoticed.
 */
export const PLACEHOLDER_SAME_AS: readonly string[] = [];

/**
 * Default Open Graph / Twitter card image.
 *
 * Currently reuses the hero illustration because no purpose-made share image
 * exists yet. Replace it with a 1200x630 image at /public/og-image.png (and
 * update the dimensions here) — that is the aspect ratio Facebook, LinkedIn,
 * Slack and X crop to, and a mismatched one gets letterboxed or centre-cropped.
 */
export const OG_IMAGE = {
  url: `${SITE_URL}/images/maintenance.png`,
  width: 1536,
  height: 1024,
  alt: 'Elbilexpressen – verksted for el- og hybridbiler i Konows gate 67B, Oslo',
};

/**
 * Logo used for schema.org `logo` and `image`.
 *
 * Points at the SVG mark, which Google Search does accept. A dedicated square
 * raster logo (512x512 PNG at /public/logo.png) would be better for the
 * knowledge panel — add one and repoint this constant.
 */
export const LOGO_URL = `${SITE_URL}/favicon.svg`;

/**
 * Oslo districts and neighbourhoods we serve. Used on the location page and as
 * schema `areaServed`. Oslo only — the workshop has one location and no branches.
 */
export const SERVICE_AREAS = [
  'Sentrum', 'Gamlebyen', 'Grønland', 'Tøyen', 'Grünerløkka', 'Frogner',
  'Majorstuen', 'St. Hanshaugen', 'Sagene', 'Bjørvika', 'Ekeberg', 'Nordstrand',
  'Lambertseter', 'Manglerud', 'Bryn', 'Helsfyr', 'Økern', 'Løren', 'Sinsen',
  'Grorud', 'Stovner', 'Furuset', 'Alna', 'Ullern', 'Røa', 'Vinderen', 'Holmenkollen',
];

/** Absolute URL for a route path. `/` returns the bare origin. */
export function absoluteUrl(path: string): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}/${path.replace(/^\/+|\/+$/g, '')}/`;
}
