// Adds a `revealed` class to `.reveal` elements as they scroll into view.
//
// The `reveal` opacity rule is scoped to `html.js` in utilities.css, and that
// class is set here rather than in CSS. If JavaScript never runs — which is the
// case for GPTBot, PerplexityBot, ClaudeBot and CCBot — the class is absent and
// every section renders fully visible in the static HTML.

import { useEffect } from 'react';

/** `key` re-runs the observer after a route change mounts new sections. */
export function useScrollReveal(key?: string) {
  useEffect(() => {
    document.documentElement.classList.add('js');

    const elements = document.querySelectorAll('.reveal');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
}
