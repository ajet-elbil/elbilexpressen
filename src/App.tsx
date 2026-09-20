// Root component: routing, per-page <head> metadata and the shared booking modal.

import { useMemo, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BookingModal } from './components/booking/BookingModal';
import { Home } from './pages/Home';
import { LandingPage } from './pages/LandingPage';
import { LocationPage } from './pages/LocationPage';
import { AboutPage } from './pages/AboutPage';
import { NotFound } from './pages/NotFound';
import { Router, useRouter } from './router';
import { Seo } from './seo/Seo';
import { getPageMeta } from './seo/meta';
import { useScrollReveal } from './hooks/useScrollReveal';
import { aboutPage, hero, locationPage, seoPages } from './data/content';

function Page() {
  const { path } = useRouter();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const meta = useMemo(() => getPageMeta(path), [path]);

  // Re-runs on every route change so newly mounted sections animate in too.
  useScrollReveal(path);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  const landing = seoPages.find(page => `/${page.slug}` === path);

  let content;
  if (path === '/') {
    content = <Home onOpenBooking={openBooking} />;
  } else if (path === `/${locationPage.slug}`) {
    content = <LocationPage breadcrumbs={meta.breadcrumbs} onOpenBooking={openBooking} />;
  } else if (path === `/${aboutPage.slug}`) {
    content = <AboutPage breadcrumbs={meta.breadcrumbs} onOpenBooking={openBooking} />;
  } else if (landing) {
    content = (
      <LandingPage page={landing} breadcrumbs={meta.breadcrumbs} onOpenBooking={openBooking} />
    );
  } else {
    content = <NotFound />;
  }

  return (
    <>
      <Seo meta={meta} />
      <a href="#hovedinnhold" className="skip-link">Hopp til hovedinnhold</a>
      <Navbar onOpenBooking={openBooking} />
      <main id="hovedinnhold">{content}</main>
      <Footer onOpenBooking={openBooking} />
      <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
      {!isBookingOpen && (
        <div className="mobile-sticky-cta">
          <button onClick={openBooking} className="btn btn-primary">{hero.cta_primary}</button>
        </div>
      )}
    </>
  );
}

/** `path` is supplied by the prerenderer; the browser falls back to location. */
function App({ path }: { path?: string }) {
  const initialPath =
    path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  return (
    <Router initialPath={initialPath}>
      <Page />
    </Router>
  );
}

export default App;
