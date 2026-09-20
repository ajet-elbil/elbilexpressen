// Car brands we service: four highlighted makes plus the full list of other EV/hybrid brands.

import { brands } from '../../data/content';

export function Brands() {
  return (
    <section className="content-section alt" id="merker">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="section-label">{brands.label}</span>
          <h2>{brands.title}</h2>
          <p>{brands.description}</p>
        </div>
        <div className="content-grid">
          {brands.featured.map((brand, i) => (
            <div className="content-card brand-card reveal" key={brand.name} style={{ transitionDelay: `${i * 0.08}s` }}>
              <h3>{brand.name}</h3>
              <p>{brand.models}</p>
            </div>
          ))}
        </div>
        <div className="brand-others reveal">
          <h3>{brands.othersTitle}</h3>
          <ul className="chip-list">
            {brands.others.map(name => (
              <li className="chip" key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
