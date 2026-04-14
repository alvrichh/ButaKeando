from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db_dependency
from app.schemas.order import OrderRead
from app.services.order_service import get_order_by_reference


router = APIRouter(prefix='/orders', tags=['orders'])


@router.get('/{reference}', response_model=OrderRead)
def read_order(reference: str, db: Session = Depends(get_db_dependency)) -> OrderRead:
  order = get_order_by_reference(db, reference)
  if not order:
    raise HTTPException(status_code=404, detail='Order not found.')
  return order
