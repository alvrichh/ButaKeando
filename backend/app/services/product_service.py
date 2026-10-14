from dataclasses import dataclass
from decimal import Decimal

from app.schemas.checkout import CheckoutItemRequest
from app.schemas.product import Product


# Must stay in sync with frontend/src/constants/products.js (id, name, price).
# Only purchasable products belong here: upcoming items are not sellable.
PRODUCTS = [
  Product(
    id='butaca-nordica-oslo',
    slug='butaca-nordica-oslo',
    name='Butaca Nórdica Oslo',
    category='Butaca',
    tagline='Una butaca ligera y elegante para salones serenos y rincones de lectura.',
    price=249,
    lead_time='Disponible bajo pedido',
    description='Líneas suaves, patas de madera y un tapizado amable en una pieza luminosa y cómoda.',
    materials=['Tapizado textil suave', 'Estructura interior reforzada', 'Patas de madera natural'],
    dimensions='82 x 74 x 90 cm',
    features=['Respaldo envolvente', 'Asiento firme y confortable', 'Ideal para salón, dormitorio o estudio'],
  ),
  Product(
    id='sillon-relax-premium',
    slug='sillon-relax-premium',
    name='Sillón Relax Premium',
    category='Sillón',
    tagline='Un sillón de apoyo generoso pensado para el descanso.',
    price=499,
    lead_time='Entrega estimada en 7 días',
    description='Postura cómoda, volumen elegante y una silueta envolvente para estancias principales.',
    materials=['Tapizado premium', 'Base estructural de alta resistencia', 'Apoyabrazos acolchados'],
    dimensions='88 x 82 x 103 cm',
    features=['Asiento amplio', 'Apoyabrazos redondeados', 'Presencia elegante para estancias principales'],
  ),
  Product(
    id='butaca-vintage-retro',
    slug='butaca-vintage-retro',
    name='Butaca Vintage Retro',
    category='Butaca',
    tagline='Una pieza con carácter cálido para ambientes clásicos y acogedores.',
    price=199,
    lead_time='Últimas unidades',
    description='Formas tradicionales reinterpretadas con una presencia sobria y un color intenso.',
    materials=['Tapizado aterciopelado', 'Bastidor compacto', 'Patas de madera oscura'],
    dimensions='80 x 78 x 106 cm',
    features=['Respaldo alto', 'Volumen tradicional', 'Acabado con identidad visual marcada'],
  ),
]


@dataclass(frozen=True)
class ResolvedCartItem:
  product_id: str
  product_name: str
  quantity: int
  unit_amount: int
  subtotal: int


def price_to_cents(price: float | Decimal) -> int:
  return int(round(float(price) * 100))


def list_products() -> list[Product]:
  return PRODUCTS


def get_product_by_slug(slug: str) -> Product | None:
  return next((product for product in PRODUCTS if product.slug == slug), None)


def get_product_by_id(product_id: str) -> Product | None:
  return next((product for product in PRODUCTS if product.id == product_id), None)


def resolve_cart_items(items: list[CheckoutItemRequest]) -> list[ResolvedCartItem]:
  resolved_items: list[ResolvedCartItem] = []

  for item in items:
    product = get_product_by_id(item.product_id)
    if not product:
      raise ValueError(f'Unknown product_id: {item.product_id}')

    if item.product_name and item.product_name != product.name:
      raise ValueError(f'Product name mismatch for {item.product_id}.')

    expected_unit_amount = price_to_cents(product.price)
    if item.unit_price is not None and price_to_cents(item.unit_price) != expected_unit_amount:
      raise ValueError(f'Product price mismatch for {item.product_id}.')

    resolved_items.append(
      ResolvedCartItem(
        product_id=product.id,
        product_name=product.name,
        quantity=item.quantity,
        unit_amount=expected_unit_amount,
        subtotal=expected_unit_amount * item.quantity,
      )
    )

  return resolved_items


def calculate_total_cents(items: list[ResolvedCartItem]) -> int:
  return sum(item.subtotal for item in items)
