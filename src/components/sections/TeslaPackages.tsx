// Tesla service packages: what the small and large service include, plus fixed prices.

import { teslaPackages } from '../../data/content';
import { CheckIcon } from '../ui/Icons';
import type { BookingTrigger } from '../../types';

export function TeslaPackages({ onOpenBooking }: BookingTrigger) {
  return (
    <section className="content-section" id="servicepakker">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="content-badge">{teslaPackages.badge}</span>
          <h2>{teslaPackages.title}</h2>
          <p className="content-subtitle">{teslaPackages.subtitle}</p>
          <p>{teslaPackages.description}</p>
          <button onClick={onOpenBooking} className="btn btn-primary content-cta">{teslaPackages.cta}</button>
        </div>

        <div className="package-grid">
          {teslaPackages.packages.map((pkg, i) => (
            <article className="content-card package-card reveal" key={pkg.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <h3>{pkg.title}</h3>
              <p>{pkg.description}</p>
              <ul className="package-includes">
                {pkg.includes.map(item => (
                  <li key={item}><span className="check-icon"><CheckIcon /></span>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="tocn-pricelists">
          {teslaPackages.pricelist.map(pl => (
            <div className="tocn-pricelist reveal" key={pl.model}>
              <h3>{pl.model}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tjeneste</th>
                    <th>Ordinær</th>
                    <th>TOCN</th>
                  </tr>
                </thead>
                <tbody>
                  {pl.services.map(sv => (
                    <tr key={sv.name}>
                      <td>{sv.name}</td>
                      <td>{sv.standard}</td>
                      <td className="tocn-cell">{sv.tocn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <p className="price-note reveal">{teslaPackages.priceNote}</p>
      </div>
    </section>
  )
}
