<img width="541" height="147" alt="butaKeando inserted" src="https://github.com/user-attachments/assets/476b5b84-29cb-4720-9b9e-1d3dd2e7907c" />

Private commercial storefront for premium armchairs, sofas, and upholstered furniture.

## Production shape

Project now ready for single-app deploy on Render:

- frontend builds with Vite inside Docker
- FastAPI serves compiled frontend in production
- PostgreSQL comes from Render through `DATABASE_URL`
- Stripe Checkout + signed webhooks stay on backend
- paid orders persist only after webhook confirmation
- email notifications send through SMTP service
- health endpoint available at `/health` and `/api/v1/health`

## Repo structure

```text
frontend/
  src/
  package.json
backend/
  alembic/
  app/
    api/routes/
    core/
    db/
    models/
    schemas/
    services/
  alembic.ini
  requirements.txt
  run.py
Dockerfile
.dockerignore
render.yaml
```

## Local setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env.example`

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_SUPPORT_EMAIL=atelier@butakeando.test
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic -c alembic.ini upgrade head
python run.py
```

Useful local alternative:

- set `AUTO_CREATE_TABLES=true` in `backend/.env` if you want fast SQLite boot while iterating

## Backend env

Copy `backend/.env.example` to `backend/.env`.

Main variables:

- `PORT`
- `DATABASE_URL`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_API_VERSION`
- `ORDER_NOTIFICATION_EMAIL`
- `EMAIL_FROM`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

Recommended local example:

```bash
APP_NAME=ButaKeando API
APP_ENV=development
API_PREFIX=/api/v1
HOST=0.0.0.0
PORT=8000
WEB_CONCURRENCY=1
FRONTEND_URL=http://127.0.0.1:5173
CORS_ALLOW_ORIGINS=http://127.0.0.1:5173
SERVE_FRONTEND=false
FRONTEND_DIST_PATH=../frontend/dist
DATABASE_URL=sqlite:///./butakeando.db
AUTO_CREATE_TABLES=true
STRIPE_SECRET_KEY=replace-with-your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=replace-with-your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=replace-with-your-stripe-webhook-secret
STRIPE_API_VERSION=2026-02-25.clover
ORDER_NOTIFICATION_EMAIL=owner@example.com
EMAIL_FROM=orders@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_STARTTLS=true
SMTP_SSL=false
LOG_LEVEL=INFO
```

## Render deploy

Recommended deploy path:

1. Push repo with `Dockerfile` and `render.yaml`.
2. In Render, create service from Blueprint or repo.
3. Render builds one Docker image for whole app.
4. Render provisions PostgreSQL from `render.yaml`.
5. Container starts with:

```bash
alembic -c alembic.ini upgrade head && python run.py
```

What Render uses here:

- `Dockerfile` builds frontend and backend in one image
- `render.yaml` wires web service + Postgres + health check
- `PORT` comes from Render automatically
- `RENDER_EXTERNAL_URL` works as fallback public URL for Stripe success/cancel redirects
- `FRONTEND_URL` can override public URL if you later use custom domain

### Render variables to set

These stay manual in dashboard because they are secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ORDER_NOTIFICATION_EMAIL`
- `EMAIL_FROM`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASSWORD`
- optional `FRONTEND_URL` if using custom domain
- optional `CORS_ALLOW_ORIGINS` if frontend is ever split again

These already come from blueprint/runtime:

- `DATABASE_URL` from Render Postgres
- `APP_ENV=production`
- `API_PREFIX=/api/v1`
- `SERVE_FRONTEND=true`
- `FRONTEND_DIST_PATH=/app/frontend/dist`
- `AUTO_CREATE_TABLES=false`

## PostgreSQL and migrations

Project now includes Alembic.

Important files:

- `backend/alembic.ini`
- `backend/alembic/env.py`
- `backend/alembic/versions/20260413_0001_initial_commerce_schema.py`

Local/manual migration commands:

```bash
cd backend
alembic -c alembic.ini upgrade head
alembic -c alembic.ini downgrade -1
```

In Render, migrations run automatically before app boot through Docker command.

## Frontend in production

Production choice is single web app:

- Vite builds frontend during Docker build
- compiled assets copied to `/app/frontend/dist`
- FastAPI mounts that folder and serves SPA fallback routes
- frontend uses `/api/v1` same-origin by default in production

This avoids separate Render services and simplifies Stripe success/cancel URLs.

## Stripe production notes

Stripe integration keeps recommended hosted Checkout flow:

- backend creates Checkout Session
- totals are recomputed on backend from trusted product catalog
- metadata carries customer + shipping context
- webhook signature validation is active
- final order persistence happens only from webhook
- webhook handler is idempotent by `stripe_session_id`

Main endpoints:

- `POST /api/v1/checkout/session`
- `POST /api/v1/webhooks/stripe`
- `GET /api/v1/orders/{reference}`

Local webhook forward:

```bash
stripe listen --forward-to http://127.0.0.1:8000/api/v1/webhooks/stripe
```

Render webhook URL:

```text
https://<your-render-domain>/api/v1/webhooks/stripe
```

When custom domain goes live, create webhook again in Stripe with final domain and update `STRIPE_WEBHOOK_SECRET`.

## Email production notes

Email service stays decoupled and environment-driven:

- SMTP config only via env vars
- send failures get logged
- email failure does not roll back paid order persistence
- successful send stamps `notification_sent_at`

Good testing option:

- Mailtrap or similar SMTP sandbox before real mailbox

## Health and logs

Health checks:

- `GET /health`
- `GET /api/v1/health`

Expected response shape:

```json
{
  "status": "ok",
  "environment": "production",
  "database": "ok",
  "serve_frontend": true,
  "stripe_configured": true,
  "email_configured": true
}
```

Logs:

- app logs go to stdout/stderr
- Render log stream shows startup, DB, Stripe, webhook, and email errors

Useful checks after deploy:

1. Open root URL and confirm storefront loads.
2. Open `/health` and confirm DB health.
3. Create checkout session from frontend.
4. Complete Stripe test payment.
5. Confirm webhook logs appear in Render.
6. Confirm order exists through `GET /api/v1/orders/{reference}`.
7. Confirm notification email arrives.

## Test purchase

Example API request:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/checkout/session ^
  -H "Content-Type: application/json" ^
  -d "{\"customer\":{\"full_name\":\"Jose Cabeza\",\"email\":\"jose@example.com\",\"phone\":\"600123123\"},\"shipping_address\":{\"address_line\":\"Calle Mayor 10\",\"city\":\"Sevilla\",\"postal_code\":\"41001\",\"province\":\"Sevilla\",\"country\":\"ES\"},\"comments\":\"Entrega por la tarde\",\"currency\":\"eur\",\"total\":1490,\"items\":[{\"product_id\":\"bernal-lounge-chair\",\"product_name\":\"Bernal Lounge Chair\",\"quantity\":1,\"unit_price\":1490}]}"
```

Expected response includes:

- `reference`
- `session_id`
- `checkout_url`

## Key files touched for Render

Backend/runtime:

- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/app/core/logging.py`
- `backend/app/db/session.py`
- `backend/app/web/spa.py`
- `backend/run.py`

DB/migrations:

- `backend/alembic.ini`
- `backend/alembic/`
- `backend/app/models/`

Deploy:

- `Dockerfile`
- `.dockerignore`
- `render.yaml`

Frontend:

- `frontend/src/lib/config.js`
- `frontend/src/lib/apiClient.js`
- `frontend/.env.example`

## Proprietary notice

This repository is private and proprietary. Keep secrets out of source control and use environment variables for sensitive configuration.
