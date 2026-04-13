import { useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';

export function ContactPage() {
  useEffect(() => {
    document.title = 'ButaKeando | Contacto';
  }, []);

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="store-heading">
            <span className="store-heading__eyebrow">Contacto</span>
            <h1>Hablemos de la butaca o el sillon que quieres mostrar o vender.</h1>
            <p>Una pagina simple para presentar marca y abrir conversacion comercial sin sobrecargar la experiencia.</p>
          </div>

          <div className="contact-grid">
            <Card className="contact-card">
              <span className="shop-summary-card__eyebrow">Correo</span>
              <h2>hola@butakeando.es</h2>
              <p>Escribenos para pedir informacion, disponibilidad o una propuesta de catalogo mas completa.</p>
              <Button href="mailto:hola@butakeando.es">Enviar email</Button>
            </Card>

            <Card className="contact-card">
              <span className="shop-summary-card__eyebrow">Marca</span>
              <h2>Sevilla, Espana</h2>
              <p>ButaKeando busca una presencia elegante, limpia y preparada para futuro crecimiento ecommerce.</p>
              <Button to="/catalogo" tone="secondary">
                Ver catalogo
              </Button>
            </Card>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
