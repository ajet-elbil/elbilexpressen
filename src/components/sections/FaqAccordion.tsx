// Reusable FAQ accordion.
//
// Every answer is rendered into the DOM and only visually collapsed. The
// previous implementation mounted the open answer alone, which meant a crawler
// — or an LLM reading the raw HTML — saw exactly one answer and missed the
// rest. FAQ answers are the most quotable content on the site, so they have to
// be present in the served markup even while collapsed. Google treats content
// hidden behind an accordion as normal indexable content.
//
// The rendered text is identical to the FAQPage JSON-LD for the same page,
// which is a structured-data requirement as well as an honesty one.

import { useId, useState } from 'react';
import type { FaqItem } from '../../types';

interface FaqAccordionProps {
  items: FaqItem[];
  /** Rendered as the section heading; omitted when the page supplies its own. */
  title?: string;
  label?: string;
  id?: string;
  className?: string;
}

export function FaqAccordion({
  items,
  title,
  label,
  id = 'faq',
  className = 'faq-section',
}: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  if (items.length === 0) return null;

  return (
    <section className={className} id={id}>
      <div className="faq-container">
        {(title || label) && (
          <div className="faq-header reveal">
            {label && <span className="section-label">{label}</span>}
            {title && <h2>{title}</h2>}
          </div>
        )}
        <div className="faq-list">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <article className={`faq-item${isOpen ? ' open' : ''}`} key={item.question}>
                <h3 className="faq-question-heading">
                  <button
                    type="button"
                    id={buttonId}
                    className="faq-question"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span>{item.question}</span>
                    <span className="faq-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                </h3>
                {/* Always in the DOM; `.faq-answer-panel` collapses it visually. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`faq-answer-panel${isOpen ? ' open' : ''}`}
                >
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
