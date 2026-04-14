from dataclasses import dataclass
from decimal import Decimal

from app.schemas.checkout import CheckoutItemRequest
from app.schemas.product import Product


PRODUCTS = [
  Product(
    id='bernal-lounge-chair',
    slug='bernal-lounge-chair',
    name='Bernal Lounge Chair',
    category='Armchair',
    tagline='Walnut frame, boucle texture, quiet luxury posture.',
    price=1490,
    lead_time='Made to order in 4 weeks',
    description='A compact statement chair designed for reading corners, boutique lounges, and refined living rooms.',
    materials=['Solid walnut', 'Performance boucle', 'Brushed brass foot caps'],
    dimensions='86 x 82 x 74 cm',
    features=[
      'Hand-finished wood silhouette',
      'Deep seat with upright support',
      'Warm neutral upholstery for premium interiors',
    ],
  ),
  Product(
    id='triana-sofa',
    slug='triana-sofa',
    name='Triana Sofa',
    category='Sofa',
    tagline='Soft geometry with tailored seams and balanced depth.',
    price=3290,
    lead_time='Delivered in 5 to 6 weeks',
    description='A modular-looking sofa with disciplined lines, generous comfort, and finishes suited for high-end residential spaces.',
    materials=['Oak base', 'Textured chenille', 'High-resilience foam core'],
    dimensions='238 x 96 x 78 cm',
    features=[
      'Structured arm profile with subtle curve',
      'Seat depth tuned for long-form comfort',
      'Neutral palette made for layered interiors',
    ],
  ),
  Product(
    id='alameda-accent-seat',
    slug='alameda-accent-seat',
    name='Alameda Accent Seat',
    category='Accent',
    tagline='Sculpted lines, compact footprint, brass whisper.',
    price=980,
    lead_time='Ships in 3 weeks',
    description='A hospitality-inspired accent seat created for entryways, bedrooms, and styled corners that need warmth without visual noise.',
    materials=['Ash frame', 'Velvet upholstery', 'Brass-finished detail'],
    dimensions='68 x 71 x 76 cm',
    features=[
      'Small-space friendly proportion',
      'Soft rounded back for visual warmth',
      'Built to pair with premium side tables',
    ],
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
