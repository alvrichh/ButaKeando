import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { QuantitySelector } from '../../../components/common/QuantitySelector';
import { useToast } from '../../../components/feedback/ToastProvider';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeading } from '../../../components/layout/PageHeading';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ProductMedia } from '../../../components/ui/ProductMedia';
import { getProductById } from '../../../constants/products';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { MAX_ITEM_QUANTITY, useCart } from '../CartProvider';
import { formatCurrency } from '../../../utils/currency';
import { OrderSummary } from '../components/OrderSummary';

export function CartPage() {
  const { items, cartItemsCount, cartTotal, removeItem, updateQuantity } = useCart();
  const { showToast } = useToast();

  usePageTitle('Carrito');

  if (!items.length) {
    return (
      <EmptyState
        action={{ to: '/catalogo', label: 'Ver las butacas' }}
        body="Todavía no has elegido dónde sentarte. El catálogo te espera."
        label="Carrito (00)"
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
          <PageHeading label={`Carrito · ${String(cartItemsCount).padStart(2, '0')} piezas`} title="Tu selección" />

          <div className="cart-layout">
            <ul aria-label="Productos en el carrito" className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <Link aria-hidden="true" className="cart-item__media-link" tabIndex={-1} to={`/producto/${item.slug}`}>
                    <ProductMedia className="cart-item__media" product={item} />
                  </Link>

                  <div className="cart-item__body">
                    <span className="mono cart-item__number">Nº {getProductById(item.id)?.number}</span>
                    <h2>
                      <Link to={`/producto/${item.slug}`}>{item.name}</Link>
                    </h2>
                    <span className="cart-item__unit mono">{formatCurrency(item.price)} / ud.</span>
                  </div>

                  <div className="cart-item__actions">
                    <QuantitySelector
                      label={`Cantidad de ${item.name}`}
                      max={MAX_ITEM_QUANTITY}
                      onChange={(quantity) => updateQuantity(item.id, quantity)}
                      value={item.quantity}
                    />
                    <strong className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</strong>
                    <button className="text-link text-link--muted" onClick={() => handleRemove(item)} type="button">
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <OrderSummary items={items} total={cartTotal}>
              <Button block size="lg" to="/checkout">
                Tramitar pedido
              </Button>
              <Link className="text-link order-summary__back" to="/catalogo">
                Seguir mirando
              </Link>
            </OrderSummary>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
