from dataclasses import dataclass
from functools import lru_cache
import os


@dataclass(frozen=True)
class Settings:
  app_name: str
  environment: str
  api_prefix: str
  frontend_url: str
  store_owner_email: str
  payment_provider: str
  webhook_secret: str


@lru_cache
def get_settings() -> Settings:
  return Settings(
    app_name=os.getenv('APP_NAME', 'ButaKeando API'),
    environment=os.getenv('APP_ENV', 'development'),
    api_prefix=os.getenv('API_PREFIX', '/api'),
    frontend_url=os.getenv('FRONTEND_URL', 'http://127.0.0.1:5173'),
    store_owner_email=os.getenv('STORE_OWNER_EMAIL', 'owner@butakeando.test'),
    payment_provider=os.getenv('PAYMENT_PROVIDER', 'mock'),
    webhook_secret=os.getenv('WEBHOOK_SECRET', 'dev-webhook-secret'),
  )
