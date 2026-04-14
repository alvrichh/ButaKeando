import logging
from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import Settings, get_settings
from app.db.base import Base


logger = logging.getLogger(__name__)


def _build_engine_kwargs(settings: Settings) -> dict:
  database_url = settings.database_url_normalized
  kwargs = {'pool_pre_ping': True}

  if database_url.startswith('sqlite'):
    kwargs['connect_args'] = {'check_same_thread': False}
    return kwargs

  kwargs.update(
    {
      'pool_size': settings.db_pool_size,
      'max_overflow': settings.db_max_overflow,
      'pool_timeout': settings.db_pool_timeout,
      'pool_recycle': settings.db_pool_recycle,
    }
  )
  return kwargs


@lru_cache
def get_engine():
  settings = get_settings()
  return create_engine(settings.database_url_normalized, **_build_engine_kwargs(settings))


@lru_cache
def get_session_factory():
  return sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, expire_on_commit=False, class_=Session)


def get_db_session():
  session = get_session_factory()()
  try:
    yield session
  finally:
    session.close()


def init_db() -> None:
  settings = get_settings()
  if not settings.auto_create_tables:
    logger.info('AUTO_CREATE_TABLES disabled. Skipping metadata.create_all().')
    return

  Base.metadata.create_all(bind=get_engine())
  logger.warning('AUTO_CREATE_TABLES enabled. Metadata synchronized without Alembic migrations.')
