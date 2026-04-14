import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { useToast } from '../../../components/feedback/ToastProvider';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { createCheckoutSession } from '../../../lib/apiClient';
import { writeStorage } from '../../../lib/storage';
import { useCart } from '../../cart/CartProvider';
import { formatCurrency } from '../../../utils/currency';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  province: '',
  comments: '',
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { items, cartTotal, clearCart } = useCart();
  const [formValues, setFormValues] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'ButaKeando | Checkout';
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      showToast({
        tone: 'warning',
        title: 'Carrito vacio',
        message: 'Anade al menos un producto antes de continuar al checkout.',
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      items: items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      customer: {
        full_name: formValues.fullName,
        email: formValues.email,
        phone: formValues.phone,
      },
      shipping_address: {
        address_line: formValues.address,
        city: formValues.city,
        postal_code: formValues.postalCode,
        province: formValues.province,
        country: 'ES',
      },
      comments: formValues.comments,
      total: cartTotal,
      currency: 'eur',
    };

    try {
      const session = await createCheckoutSession(payload);

      writeStorage('butakeando:last-order', {
        items,
        customer: payload.customer,
        shipping: {
          address: formValues.address,
          city: formValues.city,
          postalCode: formValues.postalCode,
          province: formValues.province,
          comments: formValues.comments,
        },
        total: cartTotal,
        session,
      });

      if (session.checkout_url) {
        window.location.assign(session.checkout_url);
        return;
      }

      clearCart();

      showToast({
        tone: 'success',
        title: 'Pedido preparado',
        message: 'Sesion mock preparada. Configura API para usar pago real.',
      });

      navigate(`/pedido/confirmado?reference=${session.reference}`);
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'No se pudo preparar el pedido',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="store-page">
        <SectionContainer>
          <PageContainer>
            <Card className="shop-empty">
              <h1>No hay productos para tramitar</h1>
              <p>Aun no has anadido productos al carrito. Empieza por el catalogo.</p>
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
            <span className="store-heading__eyebrow">Checkout</span>
            <h1>Una primera experiencia visual de compra, clara y premium.</h1>
            <p>Este formulario ya puede abrir Stripe Checkout real cuando conectes tu backend desplegado.</p>
          </div>

          <div className="checkout-layout checkout-layout--store">
            <Card className="checkout-card checkout-card--store">
              <form className="checkout-form" onSubmit={handleSubmit}>
                <Input label="Nombre y apellidos" name="fullName" onChange={handleFieldChange} required value={formValues.fullName} />
                <div className="form-row">
                  <Input label="Email" name="email" onChange={handleFieldChange} required type="email" value={formValues.email} />
                  <Input label="Telefono" name="phone" onChange={handleFieldChange} required value={formValues.phone} />
                </div>
                <Input label="Direccion" name="address" onChange={handleFieldChange} required value={formValues.address} />
                <div className="form-row">
                  <Input label="Ciudad" name="city" onChange={handleFieldChange} required value={formValues.city} />
                  <Input label="Codigo postal" name="postalCode" onChange={handleFieldChange} required value={formValues.postalCode} />
                </div>
                <Input label="Provincia" name="province" onChange={handleFieldChange} required value={formValues.province} />
                <Textarea
                  helper="Indica acabados, horario de entrega o cualquier detalle del pedido."
                  label="Comentarios del pedido"
                  name="comments"
                  onChange={handleFieldChange}
                  rows="5"
                  value={formValues.comments}
                />

                <Button block disabled={isSubmitting} type="submit">
                  {isSubmitting ? 'Preparando pago...' : 'Continuar a Stripe Checkout'}
                </Button>
              </form>
            </Card>

            <div className="checkout-sidebar">
              <Card className="shop-summary-card">
                <span className="shop-summary-card__eyebrow">Resumen del pedido</span>
                <h2>Productos seleccionados</h2>
                <div className="summary-list--store">
                  {items.map((item) => (
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
                  <strong>{formatCurrency(cartTotal)}</strong>
                </div>
              </Card>

              <Button to="/carrito" tone="secondary">
                Volver al carrito
              </Button>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
