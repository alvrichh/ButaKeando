import { PageContainer } from '../../../components/layout/PageContainer';
import { appConfig } from '../../../lib/config';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { CatalogPreviewSection } from '../components/CatalogPreviewSection';
import { LandingHero } from '../components/LandingHero';
import { ManifestoSection } from '../components/ManifestoSection';
import { Marquee } from '../components/Marquee';
import { PurchaseSteps } from '../components/PurchaseSteps';

export function HomePage() {
  usePageTitle('Butacas y sillones con carácter');

  return (
    <div className="home">
      <PageContainer>
        <LandingHero />
      </PageContainer>

      <Marquee />

      <PageContainer>
        <CatalogPreviewSection />
      </PageContainer>

      <ManifestoSection />

      <PageContainer>
        <PurchaseSteps />

        <section aria-labelledby="letter-title" className="letter">
          <span className="letter__label mono">Asesoramiento personal</span>
          <h2 id="letter-title">
            ¿Dudas con la medida, el color o el sitio? <em>Escríbenos.</em>
          </h2>
          <p>Cuéntanos cómo es tu salón y te decimos con sinceridad qué butaca le va. Sin compromiso.</p>
          <a className="letter__mail" href={`mailto:${appConfig.supportEmail}`}>
            {appConfig.supportEmail} <span aria-hidden="true">→</span>
          </a>
        </section>
      </PageContainer>
    </div>
  );
}
