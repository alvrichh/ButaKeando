from pydantic import BaseModel


class Product(BaseModel):
  id: str
  slug: str
  name: str
  category: str
  tagline: str
  price: float
  lead_time: str
  description: str
  materials: list[str]
  dimensions: str
  features: list[str]
