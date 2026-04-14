import logging

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Customer, Order, OrderItem


logger = logging.getLogger(__name__)


def get_order_by_reference(db: Session, reference: str) -> Order | None:
  statement = (
    select(Order)
    .options(selectinload(Order.customer), selectinload(Order.items))
    .where(Order.reference == reference)
  )
  return db.scalar(statement)


def get_order_by_stripe_session_id(db: Session, stripe_session_id: str) -> Order | None:
  statement = (
    select(Order)
    .options(selectinload(Order.customer), selectinload(Order.items))
    .where(Order.stripe_session_id == stripe_session_id)
  )
  return db.scalar(statement)


def _upsert_customer(
  db: Session,
  *,
  full_name: str,
  email: str,
  phone: str | None,
  address_line: str,
  city: str,
  postal_code: str,
  province: str,
  notes: str | None,
) -> Customer:
  customer = db.scalar(select(Customer).where(Customer.email == email))

  if customer:
    customer.full_name = full_name
    customer.phone = phone
    customer.address_line = address_line
    customer.city = city
    customer.postal_code = postal_code
    customer.province = province
    customer.notes = notes
    return customer

  customer = Customer(
    full_name=full_name,
    email=email,
    phone=phone,
    address_line=address_line,
    city=city,
    postal_code=postal_code,
    province=province,
    notes=notes,
  )
  db.add(customer)
  db.flush()
  return customer


def _metadata_get(session_object, key: str, default: str = '') -> str:
  metadata = getattr(session_object, 'metadata', None) or session_object.get('metadata', {})
  return (metadata or {}).get(key, default)


def _parse_cart_items(raw_value: str) -> list[tuple[str, int]]:
  if not raw_value:
    return []

  cart_items: list[tuple[str, int]] = []
  for chunk in raw_value.split('|'):
    product_id, quantity = chunk.split(':', 1)
    cart_items.append((product_id, int(quantity)))
  return cart_items


def persist_completed_checkout(db: Session, session_object, stripe_line_items):
  session_id = getattr(session_object, 'id', None) or session_object['id']
  existing_order = get_order_by_stripe_session_id(db, session_id)
  if existing_order:
    logger.info('Stripe webhook duplicate ignored. session_id=%s reference=%s', session_id, existing_order.reference)
    return existing_order, False

  reference = getattr(session_object, 'client_reference_id', None) or session_object.get('client_reference_id')
  if not reference:
    reference = _metadata_get(session_object, 'order_reference')
  if not reference:
    raise ValueError('Stripe session missing order reference.')

  customer_email = _metadata_get(session_object, 'customer_email')
  customer_name = _metadata_get(session_object, 'customer_name')
  if not customer_email or not customer_name:
    raise ValueError('Stripe session missing customer metadata.')

  customer = _upsert_customer(
    db,
    full_name=customer_name,
    email=customer_email,
    phone=_metadata_get(session_object, 'phone') or None,
    address_line=_metadata_get(session_object, 'address_line'),
    city=_metadata_get(session_object, 'city'),
    postal_code=_metadata_get(session_object, 'postal_code'),
    province=_metadata_get(session_object, 'province'),
    notes=_metadata_get(session_object, 'comments') or None,
  )

  order = Order(
    reference=reference,
    customer_id=customer.id,
    stripe_session_id=session_id,
    stripe_payment_intent_id=getattr(session_object, 'payment_intent', None) or session_object.get('payment_intent'),
    amount_total=int(getattr(session_object, 'amount_total', None) or session_object.get('amount_total') or 0),
    currency=(getattr(session_object, 'currency', None) or session_object.get('currency') or 'eur').lower(),
    status=(getattr(session_object, 'payment_status', None) or session_object.get('payment_status') or 'paid').lower(),
  )
  db.add(order)
  db.flush()

  cart_items = _parse_cart_items(_metadata_get(session_object, 'cart_items'))
  line_items = list(getattr(stripe_line_items, 'data', []) or stripe_line_items.get('data', []))

  if len(cart_items) != len(line_items):
    raise ValueError('Stripe line items count mismatch.')

  for (product_id, quantity), stripe_line_item in zip(cart_items, line_items, strict=True):
    line_quantity = int(getattr(stripe_line_item, 'quantity', None) or stripe_line_item.get('quantity') or 0)
    if line_quantity != quantity:
      raise ValueError(f'Stripe line item quantity mismatch for {product_id}.')

    subtotal = int(
      getattr(stripe_line_item, 'amount_total', None)
      or stripe_line_item.get('amount_total')
      or getattr(stripe_line_item, 'amount_subtotal', None)
      or stripe_line_item.get('amount_subtotal')
      or 0
    )
    description = getattr(stripe_line_item, 'description', None) or stripe_line_item.get('description') or product_id

    db.add(
      OrderItem(
        order_id=order.id,
        product_id=product_id,
        product_name=description,
        unit_price=int(subtotal / quantity),
        quantity=quantity,
        subtotal=subtotal,
      )
    )

  db.commit()
  order = get_order_by_reference(db, reference)
  if not order:
    raise ValueError('Order persisted but could not be reloaded.')

  logger.info('Order persisted. reference=%s session_id=%s', order.reference, session_id)
  return order, True


def mark_order_notification_sent(db: Session, order_id: int) -> Order:
  order = db.get(Order, order_id)
  if not order:
    raise ValueError('Order not found when marking notification.')

  from datetime import datetime, timezone

  order.notification_sent_at = datetime.now(timezone.utc)
  db.commit()
  refreshed_order = get_order_by_reference(db, order.reference)
  if not refreshed_order:
    raise ValueError('Order not found after notification update.')
  return refreshed_order
