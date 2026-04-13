import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { useModal } from '../../../components/ui/Modal';
import { getProductBySlug } from '../../../constants/products';
import { formatCurrency } from '../../../utils/currency';

export function ProductPage() {
  const { slug } = useParams();
  const { openModal } = useModal();
  const product = getProductBySlug(slug);

  useEffect(() => {
    document.title = product ? `ButaKeando | ${product.name}` : 'ButaKeando | Product';
  }, [product]);

  if (!product) {
    return (
      <SectionContainer>
        <PageContainer>
          <Card className="empty-state">
            <h1>Piece not found</h1>
            <p>Selected product slug does not match current sample catalog.</p>
            <Button to="/catalog">Back to catalog</Button>
          </Card>
        </PageContainer>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <PageContainer className="detail-grid product-detail">
        <div>
          <div className={`product-detail__media product-detail__media--${product.tone}`}>
            <span>{product.category}</span>
          </div>
        </div>

        <Card className="product-detail__panel">
          <Badge tone="gold">{product.leadTime}</Badge>
          <h1>{product.name}</h1>
          <p className="product-detail__tagline">{product.tagline}</p>
          <div className="product-detail__price">{formatCurrency(product.price)}</div>
          <p>{product.description}</p>

          <div className="product-detail__group">
            <h2>Materials</h2>
            <ul>
              {product.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="product-detail__group">
            <h2>Dimensions</h2>
            <p>{product.dimensions}</p>
          </div>

          <div className="product-detail__group">
            <h2>Highlights</h2>
            <ul>
              {product.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="product-detail__actions">
            <Button to={`/checkout?product=${product.slug}`}>Start checkout</Button>
            <Button
              onClick={() =>
                openModal({
                  eyebrow: 'Delivery note',
                  title: 'Manual logistics workflow',
                  description: 'Operations stay lightweight during first release.',
                  content: (
                    <ul className="modal-list">
                      <li>Customer submits shipping details inside checkout flow.</li>
                      <li>Hosted payment integration will confirm payment on backend.</li>
                      <li>Internal email notification gives owner all order data for manual fulfillment.</li>
                    </ul>
                  ),
                  actions: [{ label: 'Understood', tone: 'primary' }],
                })
              }
              tone="secondary"
            >
              Delivery flow
            </Button>
          </div>
        </Card>
      </PageContainer>
    </SectionContainer>
  );
}
