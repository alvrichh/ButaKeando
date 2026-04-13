from fastapi import APIRouter, HTTPException
from app.schemas.order import OrderRecord
from app.services.order_service import get_order


router = APIRouter(prefix='/orders', tags=['orders'])


@router.get('/{reference}', response_model=OrderRecord)
def read_order(reference: str) -> OrderRecord:
  order = get_order(reference)
  if not order:
    raise HTTPException(status_code=404, detail='Order not found.')
  return order
