import logging
from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

import stripe
from fastapi import HTTPException, status

from app.core.config import Settings
from app.schemas.checkout import CheckoutSessionRequest, CheckoutSessionResponse
from app.services.product_service import calculate_total_cents, resolve_cart_items


logger = logging.getLogger(__name__)


def amount_to_cents(amount: Decimal) -> int:
  return int(round(float(amount) * 100))


def cents_to_amount(amount: int) -> float:
  return round(amount / 100, 2)


def generate_reference() -> str:
  timestamp = datetime.now(timezone.utc).strftime('%Y%m%d')
  return f'BTK-{timestamp}-{uuid4().hex[:8].upper()}'


def _configure_stripe(settings: Settings) -> None:
  if not settings.stripe_secret_key:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail='Stripe secret key missing. Configure STRIPE_SECRET_KEY.',
    )
  stripe.api_key = settings.stripe_secret_key
  stripe.api_version = settings.stripe_api_version


def _serialize_cart_metadata(items) -> str:
  return '|'.join(f'{item.product_id}:{item.quantity}' for item in items)


def _build_metadata(payload: CheckoutSessionRequest, reference: str, resolved_items) -> dict[str, str]:
  return {
    'order_reference': reference,
    'customer_name': payload.customer.full_name,
    'customer_email': payload.customer.email,
    'phone': payload.customer.phone or '',
    'address_line': payload.shipping_address.address_line,
    'city': payload.shipping_address.city,
    'postal_code': payload.shipping_address.postal_code,
    'province': payload.shipping_address.province,
    'country': payload.shipping_address.country,
    'comments': (payload.comments or '')[:500],
    'cart_items': _serialize_cart_metadata(resolved_items),
  }


def create_checkout_session(payload: CheckoutSessionRequest, settings: Settings) -> CheckoutSessionResponse:
  if payload.currency != settings.stripe_currency.lower():
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail=f'Unsupported currency. Expected {settings.stripe_currency.lower()}.',
    )

  resolved_items = resolve_cart_items(payload.items)
  amount_total_cents = calculate_total_cents(resolved_items)
  submitted_total_cents = amount_to_cents(payload.total)

  if submitted_total_cents != amount_total_cents:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail='Cart total mismatch. Recalculate cart and try again.',
    )

  reference = generate_reference()
  _configure_stripe(settings)

  try:
    session = stripe.checkout.Session.create(
      mode='payment',
      success_url=settings.build_success_url(reference),
      cancel_url=settings.build_cancel_url(),
      client_reference_id=reference,
      customer_email=payload.customer.email,
      billing_address_collection='required',
      phone_number_collection={'enabled': True},
      metadata=_build_metadata(payload, reference, resolved_items),
      line_items=[
        {
          'quantity': item.quantity,
          'price_data': {
            'currency': settings.stripe_currency.lower(),
            'unit_amount': item.unit_amount,
            'product_data': {
              'name': item.product_name,
              'metadata': {
                'product_id': item.product_id,
              },
            },
          },
        }
        for item in resolved_items
      ],
    )
  except stripe.error.StripeError as exc:
    logger.exception('Stripe session creation failed: %s', exc)
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail='Stripe checkout session creation failed.',
    ) from exc

  logger.info(
    'Stripe checkout session created. reference=%s session_id=%s amount_total=%s',
    reference,
    session.id,
    amount_total_cents,
  )

  return CheckoutSessionResponse(
    reference=reference,
    session_id=session.id,
    checkout_url=session.url,
    publishable_key=settings.stripe_publishable_key,
    payment_status='requires_payment',
    currency=settings.stripe_currency.lower(),
    amount_total=cents_to_amount(amount_total_cents),
    message='Checkout session created successfully.',
  )


def construct_webhook_event(payload: bytes, signature: str | None, settings: Settings):
  if not signature:
    raise ValueError('Missing Stripe-Signature header.')
  if not settings.stripe_webhook_secret:
    raise ValueError('Stripe webhook secret missing.')

  _configure_stripe(settings)

  try:
    return stripe.Webhook.construct_event(payload, signature, settings.stripe_webhook_secret)
  except ValueError as exc:
    logger.warning('Stripe webhook payload invalid: %s', exc)
    raise ValueError('Invalid Stripe payload.') from exc
  except stripe.error.SignatureVerificationError as exc:
    logger.warning('Stripe webhook signature invalid: %s', exc)
    raise ValueError('Invalid Stripe signature.') from exc


def list_checkout_session_line_items(session_id: str, settings: Settings):
  _configure_stripe(settings)

  try:
    return stripe.checkout.Session.list_line_items(session_id, limit=100)
  except stripe.error.StripeError as exc:
    logger.exception('Stripe line items retrieval failed for session %s: %s', session_id, exc)
    raise ValueError('Unable to retrieve Stripe line items.') from exc
