from fastapi import APIRouter, Depends, Header, HTTPException
from app.core.config import Settings
from app.core.security import webhook_secret_valid
from app.dependencies import get_settings_dependency
from app.schemas.checkout import PaymentWebhookEvent
from app.schemas.order import OrderRecord
from app.services.email_service import build_internal_sale_notification
from app.services.order_service import attach_owner_notification, create_order


router = APIRouter(prefix='/webhooks', tags=['webhooks'])


@router.post('/payment', response_model=OrderRecord)
def receive_payment_webhook(
  payload: PaymentWebhookEvent,
  x_webhook_secret: str | None = Header(default=None),
  settings: Settings = Depends(get_settings_dependency),
) -> OrderRecord:
  if not webhook_secret_valid(x_webhook_secret, settings):
    raise HTTPException(status_code=401, detail='Invalid webhook secret.')

  order = create_order(payload.reference, payload.checkout, payment_status=payload.payment_status)
  notification = build_internal_sale_notification(order, settings)
  return attach_owner_notification(payload.reference, notification)
