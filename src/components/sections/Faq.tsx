// Homepage FAQ. Content and accordion behaviour live in FaqAccordion, which is
// shared with every landing page so the markup and schema stay identical.

import { faq } from '../../data/content';
import { FaqAccordion } from './FaqAccordion';

export function Faq() {
  return <FaqAccordion items={faq} label="FAQ" title="Ofte stilte spørsmål" id="faq" />;
}
