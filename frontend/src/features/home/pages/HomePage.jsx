import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { BrandSection } from '../components/BrandSection';
import { CatalogPreviewSection } from '../components/CatalogPreviewSection';
import { LandingHero } from '../components/LandingHero';

export function HomePage() {
  usePageTitle('Butacas y sillones con estilo');

  return (
    <div className="landing-page">
      <SectionContainer className="landing-shell">
        <PageContainer>
          <LandingHero />
          <CatalogPreviewSection />
          <BrandSection />

          <section aria-labelledby="contact-cta-title" className="landing-contact-card">
            <div>
              <span className="landing-contact-card__eyebrow">Asesoramiento personal</span>
              <h2 id="contact-cta-title">¿Dudas con la medida, el color o el acabado?</h2>
              <p>Cuéntanos cómo es tu espacio y te ayudamos a encontrar la pieza que encaja con él.</p>
            </div>
            <Button size="lg" to="/contacto">
              Hablar con ButaKeando
            </Button>
          </section>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
