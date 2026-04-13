from pydantic import BaseModel, Field


class CheckoutItem(BaseModel):
  product_id: str
  product_name: str
  quantity: int = Field(ge=1)
  unit_price: float = Field(gt=0)


class CustomerInfo(BaseModel):
  name: str
  email: str
  phone: str | None = None


class ShippingAddress(BaseModel):
  line_1: str
  city: str
  postal_code: str
  country: str
  notes: str | None = None


class CheckoutSessionRequest(BaseModel):
  items: list[CheckoutItem]
  customer: CustomerInfo
  shipping_address: ShippingAddress


class CheckoutSessionResponse(BaseModel):
  reference: str
  provider: str
  payment_status: str
  checkout_url: str | None = None
  email_notification_ready: bool = True
  message: str


class PaymentWebhookEvent(BaseModel):
  event_type: str
  reference: str
  payment_status: str
  checkout: CheckoutSessionRequest
