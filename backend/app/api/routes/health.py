from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.dependencies import get_db_dependency, get_settings_dependency


router = APIRouter(prefix='/health', tags=['health'])


@router.get('')
def health_check(
  db: Session = Depends(get_db_dependency),
  settings: Settings = Depends(get_settings_dependency),
) -> dict[str, str | bool]:
  db.execute(text('SELECT 1'))
  return {
    'status': 'ok',
    'environment': settings.environment,
    'database': 'ok',
    'serve_frontend': settings.serve_frontend,
    'stripe_configured': bool(settings.stripe_secret_key and settings.stripe_webhook_secret),
    'email_configured': settings.email_configured,
  }
