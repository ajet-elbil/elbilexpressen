// Minimal history router.
//
// The site has a handful of static routes and no dynamic segments, so a router
// library would add a dependency and client-side JavaScript without buying
// anything. Every route is prerendered to its own index.html, which means a
// direct hit or a crawler request is served real HTML with a 200 status; this
// router only takes over for in-page navigation after hydration.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react';
import { normalizePath } from './seo/meta';

interface RouterValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} });

export function useRouter(): RouterValue {
  return useContext(RouterContext);
}

/** Scrolls to an element by id, or to the top when no id is given. */
function scrollToTarget(hash: string) {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  const el = document.getElementById(hash.replace(/^#/, ''));
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  else window.scrollTo({ top: 0, behavior: 'auto' });
}

export function Router({ initialPath, children }: { initialPath: string; children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(initialPath));
  // Hash of a pending cross-page navigation, applied once the new page renders.
  // A ref rather than state: consuming it must not trigger another render.
  const pendingHash = useRef('');

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!pendingHash.current) return;
    scrollToTarget(pendingHash.current);
    pendingHash.current = '';
  }, [path]);

  const navigate = useCallback((to: string) => {
    const [pathPart, hashPart = ''] = to.split('#');
    const target = normalizePath(pathPart || window.location.pathname);
    const hash = hashPart ? `#${hashPart}` : '';
    const current = normalizePath(window.location.pathname);

    if (target === current) {
      if (hash) {
        window.history.replaceState({}, '', `${window.location.pathname}${hash}`);
        scrollToTarget(hash);
      }
      return;
    }

    // Trailing slash keeps the URL identical to the canonical tag and to the
    // prerendered directory, so a later reload hits the same static file.
    const url = target === '/' ? `/${hash}` : `${target}/${hash}`;
    window.history.pushState({}, '', url);
    pendingHash.current = hash;
    setPath(target);
    if (!hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Rewrites an internal page path to its canonical form, with a trailing slash:
 * '/tesla-service-oslo#faq' becomes '/tesla-service-oslo/#faq'. The canonical
 * tags, the sitemap and `html_handling = "force-trailing-slash"` in
 * wrangler.toml all use the slash form, so a link without it costs every
 * crawler and every new-tab click a redirect before the page loads.
 * Anything that is not an absolute site path (or that names a file) is left alone.
 */
function canonicalHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const [, path, rest] = href.match(/^([^?#]*)(.*)$/)!;
  const lastSegment = path.slice(path.lastIndexOf('/') + 1);
  if (path.endsWith('/') || lastSegment.includes('.')) return href;
  return `${path}/${rest}`;
}

/**
 * Anchor that navigates in-page for internal links. It always renders a real
 * href so crawlers can follow it and so middle-click and "open in new tab"
 * behave normally.
 */
export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);
  // A bare '#anchor' is a same-page jump; let the browser handle it.
  const isSamePageHash = href.startsWith('#');

  return (
    <a
      href={canonicalHref(href)}
      {...rest}
      onClick={event => {
        onClick?.(event);
        if (isExternal || isSamePageHash) return;
        // Respect modifier clicks and non-primary buttons.
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.button !== 0) return;
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
