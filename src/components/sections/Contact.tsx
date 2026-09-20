// Homepage contact section: NAP, opening hours, map and call/email actions.
//
// The address, phone, e-mail and hours all come from seo.config — the same
// source as the JSON-LD — so the visible NAP and the structured data are
// guaranteed identical. Inconsistent NAP across a site is one of the strongest
// negative signals in local search.

import { locationPage } from '../../data/content';
import { BUSINESS, MAILTO_HREF, MAPS_URL, TEL_HREF } from '../../seo.config';
import { Link } from '../../router';
import { MapEmbed, NapCard, OpeningHours } from './Nap';

export function Contact() {
  return (
    <section className="content-section" id="kontakt">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="section-label">Kontakt</span>
          <h2>Kontakt Elbilexpressen i Oslo</h2>
          <p>
            Ring oss, send en e-post eller stikk innom verkstedet i {BUSINESS.streetAddress} på
            Ekeberg. Vi svarer gjerne på spørsmål om pris, tidsbruk og hva bilen din trenger.
          </p>
        </div>

        <div className="nap-grid">
          <NapCard title={locationPage.napTitle} />
          <OpeningHours title={locationPage.hoursTitle} />
        </div>

        <MapEmbed />

        <div className="cta-actions">
          <a href={TEL_HREF} className="btn btn-primary cta-btn">Ring oss</a>
          <a href={MAILTO_HREF} className="btn btn-outline cta-btn">Send e‑post</a>
          <a
            href={MAPS_URL}
            className="btn btn-primary-red cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Åpne i Google Maps
          </a>
        </div>

        <p className="landing-note">
          Se <Link href={`/${locationPage.slug}`}>elbil service i Oslo</Link> for veibeskrivelse
          og oversikt over bydelene vi betjener.
        </p>
      </div>
    </section>
  )
}
