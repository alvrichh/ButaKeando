import { useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'ButaKeando | Pagina no encontrada';
  }, []);

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer>
          <Card className="shop-empty">
            <h1>Pagina no encontrada</h1>
            <p>La ruta que buscas no existe dentro de la version actual de la tienda.</p>
            <Button to="/">Volver al inicio</Button>
          </Card>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
