import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { EmptyState } from '../../../components/ui/EmptyState';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { readStorage } from '../../../lib/storage';
import { OrderSummary } from '../../cart/components/OrderSummary';
import { useCart } from '../../cart/CartProvider';
import { Stamp } from '../../home/components/Stamp';

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
        label="Sin referencia"
        title="Aquí no hay ningún pedido"
      />
    );
  }

  // Only show the stored summary when it belongs to this same order.
  const matchingOrder = lastOrder?.reference === reference ? lastOrder : null;
  const firstName = matchingOrder?.customer?.full_name?.split(' ')[0];

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="success-layout">
            <div className="success">
              <Stamp className="success__stamp" />
              <span className="success__label mono">Pedido recibido · {reference}</span>
              <h1>
                Gracias{firstName ? `, ${firstName}` : ''}. <em>Ya puedes ir haciendo hueco.</em>
              </h1>
              <p>
                Hemos recibido tu pedido. En breve te escribiremos para coordinar contigo la entrega. Guarda la referencia{' '}
                <strong className="mono">{reference}</strong> por si necesitas consultarnos algo.
              </p>
              <div className="success__actions">
                <Button to="/catalogo">Seguir mirando</Button>
                <Button to="/contacto" tone="secondary">
                  Contactar
                </Button>
              </div>
            </div>

            {matchingOrder?.items?.length ? (
              <OrderSummary items={matchingOrder.items} title="Tu pedido" total={matchingOrder.total} />
            ) : null}
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
