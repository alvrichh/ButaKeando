from datetime import datetime, timezone
from uuid import uuid4
from app.core.config import Settings
from app.schemas.checkout import CheckoutSessionRequest, CheckoutSessionResponse


def generate_reference() -> str:
  timestamp = datetime.now(timezone.utc).strftime('%Y%m%d')
  return f'BTK-{timestamp}-{uuid4().hex[:6].upper()}'


def create_checkout_session(payload: CheckoutSessionRequest, settings: Settings) -> CheckoutSessionResponse:
  reference = generate_reference()
  checkout_url = None

  if settings.payment_provider == 'mock':
    checkout_url = f'{settings.frontend_url}/order/success?reference={reference}'

  return CheckoutSessionResponse(
    reference=reference,
    provider=settings.payment_provider,
    payment_status='pending_redirect',
    checkout_url=checkout_url,
    email_notification_ready=True,
    message='Checkout session created. Confirm payment with webhook or explicit backend confirmation.',
  )
