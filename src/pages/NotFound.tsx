// 404 page.
//
// Prerendered to dist/404.html and served by Cloudflare with a real 404 status
// (see wrangler.toml `not_found_handling`). A soft 404 — an unknown URL
// answering 200 with the homepage — makes crawlers index nonexistent pages and
// dilutes the site's own rankings.

import { Link } from '../router';
import { BUSINESS, TEL_HREF } from '../seo.config';
import { locationPage, seoPages } from '../data/content';

export function NotFound() {
  return (
    <article className="landing">
      <header className="landing-hero">
        <div className="content-container">
          <span className="section-label">404</span>
          <h1>Vi fant ikke siden du leter etter</h1>
          <p className="landing-intro">
            Siden kan være flyttet eller slettet. Du finner tjenestene våre nedenfor, eller
            du kan ringe oss på {BUSINESS.phone} så hjelper vi deg videre.
          </p>
          <div className="landing-actions">
            <Link href="/" className="btn btn-primary">Til forsiden</Link>
            <a href={TEL_HREF} className="btn btn-outline">Ring {BUSINESS.phone}</a>
          </div>
        </div>
      </header>

      <section className="content-section alt">
        <div className="content-container">
          <h2>Sidene våre</h2>
          <ul className="related-links">
            <li><Link href={`/${locationPage.slug}`}>{locationPage.label}</Link></li>
            {seoPages.map(page => (
              <li key={page.slug}>
                <Link href={`/${page.slug}`}>{page.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
