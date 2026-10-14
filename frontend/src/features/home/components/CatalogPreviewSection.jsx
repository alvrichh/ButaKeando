import { Link } from 'react-router-dom';
import { ProductCard } from '../../../components/ui/ProductCard';
import { products } from '../../../constants/products';

export function CatalogPreviewSection() {
  return (
    <section aria-labelledby="catalog-preview-title" className="home-catalog">
      <header className="section-head">
        <span className="section-head__index mono">I.</span>
        <h2 id="catalog-preview-title">
          El catálogo <sup className="section-head__count mono">({String(products.length).padStart(2, '0')})</sup>
        </h2>
        <Link className="text-link" to="/catalogo">
          Verlo entero
        </Link>
      </header>

      <div className="plate-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
