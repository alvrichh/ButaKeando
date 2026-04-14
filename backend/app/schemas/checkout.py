from decimal import Decimal

from pydantic import AliasChoices, BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class CheckoutItemRequest(BaseModel):
  model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

  product_id: str = Field(min_length=1, max_length=120)
  product_name: str | None = Field(default=None, max_length=255)
  quantity: int = Field(ge=1, le=10)
  unit_price: Decimal | None = Field(default=None, gt=0, decimal_places=2)


class CustomerInfo(BaseModel):
  model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

  full_name: str = Field(validation_alias=AliasChoices('full_name', 'name'), min_length=2, max_length=255)
  email: EmailStr
  phone: str | None = Field(default=None, max_length=50)


class ShippingAddress(BaseModel):
  model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

  address_line: str = Field(validation_alias=AliasChoices('address_line', 'line_1'), min_length=3, max_length=255)
  city: str = Field(min_length=2, max_length=120)
  postal_code: str = Field(min_length=3, max_length=32)
  province: str = Field(min_length=2, max_length=120)
  country: str = Field(default='ES', min_length=2, max_length=56)
  notes: str | None = Field(default=None, max_length=500)

  @field_validator('country')
  @classmethod
  def normalize_country(cls, value: str) -> str:
    return value.strip().upper()


class CheckoutSessionRequest(BaseModel):
  model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

  customer: CustomerInfo
  shipping_address: ShippingAddress
  items: list[CheckoutItemRequest] = Field(min_length=1, max_length=20)
  total: Decimal = Field(gt=0, decimal_places=2)
  currency: str = Field(default='eur', min_length=3, max_length=8)
  comments: str | None = Field(default=None, max_length=500)

  @field_validator('currency')
  @classmethod
  def normalize_currency(cls, value: str) -> str:
    return value.strip().lower()

  @model_validator(mode='after')
  def fill_comments_from_shipping_notes(self):
    if not self.comments and self.shipping_address.notes:
      self.comments = self.shipping_address.notes
    return self


class CheckoutSessionResponse(BaseModel):
  reference: str
  session_id: str
  checkout_url: str
  publishable_key: str
  payment_status: str
  currency: str
  amount_total: float
  message: str


class StripeWebhookResponse(BaseModel):
  received: bool
  handled: bool
  event_type: str
  payment_status: str | None = None
  order_reference: str | None = None
  order_id: int | None = None
