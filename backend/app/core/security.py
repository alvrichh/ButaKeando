from app.core.config import Settings


def webhook_secret_valid(provided_secret: str | None, settings: Settings) -> bool:
  return not settings.webhook_secret or provided_secret == settings.webhook_secret
