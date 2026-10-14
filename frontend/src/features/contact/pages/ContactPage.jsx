import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeading } from '../../../components/layout/PageHeading';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { appConfig } from '../../../lib/config';
import { usePageTitle } from '../../../hooks/usePageTitle';

export function ContactPage() {
  usePageTitle('Contacto');

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <PageHeading
            label="Contacto"
            lead="Te orientamos sobre modelos, medidas, colores y plazos. Te responde una persona, no un formulario automático."
            title={
              <>
                Hablemos de <em>tu</em> butaca.
              </>
            }
          />

          <div className="contact-grid">
            <div className="contact-block">
              <span className="contact-block__label mono">Por correo</span>
              <a className="contact-block__big" href={`mailto:${appConfig.supportEmail}`}>
                {appConfig.supportEmail}
              </a>
              <p>Cuéntanos qué modelo te interesa, cómo es tu espacio o qué dudas tienes. Si puedes, añade una foto del rincón.</p>
              <Button href={`mailto:${appConfig.supportEmail}`}>Escribir un email</Button>
            </div>

            <div className="contact-block">
              <span className="contact-block__label mono">Desde Sevilla</span>
              <p className="contact-block__big">Envíos a toda España</p>
              <p>Cuando haces un pedido, te escribimos para coordinar contigo la entrega y que llegue cuando mejor te venga.</p>
              <Button to="/catalogo" tone="secondary">
                Ver el catálogo
              </Button>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
