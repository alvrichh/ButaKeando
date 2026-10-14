import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { ProductCard } from '../../../components/ui/ProductCard';
import { products } from '../../../constants/products';

export function CatalogPreviewSection() {
  return (
    <section aria-labelledby="catalog-preview-title" className="landing-section landing-section--catalog" id="catalogo">
      <div className="landing-section__heading landing-section__heading--row">
        <div>
          <Badge tone="gold">Selección destacada</Badge>
          <h2 id="catalog-preview-title">Piezas para vivir y para mirar.</h2>
        </div>
        <Button to="/catalogo" tone="secondary">
          Ver todo el catálogo
        </Button>
      </div>

      <div className="landing-product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} compact product={product} />
        ))}
      </div>
    </section>
  );
}
