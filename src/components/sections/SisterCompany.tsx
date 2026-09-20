// "Part of the Oljeskiftexpressen family" cross-promotion band.

export function SisterCompany() {
  return (
    <section className="sister-section">
      <div className="sister-container">
        <img
          src="/images/oljeskiftexpressen-logo.png"
          alt="Logoen til Oljeskiftexpressen, søsterselskapet til Elbilexpressen"
          className="sister-logo"
          width={364}
          height={128}
          loading="lazy"
          decoding="async"
        />
        <div className="sister-divider" />
        <div className="sister-content">
          <span className="section-label">Søsterselskap</span>
          <h3>En del av Oljeskiftexpressen-familien</h3>
          <p>Elbilexpressen er søsterselskapet til Oljeskiftexpressen – Oslos ledende verksted for bensin- og dieselbiler. Samme team, samme kvalitetsnivå, nå spesialisert for elbil.</p>
        </div>
      </div>
    </section>
  )
}
