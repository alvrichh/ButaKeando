import logging

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import Settings


logger = logging.getLogger(__name__)


class SPAStaticFiles(StaticFiles):
  async def get_response(self, path: str, scope):
    try:
      return await super().get_response(path, scope)
    except StarletteHTTPException as exc:
      if exc.status_code != 404 or scope['method'] != 'GET':
        raise
      return await super().get_response('index.html', scope)


def mount_frontend(app: FastAPI, settings: Settings) -> None:
  if not settings.serve_frontend:
    logger.info('Frontend serving disabled by SERVE_FRONTEND.')
    return

  dist_path = settings.frontend_dist_path_resolved
  index_path = dist_path / 'index.html'

  if not index_path.exists():
    logger.warning('Frontend dist not found at %s. API-only mode active.', dist_path)
    return

  app.mount('/', SPAStaticFiles(directory=str(dist_path), html=True), name='frontend')
  logger.info('Frontend dist mounted from %s', dist_path)
