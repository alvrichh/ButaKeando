from pydantic import BaseModel
from app.schemas.checkout import CheckoutItem, CustomerInfo, ShippingAddress


class EmailPreview(BaseModel):
  to: str
  subject: str
  text: str
  html: str
  created_at: str


class OrderRecord(BaseModel):
  reference: str
  payment_status: str
  customer: CustomerInfo
  shipping_address: ShippingAddress
  items: list[CheckoutItem]
  total_amount: float
  owner_notification: EmailPreview | None = None
