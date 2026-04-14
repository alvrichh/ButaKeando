from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_serializer


def cents_to_amount(value: int) -> float:
  return round(value / 100, 2)


class CustomerRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  full_name: str
  email: EmailStr
  phone: str | None
  address_line: str
  city: str
  postal_code: str
  province: str
  notes: str | None
  created_at: datetime


class OrderItemRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  product_id: str | None
  product_name: str
  unit_price: int
  quantity: int
  subtotal: int
  created_at: datetime

  @field_serializer('unit_price', 'subtotal')
  def serialize_amounts(self, value: int) -> float:
    return cents_to_amount(value)


class OrderRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  reference: str
  stripe_session_id: str
  stripe_payment_intent_id: str | None
  amount_total: int
  currency: str
  status: str
  notification_sent_at: datetime | None
  created_at: datetime
  customer: CustomerRead
  items: list[OrderItemRead]

  @field_serializer('amount_total')
  def serialize_total(self, value: int) -> float:
    return cents_to_amount(value)
