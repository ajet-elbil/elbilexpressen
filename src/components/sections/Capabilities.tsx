// Workshop capability section: equipment, approvals and the four main disciplines.

import { capabilities } from '../../data/content';

export function Capabilities() {
  return (
    <section className="content-section" id="kompetanse">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="content-badge">{capabilities.badge}</span>
          <h2>{capabilities.title}</h2>
          <p className="content-subtitle">{capabilities.subtitle}</p>
          <p>{capabilities.description}</p>
        </div>
        <h3 className="content-grid-title reveal">{capabilities.areasTitle}</h3>
        <div className="content-grid">
          {capabilities.areas.map((area, i) => (
            <div className="content-card reveal" key={area.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
