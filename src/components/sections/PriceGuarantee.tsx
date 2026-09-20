// Price-guarantee section: promise, the three steps and the terms that apply.

import { meta, priceGuarantee } from '../../data/content';
import { CheckIcon } from '../ui/Icons';

export function PriceGuarantee() {
  const mailto = `mailto:${meta.email}?subject=${encodeURIComponent('Prisgaranti – tilbud fra annet verksted')}`;
  return (
    <section className="content-section alt" id="prisgaranti">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="content-badge">{priceGuarantee.badge}</span>
          <h2>{priceGuarantee.title}</h2>
          <p className="content-subtitle">{priceGuarantee.subtitle}</p>
          <p>{priceGuarantee.description}</p>
          <a href={mailto} className="btn btn-primary content-cta">{priceGuarantee.cta}</a>
        </div>

        <h3 className="content-grid-title reveal">{priceGuarantee.stepsTitle}</h3>
        <div className="content-grid steps-grid">
          {priceGuarantee.steps.map((step, i) => (
            <div className="content-card step-card reveal" key={step.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="step-number">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className="terms-box reveal">
          <h3>{priceGuarantee.termsTitle}</h3>
          <ul className="terms-list">
            {priceGuarantee.terms.map(term => (
              <li key={term}><span className="check-icon"><CheckIcon /></span>{term}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
