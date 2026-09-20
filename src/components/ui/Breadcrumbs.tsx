// Breadcrumb trail for inner pages.
//
// Mirrors the BreadcrumbList JSON-LD emitted for the same page, and gives every
// inner page a crawlable link back to the homepage — internal links are how
// both Google and AI crawlers discover the rest of the site.

import { Link } from '../../router';
import type { Breadcrumb } from '../../seo/meta';

export function Breadcrumbs({ trail }: { trail: Breadcrumb[] }) {
  if (trail.length === 0) return null;
  return (
    <nav className="breadcrumbs" aria-label="Brødsmuler">
      <ol>
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.path}>
              {isLast ? (
                <span aria-current="page">{crumb.name}</span>
              ) : (
                <Link href={crumb.path}>{crumb.name}</Link>
              )}
              {!isLast && <span className="breadcrumb-sep" aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
