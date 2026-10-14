import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { useToast } from '../../../components/feedback/ToastProvider';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { createCheckoutSession } from '../../../lib/apiClient';
import { writeStorage } from '../../../lib/storage';
import { OrderSummary } from '../../cart/components/OrderSummary';
import { useCart } from '../../cart/CartProvider';
import { validateCheckoutForm } from '../validation';

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
  const [searchParams] = useSearchParams();
  const wasCanceled = searchParams.get('canceled') === '1';
  const { showToast } = useToast();
  const { items, cartTotal, clearCart } = useCart();
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageTitle('Finalizar compra');

  if (!items.length) {
    return (
      <EmptyState
        action={{ to: '/catalogo', label: 'Ir al catálogo' }}
        body="Aún no has añadido productos al carrito. Empieza por el catálogo."
        title="No hay productos para tramitar"
      />
    );
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleFieldBlur = (event) => {
    const { name } = event.target;
    const fieldError = validateCheckoutForm(formValues)[name];
    setErrors((current) => ({ ...current, [name]: fieldError }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(formValues);
    setErrors(nextErrors);

    const firstInvalidField = Object.keys(initialForm).find((name) => nextErrors[name]);
    if (firstInvalidField) {
      event.currentTarget.elements.namedItem(firstInvalidField)?.focus();
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
        full_name: formValues.fullName.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
      },
      shipping_address: {
        address_line: formValues.address.trim(),
        city: formValues.city.trim(),
        postal_code: formValues.postalCode.trim(),
        province: formValues.province.trim(),
        country: 'ES',
      },
      comments: formValues.comments.trim(),
      total: cartTotal,
      currency: 'eur',
    };

    try {
      const session = await createCheckoutSession(payload);

      writeStorage('butakeando:last-order', {
        items,
        customer: payload.customer,
        shipping: {
          address: payload.shipping_address.address_line,
          city: payload.shipping_address.city,
          postalCode: payload.shipping_address.postal_code,
          province: payload.shipping_address.province,
          comments: payload.comments,
        },
        total: cartTotal,
        reference: session.reference,
      });

      if (session.checkout_url) {
        window.location.assign(session.checkout_url);
        return;
      }

      clearCart();
      navigate(`/pedido/confirmado?reference=${encodeURIComponent(session.reference)}`);
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'No se pudo iniciar el pago',
        message: error.message || 'Inténtalo de nuevo en unos minutos.',
      });
      setIsSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    error: errors[name],
    name,
    onBlur: handleFieldBlur,
    onChange: handleFieldChange,
    value: formValues[name],
  });

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="store-heading">
            <span className="store-heading__eyebrow">Finalizar compra</span>
            <h1>Datos de envío.</h1>
            <p>Completa tus datos y te llevaremos a la pasarela segura de Stripe para realizar el pago.</p>
          </div>

          {wasCanceled ? (
            <p className="checkout-notice" role="status">
              El pago no se ha completado y no se ha realizado ningún cargo. Puedes revisar tus datos e intentarlo de nuevo.
            </p>
          ) : null}

          <div className="checkout-layout">
            <Card className="checkout-card">
              <form className="checkout-form" noValidate onSubmit={handleSubmit}>
                <fieldset className="checkout-form__group">
                  <legend>Contacto</legend>
                  <Input autoComplete="name" label="Nombre y apellidos" maxLength={255} required {...fieldProps('fullName')} />
                  <div className="form-row">
                    <Input
                      autoComplete="email"
                      inputMode="email"
                      label="Email"
                      maxLength={255}
                      required
                      type="email"
                      {...fieldProps('email')}
                    />
                    <Input
                      autoComplete="tel"
                      helper="Solo para coordinar la entrega."
                      inputMode="tel"
                      label="Teléfono"
                      maxLength={50}
                      required
                      type="tel"
                      {...fieldProps('phone')}
                    />
                  </div>
                </fieldset>

                <fieldset className="checkout-form__group">
                  <legend>Dirección de entrega</legend>
                  <Input autoComplete="street-address" label="Dirección" maxLength={255} required {...fieldProps('address')} />
                  <div className="form-row">
                    <Input autoComplete="address-level2" label="Ciudad" maxLength={120} required {...fieldProps('city')} />
                    <Input
                      autoComplete="postal-code"
                      inputMode="numeric"
                      label="Código postal"
                      maxLength={5}
                      required
                      {...fieldProps('postalCode')}
                    />
                  </div>
                  <Input autoComplete="address-level1" label="Provincia" maxLength={120} required {...fieldProps('province')} />
                  <Textarea
                    helper="Horario de entrega, acceso al edificio o cualquier detalle útil."
                    label="Comentarios del pedido (opcional)"
                    maxLength={500}
                    rows="4"
                    {...fieldProps('comments')}
                  />
                </fieldset>

                <Button aria-busy={isSubmitting} block disabled={isSubmitting} size="lg" type="submit">
                  {isSubmitting ? 'Conectando con la pasarela…' : 'Continuar al pago seguro'}
                </Button>
              </form>
            </Card>

            <div className="checkout-sidebar">
              <OrderSummary items={items} total={cartTotal} />
              <Button to="/carrito" tone="ghost">
                Volver al carrito
              </Button>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
