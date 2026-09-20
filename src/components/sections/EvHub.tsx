// EV Hub partnership: the technical collaboration behind our advanced repairs.

import { evHub } from '../../data/content';

export function EvHub() {
  return (
    <section className="content-section alt" id="ev-hub">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="content-badge">{evHub.badge}</span>
          <h2>{evHub.title}</h2>
          <p className="content-subtitle">{evHub.subtitle}</p>
          <p>{evHub.description}</p>
          <a href="#tjenester" className="btn btn-primary content-cta">{evHub.cta}</a>
        </div>
        <h3 className="content-grid-title reveal">{evHub.benefitsTitle}</h3>
        <div className="content-grid">
          {evHub.benefits.map((benefit, i) => (
            <div className="content-card reveal" key={benefit.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
