import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Icon } from '../../../components/common/Icon';
import { QuantitySelector } from '../../../components/common/QuantitySelector';
import { useToast } from '../../../components/feedback/ToastProvider';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useModal } from '../../../components/ui/Modal';
import { ProductMedia } from '../../../components/ui/ProductMedia';
import { getProductBySlug } from '../../../constants/products';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { MAX_ITEM_QUANTITY, useCart } from '../../cart/CartProvider';
import { formatCurrency } from '../../../utils/currency';

export function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { openModal } = useModal();
  const [quantity, setQuantity] = useState(1);
  const product = getProductBySlug(slug);

  usePageTitle(product ? product.name : 'Producto no encontrado');

  if (!product) {
    return (
      <EmptyState
        action={{ to: '/catalogo', label: 'Volver al catálogo' }}
        body="La pieza que buscas no está en el catálogo actual."
        title="Producto no encontrado"
      />
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast({
      tone: 'success',
      title: 'Añadido al carrito',
      message: `${product.name} (x${quantity}) ya está en tu carrito.`,
    });
  };

  const openAdviceModal = () =>
    openModal({
      eyebrow: 'Consulta',
      title: 'Atención personalizada',
      description: 'Te ayudamos a elegir modelo, medida o acabado para tu espacio.',
      content: (
        <ul className="modal-list">
          <li>Escríbenos a hola@butakeando.es indicando el modelo que te interesa.</li>
          <li>Te orientamos sobre estilo, disponibilidad y combinaciones.</li>
          <li>Respondemos personalmente, sin respuestas automáticas.</li>
        </ul>
      ),
      actions: [
        { label: 'Cerrar', tone: 'ghost' },
        { label: 'Escribir email', tone: 'primary', href: `mailto:hola@butakeando.es?subject=${encodeURIComponent(product.name)}` },
      ],
    });

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <nav aria-label="Ruta de navegación" className="breadcrumb">
            <ol>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="product-detail">
            <div className="product-detail__visual">
              <ProductMedia className="product-detail__media" priority product={product} showName />
            </div>

            <Card className="product-detail__panel">
              <div className="product-detail__header">
                <Badge tone="gold">{product.category}</Badge>
                <span className="product-detail__availability">{product.availability}</span>
              </div>

              <h1>{product.name}</h1>
              <p className="product-detail__tagline">{product.shortDescription}</p>
              <div className="product-detail__price">{formatCurrency(product.price)}</div>

              {product.purchasable ? (
                <div className="product-detail__purchase">
                  <div>
                    <span className="product-detail__quantity-label">
                      Cantidad
                    </span>
                    <QuantitySelector max={MAX_ITEM_QUANTITY} onChange={setQuantity} value={quantity} />
                  </div>
                  <div className="product-detail__actions">
                    <Button onClick={handleAddToCart} size="lg">
                      <Icon name="cart" size={18} />
                      Añadir al carrito
                    </Button>
                    <Button onClick={openAdviceModal} size="lg" tone="ghost">
                      Consultar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="product-detail__notice">
                  <p>Esta pieza todavía no está a la venta. Escríbenos y te avisamos en cuanto esté disponible.</p>
                  <Button onClick={openAdviceModal} size="lg">
                    Avisarme del lanzamiento
                  </Button>
                </div>
              )}

              <p className="product-detail__description">{product.description}</p>

              <dl className="product-detail__specs">
                <div className="product-detail__spec">
                  <dt>Materiales</dt>
                  <dd>{product.materials.join(' · ')}</dd>
                </div>
                <div className="product-detail__spec">
                  <dt>Medidas</dt>
                  <dd>{product.dimensions}</dd>
                </div>
                <div className="product-detail__spec">
                  <dt>Estilo</dt>
                  <dd>{product.style}</dd>
                </div>
                <div className="product-detail__spec">
                  <dt>Disponibilidad</dt>
                  <dd>{product.availability}</dd>
                </div>
              </dl>

              <div className="product-detail__group">
                <h2>Características principales</h2>
                <ul>
                  {product.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
