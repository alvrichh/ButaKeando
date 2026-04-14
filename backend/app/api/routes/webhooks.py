import logging

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.dependencies import get_db_dependency, get_settings_dependency
from app.schemas.checkout import StripeWebhookResponse
from app.services.email_service import send_order_notification
from app.services.order_service import mark_order_notification_sent, persist_completed_checkout
from app.services.payment_service import construct_webhook_event, list_checkout_session_line_items


logger = logging.getLogger(__name__)
router = APIRouter(prefix='/webhooks', tags=['webhooks'])

HANDLED_EVENTS = {'checkout.session.completed', 'checkout.session.async_payment_succeeded'}


@router.post('/stripe', response_model=StripeWebhookResponse)
@router.post('/payment', response_model=StripeWebhookResponse, include_in_schema=False)
async def receive_payment_webhook(
  request: Request,
  stripe_signature: str | None = Header(default=None, alias='Stripe-Signature'),
  settings: Settings = Depends(get_settings_dependency),
  db: Session = Depends(get_db_dependency),
) -> StripeWebhookResponse:
  payload = await request.body()

  try:
    event = construct_webhook_event(payload, stripe_signature, settings)
  except ValueError as exc:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

  event_type = event['type']
  logger.info('Stripe webhook received. type=%s', event_type)

  if event_type not in HANDLED_EVENTS:
    return StripeWebhookResponse(received=True, handled=False, event_type=event_type)

  session_object = event['data']['object']
  payment_status = (session_object.get('payment_status') or '').lower()

  if payment_status != 'paid':
    logger.info('Stripe webhook ignored. session_id=%s payment_status=%s', session_object.get('id'), payment_status)
    return StripeWebhookResponse(
      received=True,
      handled=False,
      event_type=event_type,
      payment_status=payment_status or None,
    )

  try:
    stripe_line_items = list_checkout_session_line_items(session_object['id'], settings)
    order, created = persist_completed_checkout(db, session_object, stripe_line_items)
  except ValueError as exc:
    db.rollback()
    logger.warning('Stripe webhook validation failed: %s', exc)
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
  except Exception as exc:
    db.rollback()
    logger.exception('Stripe webhook persistence failed: %s', exc)
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to persist Stripe order.') from exc

  if created and order.notification_sent_at is None and send_order_notification(order, settings):
    order = mark_order_notification_sent(db, order.id)

  return StripeWebhookResponse(
    received=True,
    handled=True,
    event_type=event_type,
    payment_status=payment_status,
    order_reference=order.reference,
    order_id=order.id,
  )
