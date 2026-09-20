// Single typed entry point for all site content (from data.json) plus booking constants.

import rawData from '../../data.json';
import type { SiteData } from '../types';

// data.json is the source of truth for every string, price and service.
export const content = rawData as unknown as SiteData;

// Convenience named exports for the most-used slices.
export const {
  meta,
  hero,
  about,
  brands,
  priceGuarantee,
  capabilities,
  services,
  tires,
  process: workflow,
  teslaPackages,
  evHub,
  tocn,
  serviceIntervals,
  faq,
  seoPages,
  locationPage,
  aboutPage,
} = content;

// Bookable time slots shown in the booking calendar.
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
] as const;
