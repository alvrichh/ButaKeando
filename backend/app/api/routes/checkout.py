from fastapi import APIRouter, Depends
from app.core.config import Settings
from app.dependencies import get_settings_dependency
from app.schemas.checkout import CheckoutSessionRequest, CheckoutSessionResponse
from app.schemas.order import OrderRecord
from app.services.email_service import build_internal_sale_notification
from app.services.order_service import attach_owner_notification, create_order
from app.services.payment_service import create_checkout_session


router = APIRouter(prefix='/checkout', tags=['checkout'])


@router.post('/sessions', response_model=CheckoutSessionResponse)
def create_session(
  payload: CheckoutSessionRequest,
  settings: Settings = Depends(get_settings_dependency),
) -> CheckoutSessionResponse:
  return create_checkout_session(payload, settings)


@router.post('/confirm/{reference}', response_model=OrderRecord)
def confirm_checkout(
  reference: str,
  payload: CheckoutSessionRequest,
  settings: Settings = Depends(get_settings_dependency),
) -> OrderRecord:
  order = create_order(reference, payload, payment_status='paid')
  notification = build_internal_sale_notification(order, settings)
  return attach_owner_notification(reference, notification)
