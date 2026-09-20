// Maps service ids to their decorative icon components and derives the booking service list.

import type { ReactElement } from 'react';
import { services } from './content';
import type { BookingService } from '../types';
import {
  EuKontrollIcon,
  BremserIcon,
  HjulskiftIcon,
  AcServiceIcon,
  RuteskiftIcon,
  HvBatteriIcon,
  SohAvlesingIcon,
  HentingIcon,
  BilvaskIcon,
  HoyvoltIcon,
  TilstandskontrollIcon,
  MobilitetIcon,
  AnnetIcon,
} from '../components/ui/Icons';

// Map each service id from data.json to a decorative SVG icon
export const SERVICE_ICON: Record<string, () => ReactElement> = {
  'eu-kontroll': EuKontrollIcon,
  'diagnostikk': SohAvlesingIcon,
  'bremseservice': BremserIcon,
  'dekk-dekkskift-balansering': HjulskiftIcon,
  'ac-service': AcServiceIcon,
  'kupefilter': RuteskiftIcon,
  'dekkhotell': AnnetIcon,
  '12v-batteri': HvBatteriIcon,
  'henting-levering': HentingIcon,
  'bilvask': BilvaskIcon,
  'hoyvolt-reparasjon': HoyvoltIcon,
  'tilstandskontroll': TilstandskontrollIcon,
  'mobilitetsgaranti': MobilitetIcon,
}

// Services for the booking modal, derived from data.json.
// Entries flagged `bookable: false` (e.g. the mobility guarantee) are not bookable on their own.
export const SERVICES: BookingService[] = services
  .filter(s => s.bookable !== false)
  .map(s => ({
    id: s.id,
    label: s.bookingLabel ?? s.title,
    icon: SERVICE_ICON[s.id] ?? AnnetIcon,
    price: s.bookingPrice ?? s.price.standard,
  }))
