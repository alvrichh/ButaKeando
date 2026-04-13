import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/currency';

export function LandingProductCard({ item }) {
  return (
    <Card className="landing-product-card">
      {item.image ? (
        <div className="landing-product-card__media">
          <img alt={item.imageAlt} src={item.image} />
        </div>
      ) : (
        <div className={`landing-product-card__placeholder landing-product-card__placeholder--${item.tone}`}>
          <span>Proximamente</span>
          <strong>Milano</strong>
        </div>
      )}

      <div className="landing-product-card__content">
        <h3>{item.name}</h3>
        <p>{formatCurrency(item.price)}</p>
        <Button to={`/producto/${item.slug}`} tone="secondary">
          Ver producto
        </Button>
      </div>
    </Card>
  );
}
