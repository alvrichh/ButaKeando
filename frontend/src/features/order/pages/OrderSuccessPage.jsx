import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { readStorage } from '../../../lib/storage';
import { formatCurrency } from '../../../utils/currency';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') ?? 'BTK-REF-PENDIENTE';
  const lastOrder = readStorage('butakeando:last-order');

  useEffect(() => {
    document.title = 'ButaKeando | Pedido confirmado';
  }, []);

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="success-layout">
            <Card className="success-card success-card--primary">
              <span className="shop-summary-card__eyebrow">Pedido recibido</span>
              <h1>Referencia {reference}</h1>
              <p>
                El recorrido visual de compra se ha completado. El siguiente paso real sera conectar este flujo con
                backend, pago y notificaciones.
              </p>
              <div className="success-card__actions">
                <Button to="/catalogo">Seguir viendo productos</Button>
                <Button to="/contacto" tone="secondary">
                  Hablar con nosotros
                </Button>
              </div>
            </Card>

            <Card className="success-card">
              <span className="shop-summary-card__eyebrow">Resumen guardado</span>
              <h2>{lastOrder?.customer?.name || 'Cliente ButaKeando'}</h2>
              <div className="summary-list--store">
                {(lastOrder?.items || []).map((item) => (
                  <div key={item.id} className="summary-list__row">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="shop-summary-card__total">
                <span>Total</span>
                <strong>{formatCurrency(lastOrder?.total || 0)}</strong>
              </div>
            </Card>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
