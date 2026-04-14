import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

import app.models  # noqa: F401
from app.api.routes import checkout, health, orders, products, webhooks
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.session import init_db
from app.web.spa import mount_frontend


configure_logging(get_settings().log_level)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
  settings = get_settings()

  @asynccontextmanager
  async def lifespan(_: FastAPI):
    init_db()
    logger.info('Application startup complete. environment=%s', settings.environment)
    yield

  app = FastAPI(title=settings.app_name, lifespan=lifespan)

  app.add_middleware(GZipMiddleware, minimum_size=500)
  app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
  )

  app.include_router(health.router)
  app.include_router(health.router, prefix=settings.api_prefix)
  app.include_router(products.router, prefix=settings.api_prefix)
  app.include_router(checkout.router, prefix=settings.api_prefix)
  app.include_router(orders.router, prefix=settings.api_prefix)
  app.include_router(webhooks.router, prefix=settings.api_prefix)

  mount_frontend(app, settings)
  return app


app = create_app()
