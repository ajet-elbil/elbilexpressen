// Server entry used only at build time by scripts/prerender.mjs.
//
// It renders the app to an HTML string for a given route and returns the <head>
// markup for the same route. Nothing here ships to the browser.

import { renderToString } from 'react-dom/server';
import App from './App';
import { allPageMeta, getPageMeta, notFoundMeta } from './seo/meta';
import { renderHead } from './seo/renderHead';

export interface RenderResult {
  html: string;
  head: string;
  title: string;
}

export function render(path: string): RenderResult {
  const meta = path === '/404' ? notFoundMeta() : getPageMeta(path);
  return {
    html: renderToString(<App path={path} />),
    head: renderHead(meta),
    title: meta.title,
  };
}

/** Route list the prerenderer iterates over. */
export function routes(): string[] {
  return allPageMeta().map(meta => meta.path);
}

export { allPageMeta };
export { SITE_URL, SAME_AS, PLACEHOLDER_SAME_AS } from './seo.config';
