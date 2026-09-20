// Stats strip showing key selling-point numbers from the about data.

import { about } from '../../data/content';

export function Stats() {
  return (
    <section className="stats-section">
      <div className="stats-container">
        {about.stats.map((s, i) => (
          <div key={s.label} className="stat-item reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
            <span className="stat-number">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
