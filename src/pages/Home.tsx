// Homepage: the original section stack, unchanged in order and content.

import { Hero } from '../components/sections/Hero';
import { Stats } from '../components/sections/Stats';
import { About } from '../components/sections/About';
import { Capabilities } from '../components/sections/Capabilities';
import { Brands } from '../components/sections/Brands';
import { SisterCompany } from '../components/sections/SisterCompany';
import { Services } from '../components/sections/Services';
import { TeslaPackages } from '../components/sections/TeslaPackages';
import { Tires } from '../components/sections/Tires';
import { PriceGuarantee } from '../components/sections/PriceGuarantee';
import { Process } from '../components/sections/Process';
import { EvHub } from '../components/sections/EvHub';
import { Tocn } from '../components/sections/Tocn';
import { ServiceIntervals } from '../components/sections/ServiceIntervals';
import { Faq } from '../components/sections/Faq';
import { Contact } from '../components/sections/Contact';
import type { BookingTrigger } from '../types';

export function Home({ onOpenBooking }: BookingTrigger) {
  return (
    <>
      <Hero onOpenBooking={onOpenBooking} />
      <Stats />
      <About />
      <Capabilities />
      <Brands />
      <SisterCompany />
      <Services onOpenBooking={onOpenBooking} />
      <TeslaPackages onOpenBooking={onOpenBooking} />
      <Tires onOpenBooking={onOpenBooking} />
      <PriceGuarantee />
      <Process />
      <EvHub />
      <Tocn onOpenBooking={onOpenBooking} />
      <ServiceIntervals />
      <Faq />
      <Contact />
    </>
  );
}
