import { useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { ProductCard } from '../../../components/ui/ProductCard';
import { products } from '../../../constants/products';

export function CatalogPage() {
  useEffect(() => {
    document.title = 'ButaKeando | Catalogo';
  }, []);

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="store-heading store-heading--split">
            <div>
              <span className="store-heading__eyebrow">Catalogo</span>
              <h1>Descubre la primera seleccion de butacas y sillones de ButaKeando.</h1>
              <p>Una vista clara, elegante y preparada para crecer con filtros, stock real y colecciones futuras.</p>
            </div>
            <Button to="/carrito" tone="secondary">
              Ver carrito
            </Button>
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
