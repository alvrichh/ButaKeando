from app.schemas.checkout import CheckoutSessionRequest
from app.schemas.order import OrderRecord


ORDER_STORE: dict[str, OrderRecord] = {}


def calculate_total(payload: CheckoutSessionRequest) -> float:
  return sum(item.quantity * item.unit_price for item in payload.items)


def create_order(reference: str, payload: CheckoutSessionRequest, payment_status: str) -> OrderRecord:
  order = OrderRecord(
    reference=reference,
    payment_status=payment_status,
    customer=payload.customer,
    shipping_address=payload.shipping_address,
    items=payload.items,
    total_amount=calculate_total(payload),
  )
  ORDER_STORE[reference] = order
  return order


def attach_owner_notification(reference: str, notification) -> OrderRecord:
  order = ORDER_STORE[reference]
  updated = order.model_copy(update={'owner_notification': notification})
  ORDER_STORE[reference] = updated
  return updated


def get_order(reference: str) -> OrderRecord | None:
  return ORDER_STORE.get(reference)
