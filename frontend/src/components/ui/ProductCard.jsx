import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from './Card';
import { formatCurrency } from '../../utils/currency';

export function ProductCard({ product }) {
  return (
    <Card className="product-card product-card--store">
      {product.image ? (
        <div className="product-card__media">
          <img alt={product.imageAlt} src={product.image} />
        </div>
      ) : (
        <div className={`product-card__placeholder product-card__placeholder--${product.tone}`}>
          <span>{product.category}</span>
        </div>
      )}

      <div className="product-card__content">
        <div className="product-card__heading">
          <Badge tone="gold">{product.category}</Badge>
          <span className="product-card__availability">{product.availability}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
      </div>

      <div className="product-card__footer">
        <div>
          <small>Precio</small>
          <strong>{formatCurrency(product.price)}</strong>
        </div>
        <Button to={`/producto/${product.slug}`} tone="secondary">
          Ver detalle
        </Button>
      </div>
    </Card>
  );
}
