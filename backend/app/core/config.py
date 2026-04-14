from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
DEFAULT_FRONTEND_DIST_PATH = (BACKEND_DIR.parent / 'frontend' / 'dist').resolve()


class Settings(BaseSettings):
  model_config = SettingsConfigDict(
    env_file='.env',
    env_file_encoding='utf-8',
    case_sensitive=False,
    extra='ignore',
  )

  app_name: str = 'ButaKeando API'
  environment: Literal['development', 'staging', 'production'] = Field(
    default='development',
    validation_alias=AliasChoices('APP_ENV', 'ENVIRONMENT', 'environment'),
  )
  api_prefix: str = '/api/v1'
  host: str = '0.0.0.0'
  port: int = Field(default=8000, validation_alias=AliasChoices('PORT', 'port'))
  web_concurrency: int = Field(default=1, validation_alias=AliasChoices('WEB_CONCURRENCY', 'web_concurrency'))
  frontend_url: str = ''
  render_external_url: str = Field(default='', validation_alias=AliasChoices('RENDER_EXTERNAL_URL', 'render_external_url'))
  local_frontend_url: str = 'http://127.0.0.1:5173'
  frontend_success_path: str = '/pedido/confirmado'
  frontend_cancel_path: str = '/checkout'
  cors_allow_origins: str = ''
  serve_frontend: bool = True
  frontend_dist_path: Path = DEFAULT_FRONTEND_DIST_PATH
  database_url: str = 'sqlite:///./butakeando.db'
  auto_create_tables: bool = False
  db_pool_size: int = 5
  db_max_overflow: int = 10
  db_pool_timeout: int = 30
  db_pool_recycle: int = 1800
  stripe_secret_key: str = ''
  stripe_publishable_key: str = ''
  stripe_webhook_secret: str = ''
  stripe_api_version: str = '2026-02-25.clover'
  stripe_currency: str = 'eur'
  order_notification_email: str = 'owner@butakeando.test'
  email_from: str = 'no-reply@butakeando.test'
  smtp_host: str = ''
  smtp_port: int = 587
  smtp_user: str = ''
  smtp_password: str = ''
  smtp_starttls: bool = True
  smtp_ssl: bool = False
  smtp_timeout_seconds: int = 10
  log_level: str = 'INFO'

  @property
  def public_app_url(self) -> str:
    return (self.frontend_url or self.render_external_url or self.local_frontend_url).rstrip('/')

  @property
  def cors_origins(self) -> list[str]:
    if self.cors_allow_origins:
      return [origin.strip().rstrip('/') for origin in self.cors_allow_origins.split(',') if origin.strip()]
    return [self.public_app_url]

  @property
  def database_url_normalized(self) -> str:
    if self.database_url.startswith('postgres://'):
      return self.database_url.replace('postgres://', 'postgresql+psycopg://', 1)
    if self.database_url.startswith('postgresql://') and '+psycopg' not in self.database_url:
      return self.database_url.replace('postgresql://', 'postgresql+psycopg://', 1)
    return self.database_url

  @property
  def frontend_dist_path_resolved(self) -> Path:
    if self.frontend_dist_path.is_absolute():
      return self.frontend_dist_path
    return (BACKEND_DIR / self.frontend_dist_path).resolve()

  def build_success_url(self, reference: str) -> str:
    path = self.frontend_success_path if self.frontend_success_path.startswith('/') else f'/{self.frontend_success_path}'
    return f'{self.public_app_url}{path}?reference={reference}&session_id={{CHECKOUT_SESSION_ID}}'

  def build_cancel_url(self) -> str:
    path = self.frontend_cancel_path if self.frontend_cancel_path.startswith('/') else f'/{self.frontend_cancel_path}'
    return f'{self.public_app_url}{path}?canceled=1'

  @property
  def email_configured(self) -> bool:
    return bool(self.smtp_host and self.order_notification_email and self.email_from)


@lru_cache
def get_settings() -> Settings:
  return Settings()
