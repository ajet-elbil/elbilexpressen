// Tyre section: tyre sales, seasonal changeover and the tyre hotel.

import { tires } from '../../data/content';
import type { BookingTrigger } from '../../types';

export function Tires({ onOpenBooking }: BookingTrigger) {
  return (
    <section className="content-section" id="dekk">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="content-badge">{tires.badge}</span>
          <h2>{tires.title}</h2>
          <p className="content-subtitle">{tires.subtitle}</p>
          <p>{tires.description}</p>
          <button onClick={onOpenBooking} className="btn btn-primary content-cta">{tires.cta}</button>
        </div>

        <div className="content-grid">
          {tires.benefits.map((benefit, i) => (
            <div className="content-card reveal" key={benefit.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="terms-box reveal">
          <h3>{tires.brandsTitle}</h3>
          <p>{tires.brandsText}</p>
        </div>
      </div>
    </section>
  )
}
