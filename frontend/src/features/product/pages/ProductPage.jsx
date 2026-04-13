import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { QuantitySelector } from '../../../components/common/QuantitySelector';
import { useToast } from '../../../components/feedback/ToastProvider';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { useModal } from '../../../components/ui/Modal';
import { getProductBySlug } from '../../../constants/products';
import { useCart } from '../../cart/CartProvider';
import { formatCurrency } from '../../../utils/currency';

export function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { openModal } = useModal();
  const [quantity, setQuantity] = useState(1);
  const product = getProductBySlug(slug);

  useEffect(() => {
    document.title = product ? `ButaKeando | ${product.name}` : 'ButaKeando | Producto';
  }, [product]);

  if (!product) {
    return (
      <div className="store-page">
        <SectionContainer>
          <PageContainer>
            <Card className="shop-empty">
              <h1>Producto no encontrado</h1>
              <p>La referencia que buscas no coincide con el catalogo mock actual.</p>
              <Button to="/catalogo">Volver al catalogo</Button>
            </Card>
          </PageContainer>
        </SectionContainer>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast({
      tone: 'success',
      title: 'Producto anadido',
      message: `${product.name} se ha anadido al carrito.`,
    });
  };

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <div className="product-detail">
            <div className="product-detail__visual">
              {product.image ? (
                <div className="product-detail__media-frame">
                  <img alt={product.imageAlt} className="product-detail__image" src={product.image} />
                </div>
              ) : (
                <div className={`product-detail__placeholder product-detail__placeholder--${product.tone}`}>
                  <span>{product.category}</span>
                  <strong>{product.name}</strong>
                </div>
              )}
            </div>

            <Card className="product-detail__panel product-detail__panel--store">
              <div className="product-detail__header">
                <Badge tone="gold">{product.category}</Badge>
                <span className="product-detail__availability">{product.availability}</span>
              </div>

              <h1>{product.name}</h1>
              <p className="product-detail__tagline">{product.shortDescription}</p>
              <div className="product-detail__price">{formatCurrency(product.price)}</div>
              <p>{product.description}</p>

              <div className="product-detail__specs">
                <div className="product-detail__spec">
                  <span>Materiales</span>
                  <strong>{product.materials.join(' · ')}</strong>
                </div>
                <div className="product-detail__spec">
                  <span>Medidas</span>
                  <strong>{product.dimensions}</strong>
                </div>
                <div className="product-detail__spec">
                  <span>Estilo</span>
                  <strong>{product.style}</strong>
                </div>
                <div className="product-detail__spec">
                  <span>Disponibilidad</span>
                  <strong>{product.availability}</strong>
                </div>
              </div>

              <div className="product-detail__group">
                <h2>Caracteristicas principales</h2>
                <ul>
                  {product.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="product-detail__purchase">
                <div>
                  <span className="product-detail__quantity-label">Cantidad</span>
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                </div>
                <div className="product-detail__actions">
                  <Button onClick={handleAddToCart}>Anadir al carrito</Button>
                  <Button
                    onClick={() =>
                      openModal({
                        eyebrow: 'Consulta',
                        title: 'Atencion personalizada',
                        description: 'Podemos ayudarte a elegir modelo, medida o acabado.',
                        content: (
                          <ul className="modal-list">
                            <li>Escribenos a hola@butakeando.es</li>
                            <li>Te orientamos sobre estilo, disponibilidad y combinaciones</li>
                            <li>La tienda puede crecer despues con catalogo y pagos reales</li>
                          </ul>
                        ),
                        actions: [{ label: 'Cerrar', tone: 'primary' }],
                      })
                    }
                    tone="secondary"
                  >
                    Consultar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
