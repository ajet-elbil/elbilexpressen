// TypeScript interfaces describing the site content (data.json) and booking shapes.

export interface Meta {
  brand: string;
  tagline: string;
  phone: string;
  address: string;
  email: string;
  language: string;
  targetBrands: string[];
  seoKeywords: string[];
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
  cta_tertiary: string;
  trust_badges: string[];
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface About {
  title: string;
  description: string;
  values: AboutValue[];
  stats: AboutStat[];
}

export interface ServicePrice {
  standard: string;
  /** Member price shown to TOCN customers, when the service has one. */
  tocn?: string;
  /** Price that applies when the car is already in for service. */
  service?: string;
}

export interface Service {
  id: string;
  title: string;
  badge: string;
  shortDescription: string;
  includes: string[];
  interval: string;
  duration: string;
  price: ServicePrice;
  /** Extra fine print under the price (terms, price-guarantee wording). */
  note?: string;
  /** Shorter title/price for the cramped booking-modal grid. */
  bookingLabel?: string;
  bookingPrice?: string;
  /** Services without a bookable slot (e.g. mobility guarantee) set this to false. */
  bookable?: boolean;
}

/** Generic title + description pair used by several content sections. */
export interface ContentItem {
  title: string;
  description: string;
}

export interface Brand {
  name: string;
  models: string;
}

export interface Brands {
  label: string;
  title: string;
  description: string;
  featured: Brand[];
  othersTitle: string;
  others: string[];
}

export interface PriceGuarantee {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  stepsTitle: string;
  steps: ContentItem[];
  termsTitle: string;
  terms: string[];
}

export interface Capabilities {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  areasTitle: string;
  areas: ContentItem[];
}

export interface Tires {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  brandsTitle: string;
  brandsText: string;
  benefits: ContentItem[];
}

export interface Process {
  label: string;
  title: string;
  description: string;
  steps: ContentItem[];
}

export interface ServicePackage {
  title: string;
  description: string;
  includes: string[];
}

export interface TeslaPackages {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  packages: ServicePackage[];
  pricelist: TocnPricelist[];
  priceNote: string;
}

export interface EvHub {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  benefitsTitle: string;
  benefits: ContentItem[];
}

export interface TocnBenefit {
  title: string;
  description: string;
  highlight: boolean;
}

export interface TocnPricelistService {
  name: string;
  standard: string;
  tocn: string;
}

export interface TocnPricelist {
  model: string;
  services: TocnPricelistService[];
}

export interface Tocn {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  benefits: TocnBenefit[];
  pricelist: TocnPricelist[];
  cta: string;
}

export interface ServiceIntervalItem {
  service: string;
  interval: string;
  note: string;
}

export interface ServiceIntervals {
  title: string;
  description: string;
  items: ServiceIntervalItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** A heading plus its body copy on a landing page. */
export interface SeoPageSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

/** Label/value pair rendered as a scannable fact row; LLMs quote these readily. */
export interface SeoKeyFact {
  label: string;
  value: string;
}

/**
 * A standalone landing page. Each entry becomes a prerendered URL at /{slug}
 * with its own title, meta description, H1, FAQPage schema and breadcrumbs.
 */
export interface SeoPage {
  slug: string;
  /** Short name for breadcrumbs, the eyebrow label and related-page links. */
  label: string;
  title: string;
  metaDescription: string;
  h1: string;
  /** Self-contained opening paragraph, written to be quotable verbatim. */
  intro: string;
  keyFacts: SeoKeyFact[];
  sections: SeoPageSection[];
  faq: FaqItem[];
  /** Ids from `services` rendered as cards at the foot of the page. */
  relatedServiceIds: string[];
  /** Slugs of related pages, for internal linking. */
  related: string[];
  /** schema.org Service.serviceType for this page. */
  serviceType: string;
}

/** The dedicated local landing page at /elbil-service-oslo. */
export interface LocationPage {
  slug: string;
  label: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  napTitle: string;
  hoursTitle: string;
  directionsTitle: string;
  directions: string[];
  areasTitle: string;
  areasIntro: string;
  areasNote: string;
  highlightsTitle: string;
  highlights: ContentItem[];
  faq: FaqItem[];
}

/** The dedicated about page at /om-oss. */
export interface AboutPage {
  slug: string;
  label: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  factsTitle: string;
  facts: SeoKeyFact[];
  equipmentTitle: string;
  equipmentIntro: string;
  equipment: string[];
  brandsTitle: string;
  partnersTitle: string;
  partners: ContentItem[];
  promisesTitle: string;
  faq: FaqItem[];
}

export interface SiteData {
  meta: Meta;
  hero: HeroContent;
  about: About;
  brands: Brands;
  priceGuarantee: PriceGuarantee;
  capabilities: Capabilities;
  services: Service[];
  tires: Tires;
  process: Process;
  teslaPackages: TeslaPackages;
  evHub: EvHub;
  tocn: Tocn;
  serviceIntervals: ServiceIntervals;
  faq: FaqItem[];
  seoPages: SeoPage[];
  locationPage: LocationPage;
  aboutPage: AboutPage;
}

// Booking modal shapes
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  regNumber: string;
  message: string;
}

export interface BookingService {
  id: string;
  label: string;
  icon: () => React.ReactElement;
  price: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelectable: boolean;
}

// Shared prop for any component that can open the booking modal
export interface BookingTrigger {
  onOpenBooking: () => void;
}
