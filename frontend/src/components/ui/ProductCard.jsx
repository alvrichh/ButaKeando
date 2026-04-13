import { Card } from './Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/currency';

export function ProductCard({ product }) {
  return (
    <Card className="product-card">
      <div className={`product-card__media product-card__media--${product.tone}`}>
        <span>{product.category}</span>
      </div>

      <div className="product-card__content">
        <Badge tone="gold">{product.leadTime}</Badge>
        <h3>{product.name}</h3>
        <p>{product.tagline}</p>
      </div>

      <div className="product-card__footer">
        <div>
          <small>Starting at</small>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <Button to={`/product/${product.slug}`} tone="secondary">
          View piece
        </Button>
      </div>
    </Card>
  );
}
