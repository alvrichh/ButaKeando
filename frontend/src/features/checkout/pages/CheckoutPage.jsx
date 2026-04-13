import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Textarea } from '../../../components/common/Textarea';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { useToast } from '../../../components/feedback/ToastProvider';
import { getProductBySlug, products } from '../../../constants/products';
import { createCheckoutSession } from '../../../lib/apiClient';
import { writeStorage } from '../../../lib/storage';
import { formatCurrency } from '../../../utils/currency';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  postalCode: '',
  country: 'Spain',
  notes: '',
};

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formValues, setFormValues] = useState(initialForm);
  const [selectedSlug, setSelectedSlug] = useState(searchParams.get('product') ?? products[0].slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedProduct = getProductBySlug(selectedSlug) ?? products[0];

  useEffect(() => {
    document.title = 'ButaKeando | Checkout';
  }, []);

  useEffect(() => {
    const slugFromQuery = searchParams.get('product');
    if (slugFromQuery && slugFromQuery !== selectedSlug) {
      setSelectedSlug(slugFromQuery);
    }
  }, [searchParams, selectedSlug]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      items: [
        {
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          quantity: 1,
          unit_price: selectedProduct.price,
        },
      ],
      customer: {
        name: `${formValues.firstName} ${formValues.lastName}`.trim(),
        email: formValues.email,
        phone: formValues.phone,
      },
      shipping_address: {
        line_1: formValues.street,
        city: formValues.city,
        postal_code: formValues.postalCode,
        country: formValues.country,
        notes: formValues.notes,
      },
    };

    try {
      const session = await createCheckoutSession(payload);

      writeStorage('butakeando:last-order', {
        product: selectedProduct,
        customer: payload.customer,
        shipping: payload.shipping_address,
        session,
      });

      showToast({
        tone: 'success',
        title: 'Checkout session prepared',
        message: session.message ?? 'Shipping data captured and payment handoff ready.',
      });

      navigate(`/order/success?reference=${session.reference}&product=${selectedProduct.slug}`);
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Checkout could not start',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer>
      <PageContainer className="detail-grid checkout-layout">
        <Card className="checkout-card">
          <h1>Simple checkout foundation</h1>
          <p>Shipping details captured here. Hosted payment handoff and internal email notification connect through backend seam.</p>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <Select
              label="Product"
              name="product"
              onChange={(event) => setSelectedSlug(event.target.value)}
              options={products.map((product) => ({
                value: product.slug,
                label: `${product.name} — ${formatCurrency(product.price)}`,
              }))}
              value={selectedSlug}
            />

            <div className="form-row">
              <Input label="First name" name="firstName" onChange={handleFieldChange} required value={formValues.firstName} />
              <Input label="Last name" name="lastName" onChange={handleFieldChange} required value={formValues.lastName} />
            </div>

            <div className="form-row">
              <Input label="Email" name="email" onChange={handleFieldChange} required type="email" value={formValues.email} />
              <Input label="Phone" name="phone" onChange={handleFieldChange} value={formValues.phone} />
            </div>

            <Input label="Street address" name="street" onChange={handleFieldChange} required value={formValues.street} />

            <div className="form-row">
              <Input label="City" name="city" onChange={handleFieldChange} required value={formValues.city} />
              <Input label="Postal code" name="postalCode" onChange={handleFieldChange} required value={formValues.postalCode} />
            </div>

            <Input label="Country" name="country" onChange={handleFieldChange} required value={formValues.country} />

            <Textarea
              helper="Optional delivery note for internal reference."
              label="Notes"
              name="notes"
              onChange={handleFieldChange}
              rows="4"
              value={formValues.notes}
            />

            <Button block disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Preparing checkout...' : 'Continue to payment'}
            </Button>
          </form>
        </Card>

        <div className="checkout-sidebar">
          <Card className="summary-card">
            <span className="summary-card__eyebrow">Order summary</span>
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.tagline}</p>
            <strong>{formatCurrency(selectedProduct.price)}</strong>
          </Card>

          <Card className="summary-card">
            <span className="summary-card__eyebrow">Backend expectation</span>
            <ul className="summary-list">
              <li>Create checkout session on backend.</li>
              <li>Confirm payment through trusted backend step or webhook.</li>
              <li>Trigger internal email with customer and shipping details.</li>
            </ul>
          </Card>

          <Button to={`/product/${selectedProduct.slug}`} tone="secondary">
            Review product again
          </Button>
        </div>
      </PageContainer>
    </SectionContainer>
  );
}
