import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { QuantitySelector } from '../../../components/common/QuantitySelector';
import { useToast } from '../../../components/feedback/ToastProvider';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ProductMedia } from '../../../components/ui/ProductMedia';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { MAX_ITEM_QUANTITY, useCart } from '../CartProvider';
import { formatCurrency } from '../../../utils/currency';
import { OrderSummary } from '../components/OrderSummary';

export function CartPage() {
  const { items, cartTotal, removeItem, updateQuantity } = useCart();
  const { showToast } = useToast();

  usePageTitle('Carrito');

  if (!items.length) {
    return (
      <EmptyState
        action={{ to: '/catalogo', label: 'Ir al catálogo' }}
        body="Explora el catálogo y añade tus butacas o sillones favoritos para empezar la compra."
        title="Tu carrito está vacío"
      />
    );
  }

  const handleRemove = (item) => {
    removeItem(item.id);
    showToast({
      tone: 'info',
      title: 'Producto eliminado',
      message: `${item.name} se ha quitado del carrito.`,
    });
  };

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="store-heading">
            <span className="store-heading__eyebrow">Carrito</span>
            <h1>Revisa tu selección.</h1>
            <p>Ajusta cantidades y continúa al pago seguro cuando lo tengas claro.</p>
          </div>

          <div className="cart-layout">
            <ul aria-label="Productos en el carrito" className="cart-list">
              {items.map((item) => (
                <li key={item.id}>
                  <Card className="cart-item">
                    <Link aria-hidden="true" className="cart-item__media-link" tabIndex={-1} to={`/producto/${item.slug}`}>
                      <ProductMedia className="cart-item__media" product={item} />
                    </Link>

                    <div className="cart-item__body">
                      <span className="cart-item__category">{item.category}</span>
                      <h2>
                        <Link to={`/producto/${item.slug}`}>{item.name}</Link>
                      </h2>
                      <span className="cart-item__unit">{formatCurrency(item.price)} / unidad</span>
                    </div>

                    <div className="cart-item__actions">
                      <QuantitySelector
                        label={`Cantidad de ${item.name}`}
                        max={MAX_ITEM_QUANTITY}
                        onChange={(quantity) => updateQuantity(item.id, quantity)}
                        value={item.quantity}
                      />
                      <strong className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</strong>
                      <Button className="cart-item__remove" onClick={() => handleRemove(item)} size="sm" tone="ghost">
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>

            <OrderSummary items={items} total={cartTotal}>
              <Button block size="lg" to="/checkout">
                Tramitar pedido
              </Button>
              <Button block to="/catalogo" tone="ghost">
                Seguir comprando
              </Button>
            </OrderSummary>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
