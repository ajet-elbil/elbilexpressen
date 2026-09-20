// About section: company intro, looping services video and the values grid.

import { about } from '../../data/content';
import { CheckIcon } from '../ui/Icons';

export function About() {
  return (
    <section className="about-section" id="om-oss">
      <div className="about-container">
        <div className="about-content reveal">
          <span className="section-label">Om oss</span>
          <h2>{about.title}</h2>
          <p>{about.description}</p>
        </div>
        <div className="about-video">
          {/* 480x854 portrait — the real dimensions of the file. These were
              1280x720 before, which reserved a landscape box for a portrait
              video and caused the layout shift the attributes exist to prevent. */}
          <video
            src="/images/services.mp4"
            width={480}
            height={854}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="Video fra verkstedet til Elbilexpressen i Oslo"
          />
        </div>
      </div>
      <div className="about-values-container">
        <div className="about-values">
          {about.values.map((v, i) => (
            <div className="value-card reveal" key={v.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="value-check"><CheckIcon /></span>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
