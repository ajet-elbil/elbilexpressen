// Maintenance-intervals table summarising recommended service frequencies.

import { serviceIntervals } from '../../data/content';

export function ServiceIntervals() {
  return (
    <section className="intervals-section" id="intervaller">
      <div className="intervals-container">
        <div className="intervals-header reveal">
          <span className="section-label">Vedlikehold</span>
          <h2>{serviceIntervals.title}</h2>
          <p>{serviceIntervals.description}</p>
        </div>
        <div className="intervals-table-wrap reveal">
          <table className="intervals-table">
            <thead>
              <tr>
                <th>Tjeneste</th>
                <th>Intervall</th>
                <th>Merknad</th>
              </tr>
            </thead>
            <tbody>
              {serviceIntervals.items.map(it => (
                <tr key={it.service}>
                  <td>{it.service}</td>
                  <td>{it.interval}</td>
                  <td>{it.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
