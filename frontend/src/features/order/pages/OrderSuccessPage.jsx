import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { readStorage } from '../../../lib/storage';
import { formatCurrency } from '../../../utils/currency';
import { useCart } from '../../cart/CartProvider';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') ?? 'BTK-REF-PENDIENTE';
  const sessionId = searchParams.get('session_id');
  const lastOrder = readStorage('butakeando:last-order');
  const { clearCart } = useCart();

  useEffect(() => {
    document.title = 'ButaKeando | Pedido confirmado';

    if (reference || sessionId) {
      clearCart();
    }
  }, [clearCart, reference, sessionId]);

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="success-layout">
            <Card className="success-card success-card--primary">
              <span className="shop-summary-card__eyebrow">Pago recibido</span>
              <h1>Referencia {reference}</h1>
              <p>
                Stripe ha devuelto al cliente correctamente. El backend termina confirmacion final, guardado y email
                mediante webhook seguro.
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
              <h2>{lastOrder?.customer?.full_name || lastOrder?.customer?.name || 'Cliente ButaKeando'}</h2>
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
