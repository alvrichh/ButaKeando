import { PageContainer } from '../../../components/layout/PageContainer';
import { manifesto } from '../homeData';

export function ManifestoSection() {
  return (
    <section aria-labelledby="manifesto-title" className="manifesto">
      <PageContainer>
        <span className="section-head__index mono">II.</span>
        <h2 className="manifesto__title" id="manifesto-title">
          No vendemos muebles para mirarlos. Vendemos <em>el rato</em> que pasas en ellos.
        </h2>

        <ol className="manifesto__list">
          {manifesto.principles.map((item, index) => (
            <li key={item.title} className="manifesto__item">
              <span className="manifesto__number mono">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </PageContainer>
    </section>
  );
}
