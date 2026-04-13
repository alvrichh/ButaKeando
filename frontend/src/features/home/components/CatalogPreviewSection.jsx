import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { products } from '../../../constants/products';
import { LandingProductCard } from './LandingProductCard';

export function CatalogPreviewSection() {
  return (
    <section className="landing-section landing-section--catalog" id="catalogo">
      <div className="landing-section__heading landing-section__heading--row">
        <div>
          <Badge tone="gold">Seleccion destacada</Badge>
          <h2>Una preview de catalogo pensada para ensenar marca, producto y estilo.</h2>
        </div>
        <Button to="/catalogo">Ver tienda</Button>
      </div>

      <div className="landing-product-grid">
        {products.map((item) => (
          <LandingProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
