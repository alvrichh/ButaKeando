from datetime import datetime, timezone
from app.core.config import Settings
from app.schemas.order import EmailPreview, OrderRecord


def build_internal_sale_notification(order: OrderRecord, settings: Settings) -> EmailPreview:
  item_lines = [f'- {item.product_name} x{item.quantity} @ {item.unit_price:.0f}' for item in order.items]
  timestamp = datetime.now(timezone.utc).isoformat()

  text = '\n'.join(
    [
      f'Order reference: {order.reference}',
      f'Payment status: {order.payment_status}',
      f'Customer: {order.customer.name}',
      f'Email: {order.customer.email}',
      f'Phone: {order.customer.phone or "Not provided"}',
      'Items:',
      *item_lines,
      f'Total amount: {order.total_amount:.0f}',
      'Shipping:',
      f'- {order.shipping_address.line_1}',
      f'- {order.shipping_address.city}, {order.shipping_address.postal_code}',
      f'- {order.shipping_address.country}',
      f'- Notes: {order.shipping_address.notes or "None"}',
      f'Generated at: {timestamp}',
    ]
  )

  html = '<br>'.join(text.splitlines())

  return EmailPreview(
    to=settings.store_owner_email,
    subject=f'[ButaKeando] New order {order.reference}',
    text=text,
    html=html,
    created_at=timestamp,
  )
