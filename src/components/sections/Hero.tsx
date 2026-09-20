// Hero section: tagline, headline, primary CTAs and trust badges.

import { meta, hero } from '../../data/content';
import { CheckIcon } from '../ui/Icons';
import type { BookingTrigger } from '../../types';

export function Hero({ onOpenBooking }: BookingTrigger) {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <span className="section-label">{meta.tagline}</span>
          <h1>{hero.headline}</h1>
          <p>{hero.subheadline}</p>
          <div className="hero-buttons">
            <button onClick={onOpenBooking} className="btn btn-primary">{hero.cta_primary}</button>
            <a href="#kontakt" className="btn btn-outline">{hero.cta_secondary}</a>
            <a href="#tocn" className="btn btn-primary-red">{hero.cta_tertiary}</a>
          </div>
          <ul className="trust-badges">
            {hero.trust_badges.map(badge => (
              <li key={badge}><span className="check-icon"><CheckIcon /></span>{badge}</li>
            ))}
          </ul>
        </div>
        <div className="hero-illustration">
          {/* WebP first (127 kB), PNG only for browsers that cannot decode it
              (2.3 MB, so effectively never fetched). The illustration has a real
              alpha channel, which rules out a JPEG fallback. No AVIF source: the
              available ffmpeg build silently drops alpha when writing AVIF — see
              SEO_TASKS_REPORT.md for the avifenc command to add one correctly. */}
          <picture>
            <source srcSet="/images/maintenance.webp" type="image/webp" />
            <img
              src="/images/maintenance.png"
              alt="Mekaniker utfører service på en elbil hos Elbilexpressen i Oslo"
              width={1536}
              height={1024}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </section>
  )
}
