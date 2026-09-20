// /om-oss — concrete, citable facts about the business.
//
// AI engines cite specifics: floor area, approval category, named equipment,
// exact address, named partners. Everything on this page is a verifiable fact
// already present in data.json — nothing is estimated or rounded up.

import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { FaqAccordion } from '../components/sections/FaqAccordion';
import { NapCard, OpeningHours } from '../components/sections/Nap';
import { Link } from '../router';
import { BUSINESS, TEL_HREF } from '../seo.config';
import { about, aboutPage, brands, locationPage } from '../data/content';
import type { Breadcrumb } from '../seo/meta';
import type { BookingTrigger } from '../types';

interface AboutPageProps extends BookingTrigger {
  breadcrumbs: Breadcrumb[];
}

export function AboutPage({ breadcrumbs, onOpenBooking }: AboutPageProps) {
  const page = aboutPage;
  return (
    <article className="landing">
      <header className="landing-hero">
        <div className="content-container">
          <Breadcrumbs trail={breadcrumbs} />
          <span className="section-label">{page.label}</span>
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

      <section className="content-section alt">
        <div className="content-container">
          <h2>{page.factsTitle}</h2>
          <dl className="key-facts">
            {page.facts.map(fact => (
              <div className="key-fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="content-section">
        <div className="content-container">
          <h2>{page.equipmentTitle}</h2>
          <p className="landing-prose">{page.equipmentIntro}</p>
          <ul className="landing-list">
            {page.equipment.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-section alt">
        <div className="content-container">
          <h2>{page.promisesTitle}</h2>
          <div className="content-grid">
            {about.values.map(value => (
              <div className="content-card" key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="content-container">
          <h2>{page.brandsTitle}</h2>
          <p className="landing-prose">{brands.description}</p>
          <div className="content-grid">
            {brands.featured.map(brand => (
              <div className="content-card" key={brand.name}>
                <h3>{brand.name}</h3>
                <p>{brand.models}</p>
              </div>
            ))}
          </div>
          <h3 className="content-grid-title">{brands.othersTitle}</h3>
          <ul className="area-list">
            {brands.others.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-section alt">
        <div className="content-container">
          <h2>{page.partnersTitle}</h2>
          <div className="content-grid">
            {page.partners.map(partner => (
              <div className="content-card" key={partner.title}>
                <h3>{partner.title}</h3>
                <p>{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" id="kontakt">
        <div className="content-container nap-grid">
          <NapCard title="Slik kontakter du oss" />
          <OpeningHours title="Åpningstider" />
        </div>
      </section>

      <FaqAccordion
        items={page.faq}
        label="FAQ"
        title="Spørsmål om Elbilexpressen"
        id="faq"
        className="faq-section alt"
      />

      <section className="content-section">
        <div className="content-container">
          <h2>Les også</h2>
          <ul className="related-links">
            <li>
              <Link href={`/${locationPage.slug}`}>{locationPage.label}</Link>
            </li>
            <li>
              <Link href="/elbilverksted-oslo">Elbilverksted i Oslo</Link>
            </li>
            <li>
              <Link href="/prisgaranti-bilverksted-oslo">Prisgaranti</Link>
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}
