import { useEffect } from 'react';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { ProductCard } from '../../../components/ui/ProductCard';
import { useModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/feedback/ToastProvider';
import { products } from '../../../constants/products';

const serviceCards = [
  {
    title: 'Curated comfort',
    body: 'Pieces chosen for premium interiors that need warmth, structure, and believable craftsmanship.',
  },
  {
    title: 'Hosted checkout ready',
    body: 'Foundation prepared for simple payment flow, shipping details capture, and internal order notification.',
  },
  {
    title: 'Manual logistics',
    body: 'Business handles delivery operations directly, so product and purchase flow stays focused and maintainable.',
  },
];

export function HomePage() {
  const { openModal } = useModal();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'ButaKeando | Premium Seating';
  }, []);

  return (
    <>
      <SectionContainer className="hero-section">
        <PageContainer className="hero">
          <div className="hero__content">
            <Badge tone="gold">Modern vintage storefront foundation</Badge>
            <h1>Premium seating, warm character, clean commerce flow.</h1>
            <p>
              ButaKeando starts with restrained luxury: product presentation, intentional checkout, shipping capture,
              and internal order notification without platform clutter.
            </p>
            <div className="hero__actions">
              <Button to="/catalog">Browse collection</Button>
              <Button
                onClick={() =>
                  openModal({
                    eyebrow: 'Material direction',
                    title: 'Design system notes',
                    description: 'Initial UI direction stays premium, calm, and commercial.',
                    content: (
                      <ul className="modal-list">
                        <li>Black and gold accents with soft ivory surfaces.</li>
                        <li>Cards, modals, and toasts share one elevated visual language.</li>
                        <li>Checkout stays simple while backend prepares hosted payment integration.</li>
                      </ul>
                    ),
                    actions: [{ label: 'Continue', tone: 'primary' }],
                  })
                }
                tone="ghost"
              >
                Open design brief
              </Button>
            </div>
          </div>

          <Card className="hero-panel">
            <span className="hero-panel__eyebrow">Studio launch set</span>
            <h2>First release targets storefront essentials.</h2>
            <div className="hero-panel__stats">
              <div>
                <strong>3</strong>
                <span>Sample products</span>
              </div>
              <div>
                <strong>1</strong>
                <span>Checkout journey</span>
              </div>
              <div>
                <strong>Core</strong>
                <span>Email notification seam</span>
              </div>
            </div>
            <Button
              onClick={() =>
                showToast({
                  tone: 'info',
                  title: 'Storefront scaffold live',
                  message: 'Home, catalog, product, checkout, and order states now share one UI foundation.',
                })
              }
              tone="secondary"
            >
              Inspect foundation
            </Button>
          </Card>
        </PageContainer>
      </SectionContainer>

      <SectionContainer>
        <PageContainer>
          <div className="section-heading">
            <Badge>What ship first</Badge>
            <h2>Storefront basics before complexity.</h2>
          </div>

          <div className="info-grid">
            {serviceCards.map((card) => (
              <Card key={card.title} className="feature-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </Card>
            ))}
          </div>
        </PageContainer>
      </SectionContainer>

      <SectionContainer>
        <PageContainer>
          <div className="section-heading section-heading--spread">
            <div>
              <Badge tone="gold">Featured collection</Badge>
              <h2>Card system anchored to real product use.</h2>
            </div>
            <Button to="/catalog" tone="secondary">
              Full catalog
            </Button>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  );
}
