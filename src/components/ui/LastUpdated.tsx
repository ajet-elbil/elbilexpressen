// Visible "Sist oppdatert" line for inner pages.
//
// Mirrors `dateModified` in the WebPage schema — both read LAST_UPDATED from
// seo.config, so the machine-readable date and the one a reader sees can never
// disagree. A freshness date is worth showing on pages that quote prices: it
// tells both a customer and an AI engine how current the figures are.
//
// Reuses the existing `.landing-note` utility class; no new CSS.

import { LAST_UPDATED, formatNorwegianDate } from '../../seo.config';

export function LastUpdated() {
  return (
    <p className="landing-note">
      Sist oppdatert: <time dateTime={LAST_UPDATED}>{formatNorwegianDate(LAST_UPDATED)}</time>
    </p>
  );
}
