// Services section: header plus the grid of service cards from data.json.

import { services } from '../../data/content';
import { ServiceCard } from './ServiceCard';
import type { BookingTrigger } from '../../types';

export function Services({ onOpenBooking }: BookingTrigger) {
  return (
    <section className="services-section" id="tjenester">
      <div className="services-container">
        <div className="services-header reveal">
          <span className="section-label">Tjenester</span>
          <h2>Våre tjenester for el- og hybridbiler</h2>
        </div>
        <div className="service-cards">
          {services.map(s => (
            <ServiceCard key={s.id} service={s} onOpenBooking={onOpenBooking} />
          ))}
        </div>
      </div>
    </section>
  )
}
