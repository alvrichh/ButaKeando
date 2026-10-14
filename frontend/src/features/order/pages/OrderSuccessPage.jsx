import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Icon } from '../../../components/common/Icon';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { readStorage } from '../../../lib/storage';
import { OrderSummary } from '../../cart/components/OrderSummary';
import { useCart } from '../../cart/CartProvider';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [lastOrder] = useState(() => readStorage('butakeando:last-order'));
  const { clearCart } = useCart();

  usePageTitle('Pedido confirmado');

  useEffect(() => {
    if (reference) {
      clearCart();
    }
  }, [clearCart, reference]);

  if (!reference) {
    return (
      <EmptyState
        action={{ to: '/catalogo', label: 'Ir al catálogo' }}
        body="No encontramos ningún pedido reciente asociado a esta página."
        title="Sin pedido que mostrar"
      />
    );
  }

  // Only show the stored summary when it belongs to this same order.
  const matchingOrder = lastOrder?.reference === reference ? lastOrder : null;

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="success-layout">
            <Card className="success-card success-card--primary">
              <span className="success-card__icon">
                <Icon name="check" size={28} />
              </span>
              <span className="shop-summary-card__eyebrow">Pedido recibido</span>
              <h1>¡Gracias por tu compra{matchingOrder?.customer?.full_name ? `, ${matchingOrder.customer.full_name.split(' ')[0]}` : ''}!</h1>
              <p>
                Hemos recibido tu pedido con la referencia <strong className="success-card__reference">{reference}</strong>.
                Nos pondremos en contacto contigo para coordinar la entrega.
              </p>
              <div className="success-card__actions">
                <Button to="/catalogo">Seguir viendo productos</Button>
                <Button to="/contacto" tone="ghost">
                  Contactar
                </Button>
              </div>
            </Card>

            {matchingOrder?.items?.length ? (
              <OrderSummary eyebrow="Tu pedido" items={matchingOrder.items} total={matchingOrder.total} />
            ) : null}
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
