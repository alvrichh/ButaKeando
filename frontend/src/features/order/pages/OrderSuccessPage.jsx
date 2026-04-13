import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { getProductBySlug } from '../../../constants/products';
import { readStorage } from '../../../lib/storage';

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') ?? 'BTK-REF-PENDING';
  const productSlug = searchParams.get('product');
  const lastOrder = readStorage('butakeando:last-order');
  const product = getProductBySlug(productSlug) ?? lastOrder?.product;

  useEffect(() => {
    document.title = 'ButaKeando | Order ready';
  }, []);

  return (
    <SectionContainer>
      <PageContainer className="info-grid">
        <Card className="success-card success-card--primary">
          <span className="summary-card__eyebrow">Checkout prepared</span>
          <h1>Order reference {reference}</h1>
          <p>
            Scaffold stores customer and shipping data, then hands next step to hosted payment integration once backend
            goes live.
          </p>
          <div className="success-card__actions">
            <Button to="/catalog">Continue browsing</Button>
            <Button to="/checkout" tone="secondary">
              Start another order
            </Button>
          </div>
        </Card>

        <Card className="success-card">
          <span className="summary-card__eyebrow">Selected piece</span>
          <h2>{product?.name ?? 'Product pending'}</h2>
          <p>{product?.tagline ?? 'Product details will appear after live checkout session links.'}</p>
        </Card>

        <Card className="success-card">
          <span className="summary-card__eyebrow">Owner notification</span>
          <p>Backend scaffold prepares internal sale email payload with order ref, buyer data, shipping address, and payment status.</p>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
