from fastapi import APIRouter, HTTPException
from app.schemas.product import Product
from app.services.product_service import get_product_by_slug, list_products


router = APIRouter(prefix='/products', tags=['products'])


@router.get('', response_model=list[Product])
def get_products() -> list[Product]:
  return list_products()


@router.get('/{slug}', response_model=Product)
def get_product(slug: str) -> Product:
  product = get_product_by_slug(slug)
  if not product:
    raise HTTPException(status_code=404, detail='Product not found.')
  return product
