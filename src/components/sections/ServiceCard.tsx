// Expandable card for a single service: icon, badge, description, includes list, price and CTA.

import { useState } from 'react';
import { hero } from '../../data/content';
import { SERVICE_ICON } from '../../data/serviceIcons';
import { AnnetIcon, CheckIcon, ChevronIcon, ClockIcon } from '../ui/Icons';
import type { BookingTrigger, Service } from '../../types';

interface ServiceCardProps extends BookingTrigger {
  service: Service;
}

export function ServiceCard({ service, onOpenBooking }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = SERVICE_ICON[service.id] ?? AnnetIcon;
  return (
    <article className="service-card reveal">
      <div className="service-card-top">
        <span className="service-card-icon"><Icon /></span>
        {service.badge && <span className="service-card-badge">{service.badge}</span>}
      </div>
      <h3>{service.title}</h3>
      <p className="service-card-desc">{service.shortDescription}</p>
      <button
        type="button"
        className="service-card-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? 'Skjul detaljer' : 'Se hva som inngår'}
        <ChevronIcon />
      </button>
      {expanded && (
        <ul className="service-card-includes">
          {service.includes.map(item => (
            <li key={item}><span className="check-icon"><CheckIcon /></span>{item}</li>
          ))}
        </ul>
      )}
      <div className="service-card-meta">
        <span><ClockIcon /> {service.duration}</span>
        <span>{service.interval}</span>
      </div>
      <div className="service-card-price">
        <span className="price-standard">{service.price.standard}</span>
        {service.price.tocn && <span className="price-tocn">{service.price.tocn}</span>}
        {service.price.service && <span className="price-tocn">{service.price.service}</span>}
      </div>
      {service.note && <p className="service-card-note">{service.note}</p>}
      {service.bookable !== false && (
        <button onClick={onOpenBooking} className="btn btn-primary service-card-btn">{hero.cta_primary}</button>
      )}
    </article>
  )
}
