import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';
import { Card } from './Card';
import { ProductMedia } from './ProductMedia';
import { formatCurrency } from '../../utils/currency';

export function ProductCard({ product, compact = false }) {
  const productUrl = `/producto/${product.slug}`;

  return (
    <Card className={['product-card', compact && 'product-card--compact'].filter(Boolean).join(' ')}>
      <ProductMedia className="product-card__media" product={product} showName />

      <div className="product-card__content">
        <div className="product-card__heading">
          <Badge tone="gold">{product.category}</Badge>
          <span className="product-card__availability">{product.availability}</span>
        </div>
        <h3>
          {/* The stretched link makes the whole card clickable while keeping one tab stop. */}
          <Link className="product-card__link" to={productUrl}>
            {product.name}
          </Link>
        </h3>
        {!compact ? <p>{product.shortDescription}</p> : null}
      </div>

      <div className="product-card__footer">
        <strong className="product-card__price">{formatCurrency(product.price)}</strong>
        <span aria-hidden="true" className="product-card__cta">
          Ver detalle
          <Icon name="arrowRight" size={16} />
        </span>
      </div>
    </Card>
  );
}
