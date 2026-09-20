// Renders any entry in data.json's `seoPages` array as a full landing page.
//
// The structure is deliberate for AI search: a single H1, a self-contained
// opening paragraph, a table of concrete facts (prices, timeframes, equipment),
// H2 sections that never skip a level, an FAQ whose answers match the FAQPage
// schema verbatim, and internal links onward. Concrete numbers in plain text
// are what LLMs quote; vague claims are what they skip.

import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { LastUpdated } from '../components/ui/LastUpdated';
import { FaqAccordion } from '../components/sections/FaqAccordion';
import { ServiceCard } from '../components/sections/ServiceCard';
import { Link } from '../router';
import { BUSINESS, FULL_ADDRESS, TEL_HREF } from '../seo.config';
import { aboutPage, locationPage, seoPages, services } from '../data/content';
import type { Breadcrumb } from '../seo/meta';
import type { BookingTrigger, SeoPage } from '../types';

interface LandingPageProps extends BookingTrigger {
  page: SeoPage;
  breadcrumbs: Breadcrumb[];
}

/** Resolves a related slug to its path and label, including the two custom pages. */
function resolveRelated(slug: string): { path: string; label: string } | null {
  if (slug === locationPage.slug) return { path: `/${slug}`, label: locationPage.label };
  if (slug === aboutPage.slug) return { path: `/${slug}`, label: aboutPage.label };
  const page = seoPages.find(p => p.slug === slug);
  return page ? { path: `/${slug}`, label: page.label } : null;
}

export function LandingPage({ page, breadcrumbs, onOpenBooking }: LandingPageProps) {
  const relatedServices = page.relatedServiceIds
    .map(id => services.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedPages = page.related
    .map(resolveRelated)
    .filter((r): r is { path: string; label: string } => Boolean(r));

  return (
    <>
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
            {/* <address> is not valid inside <p>: the HTML parser closes the <p> early,
                so the browser's DOM no longer matches what React rendered and
                hydration fails (React error #418) on every landing page. */}
            <address className="landing-address">{`Elbilexpressen, ${FULL_ADDRESS}`}</address>
          </div>
        </header>

        {page.keyFacts.length > 0 && (
          <section className="content-section" aria-labelledby="fakta">
            <div className="content-container">
              <h2 id="fakta">Kort oppsummert</h2>
              <dl className="key-facts">
                {page.keyFacts.map(fact => (
                  <div className="key-fact" key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {page.sections.map((section, i) => (
          <section
            className={`content-section${i % 2 === 0 ? ' alt' : ''}`}
            key={section.heading}
          >
            <div className="content-container landing-prose">
              <h2>{section.heading}</h2>
              {section.paragraphs?.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="landing-list">
                  {section.bullets.map(bullet => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        {relatedServices.length > 0 && (
          <section className="content-section">
            <div className="content-container">
              <h2>Aktuelle tjenester</h2>
              <div className="service-cards">
                {relatedServices.map(service => (
                  <ServiceCard key={service.id} service={service} onOpenBooking={onOpenBooking} />
                ))}
              </div>
            </div>
          </section>
        )}

        <FaqAccordion
          items={page.faq}
          label="FAQ"
          title={`Spørsmål om ${page.label.toLowerCase()}`}
          id="faq"
          className="faq-section alt"
        />

        {relatedPages.length > 0 && (
          <section className="content-section">
            <div className="content-container">
              <h2>Les også</h2>
              <ul className="related-links">
                {relatedPages.map(related => (
                  <li key={related.path}>
                    <Link href={related.path}>{related.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <div className="content-container">
          <LastUpdated />
        </div>
      </article>
    </>
  );
}
