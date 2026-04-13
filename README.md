# ButaKeando

Private commercial storefront for premium armchairs, sofas, and upholstered furniture.

## Stack

### Frontend
- React
- Vite
- JavaScript
- SCSS

### Backend
- FastAPI
- Python

## Current foundation

- premium black and gold design tokens
- reusable layout, card, modal, and toast systems
- scaffolded home, catalog, product, checkout, and order-success pages
- sample product catalog for early storefront flow
- backend routes for health, products, checkout, orders, and payment webhooks
- mock payment session plus internal sale email payload builder for early integration work

## Structure

```text
frontend/
  src/
    app/
    components/
    features/
    lib/
    styles/
    constants/
backend/
  app/
    api/routes/
    core/
    schemas/
    services/
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend environment values live in `frontend/.env.example`.

## Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend environment values live in `backend/.env.example`.

## API notes

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/{slug}`
- `POST /api/checkout/sessions`
- `POST /api/checkout/confirm/{reference}`
- `GET /api/orders/{reference}`
- `POST /api/webhooks/payment`

Webhook route expects `x-webhook-secret` header matching `WEBHOOK_SECRET`.

## Product direction

- simple payment-enabled storefront
- shipping details captured during checkout
- internal owner notification treated as core requirement
- manual logistics outside platform scope for first release

## Proprietary notice

This repository is private and proprietary. Keep secrets out of source control and use environment variables for sensitive configuration.
