import uvicorn

from app.core.config import get_settings


def main() -> None:
  settings = get_settings()
  uvicorn.run(
    'app.main:app',
    host=settings.host,
    port=settings.port,
    workers=settings.web_concurrency,
    proxy_headers=True,
    forwarded_allow_ips='*',
  )


if __name__ == '__main__':
  main()
