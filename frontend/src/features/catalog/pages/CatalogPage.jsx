import { useEffect } from 'react';
import { Badge } from '../../../components/common/Badge';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { ProductCard } from '../../../components/ui/ProductCard';
import { products } from '../../../constants/products';

export function CatalogPage() {
  useEffect(() => {
    document.title = 'ButaKeando | Catalog';
  }, []);

  return (
    <SectionContainer>
      <PageContainer>
        <div className="section-heading">
          <Badge tone="gold">Catalog</Badge>
          <h1>Curated premium seating selection.</h1>
          <p>
            Early catalog stays intentionally small so design system, product storytelling, and checkout behavior can
            mature without admin overhead.
          </p>
        </div>

        <Card className="catalog-note">
          <strong>Foundation note</strong>
          <p>Product cards, details, and checkout summary reuse same elevated card language for consistent premium feel.</p>
        </Card>

        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    </SectionContainer>
  );
}
