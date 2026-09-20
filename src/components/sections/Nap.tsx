// NAP (Name, Address, Phone), opening hours and map.
//
// Local search ranks on consistency: the address and phone number here are read
// from seo.config, which is the same source the JSON-LD schema uses, so the
// visible text and the structured data can never disagree. Semantic <address>
// and <time> elements let an LLM identify what each value is without guessing.

import {
  BUSINESS,
  CLOSED_DAYS,
  FULL_ADDRESS,
  MAILTO_HREF,
  MAPS_EMBED_URL,
  MAPS_URL,
  OPENING_HOURS,
  TEL_HREF,
} from '../../seo.config';

export function NapCard({ title }: { title: string }) {
  return (
    <div className="nap-card">
      <h2>{title}</h2>
      <address className="nap-address">
        <strong>{BUSINESS.name}</strong>
        <span>{BUSINESS.streetAddress}</span>
        <span>
          {BUSINESS.postalCode} {BUSINESS.addressLocality}
        </span>
        <span>Norge</span>
        <a href={TEL_HREF}>{BUSINESS.phone}</a>
        <a href={MAILTO_HREF}>{BUSINESS.email}</a>
      </address>
      <div className="nap-actions">
        <a href={TEL_HREF} className="btn btn-primary">Ring {BUSINESS.phone}</a>
        <a
          href={MAPS_URL}
          className="btn btn-outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Veibeskrivelse
        </a>
      </div>
    </div>
  );
}

export function OpeningHours({ title }: { title: string }) {
  return (
    <div className="hours-card">
      <h2>{title}</h2>
      <table className="hours-table">
        <tbody>
          {OPENING_HOURS.map(row => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>
                <time dateTime={row.opens}>{row.opens}</time>
                {'–'}
                <time dateTime={row.closes}>{row.closes}</time>
              </td>
            </tr>
          ))}
          {CLOSED_DAYS.map(row => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>Stengt</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hours-note">
        Timebestilling på nett er åpen hele døgnet.
      </p>
    </div>
  );
}

/**
 * Lazily loaded Google Maps embed. `loading="lazy"` keeps the third-party frame
 * off the critical path so it cannot hurt LCP, and the surrounding fixed aspect
 * ratio prevents layout shift while it loads.
 */
export function MapEmbed() {
  return (
    <div className="map-embed">
      <iframe
        src={MAPS_EMBED_URL}
        title={`Kart som viser Elbilexpressen i ${FULL_ADDRESS}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
