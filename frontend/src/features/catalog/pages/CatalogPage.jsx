import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeading } from '../../../components/layout/PageHeading';
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
          <PageHeading
            label={`Catálogo · ${String(products.length).padStart(2, '0')} piezas`}
            lead="Cada pieza lleva su número, sus medidas y su disponibilidad. Abre la ficha para ver todos los detalles."
            title={
              <>
                Butacas para <em>quedarse</em>.
              </>
            }
          />

          <div className="plate-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
