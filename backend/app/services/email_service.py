import logging
import smtplib
from email.message import EmailMessage
from html import escape

from app.core.config import Settings
from app.models.order import Order


logger = logging.getLogger(__name__)


def format_money(amount_in_cents: int, currency: str) -> str:
  return f'{amount_in_cents / 100:.2f} {currency.upper()}'


def build_internal_sale_notification(order: Order, settings: Settings) -> EmailMessage:
  item_lines = [
    f'- {item.product_name} x{item.quantity} @ {format_money(item.unit_price, order.currency)}'
    for item in order.items
  ]
  item_list_html = ''.join(
    f'<li>{escape(item.product_name)} x{item.quantity} - {format_money(item.subtotal, order.currency)}</li>'
    for item in order.items
  )

  text = '\n'.join(
    [
      f'Order reference: {order.reference}',
      f'Order id: {order.id}',
      f'Payment status: {order.status}',
      f'Customer: {order.customer.full_name}',
      f'Email: {order.customer.email}',
      f'Phone: {order.customer.phone or "Not provided"}',
      'Shipping address:',
      f'- {order.customer.address_line}',
      f'- {order.customer.postal_code} {order.customer.city}',
      f'- {order.customer.province}',
      f'- Notes: {order.customer.notes or "None"}',
      'Items:',
      *item_lines,
      f'Total: {format_money(order.amount_total, order.currency)}',
      f'Created at: {order.created_at.isoformat()}',
    ]
  )

  html = f"""
  <h2>ButaKeando - New paid order</h2>
  <p><strong>Order reference:</strong> {escape(order.reference)}</p>
  <p><strong>Order id:</strong> {order.id}</p>
  <p><strong>Payment status:</strong> {escape(order.status)}</p>
  <p><strong>Customer:</strong> {escape(order.customer.full_name)}</p>
  <p><strong>Email:</strong> {escape(order.customer.email)}</p>
  <p><strong>Phone:</strong> {escape(order.customer.phone or 'Not provided')}</p>
  <p><strong>Shipping:</strong> {escape(order.customer.address_line)}, {escape(order.customer.postal_code)} {escape(order.customer.city)}, {escape(order.customer.province)}</p>
  <p><strong>Notes:</strong> {escape(order.customer.notes or 'None')}</p>
  <p><strong>Total:</strong> {format_money(order.amount_total, order.currency)}</p>
  <p><strong>Items:</strong></p>
  <ul>{item_list_html}</ul>
  <p><strong>Created at:</strong> {escape(order.created_at.isoformat())}</p>
  """

  message = EmailMessage()
  message['Subject'] = f'[ButaKeando] New paid order {order.reference}'
  message['From'] = settings.email_from
  message['To'] = settings.order_notification_email
  message.set_content(text)
  message.add_alternative(html, subtype='html')
  return message


def send_order_notification(order: Order, settings: Settings) -> bool:
  if not settings.email_configured:
    logger.warning('SMTP not configured. Skipping email for order %s.', order.reference)
    return False

  message = build_internal_sale_notification(order, settings)

  try:
    if settings.smtp_ssl:
      smtp = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=settings.smtp_timeout_seconds)
    else:
      smtp = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=settings.smtp_timeout_seconds)

    with smtp:
      if settings.smtp_starttls and not settings.smtp_ssl:
        smtp.starttls()
      if settings.smtp_user:
        smtp.login(settings.smtp_user, settings.smtp_password)
      smtp.send_message(message)
  except Exception as exc:
    logger.exception('Order email failed for %s: %s', order.reference, exc)
    return False

  logger.info('Order email sent. reference=%s to=%s', order.reference, settings.order_notification_email)
  return True
