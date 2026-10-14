import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { QuantitySelector } from '../../../components/common/QuantitySelector';
import { useToast } from '../../../components/feedback/ToastProvider';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SectionContainer } from '../../../components/layout/SectionContainer';
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
        label="Error 404"
        title="Esta butaca no está aquí"
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
      eyebrow: `Nº ${product.number} · Consulta`,
      title: product.purchasable ? '¿Te ayudamos a decidir?' : 'Te avisamos cuando llegue',
      description: product.purchasable
        ? 'Escríbenos y te orientamos sobre medidas, color y plazos de esta pieza.'
        : 'Escríbenos y te contamos en cuanto esta pieza esté disponible.',
      content: (
        <ul className="modal-list">
          <li>Dinos el modelo y, si puedes, las medidas del hueco donde irá.</li>
          <li>Te responde una persona, no un mensaje automático.</li>
        </ul>
      ),
      actions: [
        { label: 'Cerrar', tone: 'secondary' },
        {
          label: 'Escribir email',
          tone: 'primary',
          href: `mailto:hola@butakeando.es?subject=${encodeURIComponent(`Consulta: ${product.name}`)}`,
        },
      ],
    });

  return (
    <div className="store-page">
      <SectionContainer>
        <PageContainer className="store-shell">
          <nav aria-label="Ruta de navegación" className="breadcrumb mono">
            <ol>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li aria-current="page">Nº {product.number}</li>
            </ol>
          </nav>

          <div className="product-detail">
            <div className="product-detail__visual">
              <ProductMedia className="product-detail__media" priority product={product} />
              <span aria-hidden="true" className="product-detail__number">
                {product.number}
              </span>
            </div>

            <div className="product-detail__sheet">
              <span className="product-detail__label mono">
                {product.category} · {product.style}
              </span>
              <h1>{product.name}</h1>
              <p className="product-detail__tagline">{product.shortDescription}</p>

              <div className="product-detail__price-row">
                <span className="product-detail__price">{formatCurrency(product.price)}</span>
                <span className={['product-detail__availability', 'mono', !product.purchasable && 'is-soon'].filter(Boolean).join(' ')}>
                  {product.availability}
                </span>
              </div>

              {product.purchasable ? (
                <div className="product-detail__purchase">
                  <QuantitySelector max={MAX_ITEM_QUANTITY} onChange={setQuantity} value={quantity} />
                  <Button className="product-detail__add" onClick={handleAddToCart} size="lg">
                    Añadir al carrito · {formatCurrency(product.price * quantity)}
                  </Button>
                </div>
              ) : (
                <div className="product-detail__purchase">
                  <Button className="product-detail__add" onClick={openAdviceModal} size="lg">
                    Avisarme cuando llegue
                  </Button>
                </div>
              )}

              {product.purchasable ? (
                <button className="text-link product-detail__advice" onClick={openAdviceModal} type="button">
                  ¿Dudas? Te ayudamos a decidir
                </button>
              ) : null}

              <p className="product-detail__description">{product.description}</p>

              <dl className="spec-sheet">
                <div className="spec-sheet__row">
                  <dt className="mono">Medidas</dt>
                  <dd>{product.dimensions}</dd>
                </div>
                <div className="spec-sheet__row">
                  <dt className="mono">Materiales</dt>
                  <dd>{product.materials.join(', ')}</dd>
                </div>
                <div className="spec-sheet__row">
                  <dt className="mono">Estilo</dt>
                  <dd>{product.style}</dd>
                </div>
                <div className="spec-sheet__row">
                  <dt className="mono">Lo mejor</dt>
                  <dd>
                    <ul className="spec-sheet__list">
                      {product.features.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}
