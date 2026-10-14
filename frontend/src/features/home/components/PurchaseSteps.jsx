import { purchaseSteps } from '../homeData';

export function PurchaseSteps() {
  return (
    <section aria-labelledby="steps-title" className="steps">
      <header className="section-head">
        <span className="section-head__index mono">III.</span>
        <h2 id="steps-title">Comprar es fácil</h2>
      </header>

      <ol className="steps__list">
        {purchaseSteps.map((step, index) => (
          <li key={step.title} className="steps__item">
            <span aria-hidden="true" className="steps__number">
              {index + 1}
            </span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
