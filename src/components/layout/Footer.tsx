// Site footer with brand, quick links, contact details and a booking CTA.
//
// The footer carries the NAP block on every page, rendered from seo.config so
// the address and phone number match the schema and the contact page exactly.
// The landing-page column is the site's main internal-linking hub: it puts every
// service page one click from anywhere, which is how crawlers reach them all.

import { hero, seoPages } from '../../data/content';
import { BUSINESS, FULL_ADDRESS, MAILTO_HREF, MAPS_URL, OPENING_HOURS, TEL_HREF } from '../../seo.config';
import { Logo } from '../ui/Logo';
import { Link } from '../../router';
import type { BookingTrigger } from '../../types';

export function Footer({ onOpenBooking }: BookingTrigger) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo">
              <Logo />
            </span>
            <p>{BUSINESS.description}</p>
          </div>
          <div className="footer-column">
            <h2>Tjenester</h2>
            <ul>
              {seoPages.map(page => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`}>{page.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h2>Om verkstedet</h2>
            <ul>
              <li><Link href="/elbil-service-oslo">Elbil service i Oslo</Link></li>
              <li><Link href="/om-oss">Om oss</Link></li>
              <li><Link href="/#tjenester">Alle tjenester</Link></li>
              <li><Link href="/#intervaller">Vedlikeholdsintervaller</Link></li>
              <li><Link href="/#faq">Ofte stilte spørsmål</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h2>Kontakt</h2>
            <address className="footer-address">
              <a href={TEL_HREF}>{BUSINESS.phone}</a>
              <a href={MAILTO_HREF}>{BUSINESS.email}</a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">{FULL_ADDRESS}</a>
            </address>
            <ul className="footer-hours">
              {OPENING_HOURS.map(row => (
                <li key={row.label}>
                  {row.label}: <time dateTime={row.opens}>{row.opens}</time>–
                  <time dateTime={row.closes}>{row.closes}</time>
                </li>
              ))}
              <li>Søndag: stengt</li>
            </ul>
            <button onClick={onOpenBooking} className="btn btn-primary">{hero.cta_primary}</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {BUSINESS.name} – {FULL_ADDRESS}</p>
        </div>
      </div>
    </footer>
  )
}
