import { Button } from '../../../components/common/Button';
import { Icon } from '../../../components/common/Icon';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { usePageTitle } from '../../../hooks/usePageTitle';

export function ContactPage() {
  usePageTitle('Contacto');

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="store-heading">
            <span className="store-heading__eyebrow">Contacto</span>
            <h1>Hablemos de la butaca que buscas.</h1>
            <p>Te orientamos sobre modelos, medidas, colores y plazos de entrega. Respondemos personalmente.</p>
          </div>

          <div className="contact-grid">
            <Card className="contact-card">
              <span className="contact-card__icon">
                <Icon name="mail" size={22} />
              </span>
              <span className="shop-summary-card__eyebrow">Correo</span>
              <h2>hola@butakeando.es</h2>
              <p>Escríbenos para pedir información, disponibilidad o una recomendación según tu espacio.</p>
              <Button href="mailto:hola@butakeando.es">Enviar email</Button>
            </Card>

            <Card className="contact-card">
              <span className="contact-card__icon">
                <Icon name="truck" size={22} />
              </span>
              <span className="shop-summary-card__eyebrow">Desde Sevilla</span>
              <h2>Envíos a toda España</h2>
              <p>Coordinamos contigo la entrega de cada pedido para que llegue en el momento que mejor te venga.</p>
              <Button to="/catalogo" tone="secondary">
                Ver catálogo
              </Button>
            </Card>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
