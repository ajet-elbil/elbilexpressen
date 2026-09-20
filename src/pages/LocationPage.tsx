// /elbil-service-oslo — the dedicated local landing page.
//
// This is the page that answers "hvor kan jeg reparere elbilen min i Oslo?".
// It carries the canonical NAP block, the opening-hours table, a map and the
// list of Oslo districts served, all as plain crawlable text. Oslo only: the
// workshop has one location, so no other municipality appears here or in the
// schema.

import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LastUpdated } from '../components/ui/LastUpdated';
import { FaqAccordion } from '../components/sections/FaqAccordion';
import { MapEmbed, NapCard, OpeningHours } from '../components/sections/Nap';
import { Link } from '../router';
import { BUSINESS, SERVICE_AREAS, TEL_HREF } from '../seo.config';
import { locationPage, seoPages } from '../data/content';
import type { Breadcrumb } from '../seo/meta';
import type { BookingTrigger } from '../types';

interface LocationPageProps extends BookingTrigger {
  breadcrumbs: Breadcrumb[];
}

export function LocationPage({ breadcrumbs, onOpenBooking }: LocationPageProps) {
  const page = locationPage;
  return (
    <article className="landing">
      <header className="landing-hero">
        <div className="content-container">
          <Breadcrumbs trail={breadcrumbs} />
          <span className="section-label">Oslo</span>
          <h1>{page.h1}</h1>
          <p className="landing-intro">{page.intro}</p>
          <div className="landing-actions">
            <button type="button" onClick={onOpenBooking} className="btn btn-primary">
              Bestill time
            </button>
            <a href={TEL_HREF} className="btn btn-outline">
              Ring {BUSINESS.phone}
            </a>
          </div>
        </div>
      </header>

      <section className="content-section alt" id="kontakt">
        <div className="content-container nap-grid">
          <NapCard title={page.napTitle} />
          <OpeningHours title={page.hoursTitle} />
        </div>
      </section>

      <section className="content-section">
        <div className="content-container">
          <h2>{page.directionsTitle}</h2>
          <div className="landing-prose">
            {page.directions.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <MapEmbed />
        </div>
      </section>

      <section className="content-section alt">
        <div className="content-container">
          <h2>{page.highlightsTitle}</h2>
          <div className="content-grid">
            {page.highlights.map(item => (
              <div className="content-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" id="serviceomrade">
        <div className="content-container">
          <h2>{page.areasTitle}</h2>
          <p className="landing-prose">{page.areasIntro}</p>
          <ul className="area-list">
            {SERVICE_AREAS.map(area => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <p className="landing-note">{page.areasNote}</p>
        </div>
      </section>

      <FaqAccordion
        items={page.faq}
        label="FAQ"
        title="Spørsmål om elbil-service i Oslo"
        id="faq"
        className="faq-section alt"
      />

      <section className="content-section">
        <div className="content-container">
          <h2>Tjenester i Oslo</h2>
          <ul className="related-links">
            {seoPages.map(item => (
              <li key={item.slug}>
                <Link href={`/${item.slug}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <LastUpdated />
        </div>
      </section>
    </article>
  );
}
