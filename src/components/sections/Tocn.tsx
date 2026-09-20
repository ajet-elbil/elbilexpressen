// TOCN partner section: badge, intro, member benefits, per-model price tables and CTA.

import { tocn } from '../../data/content';
import type { BookingTrigger } from '../../types';

export function Tocn({ onOpenBooking }: BookingTrigger) {
  return (
    <section className="tocn-section" id="tocn">
      <div className="tocn-container">
        <div className="tocn-header reveal">
          <span className="tocn-badge">{tocn.badge}</span>
          <h2>{tocn.title}</h2>
          <p className="tocn-subtitle">{tocn.subtitle}</p>
          <p className="tocn-desc">{tocn.description}</p>
        </div>

        <div className="tocn-benefits">
          {tocn.benefits.map(b => (
            <div className={`tocn-benefit reveal${b.highlight ? ' highlight' : ''}`} key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.description}</p>
            </div>
          ))}
        </div>

        <div className="tocn-pricelists">
          {tocn.pricelist.map(pl => (
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

        <div className="tocn-cta-wrap">
          <button onClick={onOpenBooking} className="btn btn-primary">{tocn.cta}</button>
        </div>
      </div>
    </section>
  )
}
