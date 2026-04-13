import { useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { QuantitySelector } from '../../../components/common/QuantitySelector';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { useCart } from '../CartProvider';
import { formatCurrency } from '../../../utils/currency';

export function CartPage() {
  const { items, cartTotal, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    document.title = 'ButaKeando | Carrito';
  }, []);

  if (!items.length) {
    return (
      <div className="store-page">
        <SectionContainer>
          <PageContainer>
            <Card className="shop-empty">
              <h1>Tu carrito esta vacio</h1>
              <p>Explora el catalogo y anade tus butacas o sillones favoritos para empezar la compra.</p>
              <Button to="/catalogo">Ir al catalogo</Button>
            </Card>
          </PageContainer>
        </SectionContainer>
      </div>
    );
  }

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="store-heading">
            <span className="store-heading__eyebrow">Carrito</span>
            <h1>Revisa tu seleccion antes de continuar.</h1>
            <p>Una experiencia simple, clara y preparada para crecer hacia un checkout real.</p>
          </div>

          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <Card key={item.id} className="cart-item">
                  {item.image ? (
                    <img alt={item.imageAlt} className="cart-item__image" src={item.image} />
                  ) : (
                    <div className={`cart-item__placeholder cart-item__placeholder--${item.tone}`}>
                      <span>{item.category}</span>
                    </div>
                  )}

                  <div className="cart-item__body">
                    <div>
                      <span className="cart-item__category">{item.category}</span>
                      <h2>{item.name}</h2>
                    </div>

                    <div className="cart-item__meta">
                      <span>Precio unitario: {formatCurrency(item.price)}</span>
                      <span>Subtotal: {formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>

                  <div className="cart-item__actions">
                    <QuantitySelector value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
                    <Button onClick={() => removeItem(item.id)} tone="ghost">
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="shop-summary-card">
              <span className="shop-summary-card__eyebrow">Resumen</span>
              <h2>Total del carrito</h2>
              <strong>{formatCurrency(cartTotal)}</strong>
              <p>El pedido todavia es visual y mock, pero el recorrido ya se siente como una tienda real.</p>
              <Button to="/checkout">Continuar compra</Button>
              <Button to="/catalogo" tone="secondary">
                Seguir comprando
              </Button>
            </Card>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
