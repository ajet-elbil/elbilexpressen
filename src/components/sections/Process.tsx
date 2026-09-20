// "How we work": the six steps from booking to the car being handed back.

import { workflow } from '../../data/content';

export function Process() {
  return (
    <section className="content-section alt" id="slik-jobber-vi">
      <div className="content-container">
        <div className="content-header reveal">
          <span className="section-label">{workflow.label}</span>
          <h2>{workflow.title}</h2>
          <p>{workflow.description}</p>
        </div>
        <ol className="content-grid steps-grid process-steps">
          {workflow.steps.map((step, i) => (
            <li className="content-card step-card reveal" key={step.title} style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className="step-number">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
