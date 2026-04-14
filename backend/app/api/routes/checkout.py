from fastapi import APIRouter, Depends

from app.core.config import Settings
from app.dependencies import get_settings_dependency
from app.schemas.checkout import CheckoutSessionRequest, CheckoutSessionResponse
from app.services.payment_service import create_checkout_session


router = APIRouter(prefix='/checkout', tags=['checkout'])


@router.post('/session', response_model=CheckoutSessionResponse)
@router.post('/sessions', response_model=CheckoutSessionResponse, include_in_schema=False)
def create_session(
  payload: CheckoutSessionRequest,
  settings: Settings = Depends(get_settings_dependency),
) -> CheckoutSessionResponse:
  return create_checkout_session(payload, settings)
