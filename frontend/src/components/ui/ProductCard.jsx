import { Link } from 'react-router-dom';
import { ProductMedia } from './ProductMedia';
import { formatCurrency } from '../../utils/currency';

// A catalogue plate: number, photo, name and spec line, separated by rules instead of a boxed card.
export function ProductCard({ product }) {
  return (
    <article className="plate">
      <div className="plate__meta mono">
        <span>Nº {product.number}</span>
        <span>{product.category}</span>
      </div>

      <ProductMedia className="plate__media" product={product} />

      <div className="plate__body">
        <h3 className="plate__name">
          {/* The stretched link makes the whole plate clickable while keeping one tab stop. */}
          <Link className="plate__link" to={`/producto/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <div className="plate__specs mono">
          <span>{product.dimensions}</span>
          <span className={product.purchasable ? undefined : 'plate__status--soon'}>{product.availability}</span>
        </div>
        <div className="plate__price">{formatCurrency(product.price)}</div>
      </div>
    </article>
  );
}
