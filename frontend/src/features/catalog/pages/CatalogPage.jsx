import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { ProductCard } from '../../../components/ui/ProductCard';
import { products } from '../../../constants/products';
import { usePageTitle } from '../../../hooks/usePageTitle';

export function CatalogPage() {
  usePageTitle('Catálogo');

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="store-heading">
            <span className="store-heading__eyebrow">Catálogo</span>
            <h1>Butacas y sillones seleccionados para tu hogar.</h1>
            <p>
              {products.length} piezas con alma vintage y acabado premium. Abre cada ficha para ver medidas, materiales
              y disponibilidad.
            </p>
          </div>

          <div className="catalog-grid catalog-grid--store">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
