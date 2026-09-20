// Sticky top navigation with anchor links, brand logo and the primary booking CTA.
//
// Links are absolute ('/#tjenester' rather than '#tjenester') so they work from
// every page, not only the homepage, and so crawlers on a landing page find a
// real path back to the section rather than a fragment that resolves to itself.

import { useState } from 'react';
import { hero } from '../../data/content';
import { CloseIcon, MenuIcon } from '../ui/Icons';
import { Logo } from '../ui/Logo';
import { Link } from '../../router';
import type { BookingTrigger } from '../../types';

const NAV_LINKS = [
  { href: '/#tjenester', label: 'Tjenester' },
  { href: '/#dekk', label: 'Dekk' },
  { href: '/#prisgaranti', label: 'Prisgaranti' },
  { href: '/#tocn', label: 'TOCN' },
  { href: '/elbil-service-oslo', label: 'Oslo' },
  { href: '/om-oss', label: 'Om oss' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/elbil-service-oslo#kontakt', label: 'Kontakt' },
];

export function Navbar({ onOpenBooking }: BookingTrigger) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo" aria-label="Elbilexpressen – til forsiden">
          <Logo />
        </Link>
        <nav className="nav" aria-label="Hovedmeny">
          <ul className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button onClick={onOpenBooking} className="btn btn-primary nav-booking-btn">{hero.cta_primary}</button>
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>
      </div>
    </header>
  )
}
