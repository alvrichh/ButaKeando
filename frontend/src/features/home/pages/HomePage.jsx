import { useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { BrandSection } from '../components/BrandSection';
import { CatalogPreviewSection } from '../components/CatalogPreviewSection';
import { LandingHero } from '../components/LandingHero';

export function HomePage() {
  useEffect(() => {
    document.title = 'ButaKeando | Butacas y sillones con estilo';
  }, []);

  return (
    <div className="landing-page">
      <SectionContainer className="landing-shell">
        <PageContainer>
          <LandingHero />
          <BrandSection />
          <CatalogPreviewSection />

          <section className="landing-contact-card">
            <div>
              <span className="landing-contact-card__eyebrow">Tienda en crecimiento</span>
              <h2>La web ya no es solo una landing: ahora tiene catalogo, detalle, carrito y checkout visual.</h2>
              <p>
                Es una base de frontend pensada para crecer con colecciones, fichas mas completas, pagos reales y una
                futura adaptacion a Shopify si hiciera falta.
              </p>
            </div>
            <Button to="/contacto">Hablar con ButaKeando</Button>
          </section>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
