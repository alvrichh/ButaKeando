# AGENTS.md

## Project overview

ButaKeando is a private and proprietary e-commerce project focused on selling armchairs, sofas, and upholstered furniture.

The product should feel premium, modern, elegant, and trustworthy.
The visual direction is modern vintage, with a refined balance between clean layouts and warm luxury details.

This repository must be treated as a commercial client project.
Do not assume the code is open source.
Do not expose internal logic, credentials, or private assets.

---

## Final stack decision

### Frontend
- React
- Vite
- JavaScript
- SCSS

### Backend
- Python
- FastAPI

### Infra / deployment
- GitHub for source control
- Vercel for frontend deployment when appropriate
- Render or similar platform for backend deployment when needed
- Stripe may be integrated later
- Do not introduce Shopify-specific code unless explicitly requested

---

## Main product goals

- Build a native and maintainable storefront
- Keep the codebase clean, scalable, and realistic for a solo developer workflow
- Preserve a premium brand identity
- Prioritize reusable UI foundations from the beginning
- Avoid unnecessary complexity and dependency bloat

---

## Product scope and business flow

This project should start as a **simple payment-enabled storefront**, not as a complex logistics or operations platform.

### Main objective
Allow a customer to:
- view products
- open a product detail
- proceed to a simple checkout/payment flow
- submit shipping information
- complete payment
- trigger email notifications with order details

### Logistics model
Logistics and shipment handling will be managed manually by the business owner.
Do not build a complex shipping management system unless explicitly requested later.

### Required order flow
After a successful sale, the system should support sending email notifications containing at least:
- product sold
- shipping address
- customer details when available
- order amount
- order reference or identifier
- payment confirmation status

### Email expectations
At minimum, plan for:
- internal notification email to the store owner
- optional confirmation email to the customer

The internal notification email should be treated as a core requirement early in the architecture.

### Scope boundaries
At the beginning, avoid building:
- warehouse management
- courier integrations
- advanced admin dashboards
- inventory systems beyond what is necessary
- complex ERP-style workflows
- full logistics automation

Keep the commerce flow focused on:
- product presentation
- cart or purchase intent
- payment
- shipping form data
- email notification
- clean post-purchase flow

---

## Visual direction

The brand style is:

- modern vintage
- premium
- elegant
- calm
- professional
- slightly luxurious, without becoming flashy

### Primary colors
- Black
- Gold

### Supporting visual principles
- use dark surfaces carefully
- use gold as an accent, not as an overwhelming main fill
- keep strong contrast and readability
- prefer subtle depth over loud decoration
- favor clean spacing, refined borders, and soft shadows
- avoid overly cold corporate UI
- avoid playful or cheap-looking e-commerce patterns

### UI tone
The interface should feel like a curated furniture brand, not a generic marketplace.

Avoid:
- bright random colors
- excessive gradients
- childish UI patterns
- noisy animations
- cluttered layouts
- overly rounded toy-like components

Prefer:
- elegant cards
- restrained animations
- clean typography hierarchy
- balanced spacing
- premium call-to-action styling
- consistent section rhythm

---

## Initial implementation priorities

The project should begin by shaping a reusable frontend foundation.

### Priority order
1. set up the base React + Vite structure
2. establish global SCSS architecture and design tokens
3. create reusable layout primitives
4. create reusable card-based UI patterns
5. create reusable modal system
6. create reusable toast/notification system
7. scaffold core storefront pages
8. prepare API layer for future backend integration
9. prepare a simple payment and order-notification backend flow

Do not jump straight into complex business logic before the shared UI foundation exists.

---

## Required reusable UI foundations

These should be treated as core reusable pieces early in the project.

### Core reusable components
- Button
- Card
- Section container
- Page container
- Header
- Footer
- Product card
- Badge
- Input
- Select
- Textarea
- Modal
- Toast

### Modal requirements
Modals must be reusable and consistent.

Requirements:
- centralized open/close behavior
- reusable shell structure
- overlay + content separation
- close on overlay click when appropriate
- close on Escape when appropriate
- support title, body, actions, and optional icon/media
- support variants when needed without duplicating logic
- accessible markup and keyboard behavior
- easy to style with card-like premium appearance

### Toast requirements
Toasts must be reusable and consistent.

Requirements:
- centralized toast rendering
- support at least: success, error, info, warning
- stack cleanly without overlapping core UI
- auto-dismiss with sane default timing
- allow manual dismiss
- visually match the card system
- avoid loud or cheap-looking alert styling
- keep spacing, shadow, border, and typography consistent with the design system

### Card direction
Cards are a core visual language for this project.

Cards should feel:
- premium
- clean
- slightly elevated
- structured
- reusable across product listings, info blocks, modal bodies, and notifications

Avoid generic dashboard-looking cards unless the context requires it.

---

## Suggested frontend structure

Use this as the default structure unless the repository already defines a stronger pattern.

```bash
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── router.jsx
│   │   └── providers.jsx
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── feedback/
│   ├── features/
│   │   ├── home/
│   │   ├── catalog/
│   │   ├── product/
│   │   ├── checkout/
│   │   ├── order/
│   │   └── auth/
│   ├── lib/
│   │   ├── apiClient.js
│   │   ├── config.js
│   │   └── storage.js
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   │   ├── base/
│   │   ├── tokens/
│   │   ├── layout/
│   │   ├── components/
│   │   ├── utilities/
│   │   └── main.scss
│   └── constants/
├── index.html
├── package.json
└── vite.config.js
```

---

## Suggested backend structure

Keep the backend simple and focused on commerce actions.

```bash
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── health.py
│   │   │   ├── products.py
│   │   │   ├── checkout.py
│   │   │   ├── orders.py
│   │   │   └── webhooks.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── schemas/
│   ├── services/
│   │   ├── payment_service.py
│   │   ├── email_service.py
│   │   └── order_service.py
│   ├── main.py
│   └── dependencies.py
├── requirements.txt
└── .env.example
```

---

## Payment architecture guidance

The first payment implementation should be simple and reliable.

### Recommended direction
- use a hosted checkout flow for simplicity
- keep payment orchestration on the backend
- confirm payments through backend verification or webhooks
- do not trust the frontend alone for final payment state

### Initial payment goals
- create a checkout session for a product or cart
- collect shipping-related information
- receive payment success signal
- create a simple order record or order payload
- trigger internal email notification with order details
- optionally trigger customer confirmation email

### Payment constraints
Avoid building:
- overly custom payment UIs when a hosted checkout is sufficient
- complicated order management systems too early
- advanced discount engines or promotion systems unless requested
- multi-vendor marketplace behavior

---

## Email architecture guidance

Email notifications are a core business requirement.

### Minimum email data
Include at least:
- product name or ordered items
- total amount
- shipping address
- buyer email
- buyer name when available
- order reference
- payment status
- timestamp

### Email behavior
- internal sale notification should be considered required
- customer confirmation email can be implemented early if practical
- email templates should be structured and reusable
- keep email generation separate from route handlers

---

## SCSS architecture guidance

SCSS should be structured, predictable, and reusable.

### Recommended SCSS organization
- `styles/tokens/` for colors, spacing, typography, shadows, radius, z-index
- `styles/base/` for reset, base elements, body, typography rules
- `styles/layout/` for containers, grids, spacing helpers
- `styles/components/` for shared component styles
- `styles/utilities/` for small utility classes only when justified
- `styles/main.scss` as the main import entry

### Design token guidance
Create reusable tokens for:
- colors
- spacing
- font sizes
- border radius
- shadows
- transition timing
- z-index layers

Do not hardcode design values repeatedly across many files.

---

## Working style

- First inspect the existing repository structure before making changes
- Prefer small, safe, reversible changes
- Keep diffs focused on the requested task
- Reuse existing patterns before introducing new ones
- For non-trivial changes, explain the plan briefly before editing
- When something is ambiguous, choose the simplest implementation that fits the current codebase
- Do not refactor unrelated areas without a strong reason

---

## Repository rules

- Treat this repository as private and proprietary
- Do not remove or weaken proprietary notices or ownership wording
- Do not hardcode secrets, API keys, or credentials
- Use environment variables for configuration
- Do not add analytics, telemetry, or third-party SDKs unless explicitly requested
- Avoid heavy dependencies when native React or lightweight utilities are enough
- Prefer maintainable code over clever abstractions

---

## Frontend engineering guidance

- Use React functional components
- Keep components focused and readable
- Prefer one component per file unless there is a strong reason not to
- Keep reusable UI in `components/`
- Keep business-domain logic grouped in `features/`
- Keep API calls separated from presentation logic
- Lift state only when necessary
- Avoid premature global state solutions unless the project clearly needs them
- Do not introduce TypeScript unless explicitly requested
- Do not introduce a UI library unless explicitly requested

---

## Backend guidance

- Keep FastAPI routes thin
- Put business logic in services or clearly separated modules
- Keep configuration centralized
- Validate inputs carefully
- Prepare the backend to support product catalog, checkout, email notifications, and future payment integration
- Avoid premature complexity

---

## Quality bar

A task is not done until:
- the requested behavior is implemented
- the relevant files remain consistent with the project structure
- no unrelated code was changed unnecessarily
- the solution matches the project's visual and architectural direction
- basic verification was considered
- documentation is updated when setup or behavior changes

---

## Verification workflow

Before finishing work:
- inspect the files you changed
- run the narrowest relevant verification available
- check for obvious regressions
- summarize what changed in plain language

When relevant:
- for frontend changes, verify the Vite dev server or production build
- for backend changes, verify app startup and affected endpoints
- for reusable UI work, verify consistency across more than one use case
- for checkout/payment work, verify end-to-end success and failure paths
- for email-related work, verify payload shape and template rendering
- for docs changes, verify formatting and clarity

---

## Commands

Use only commands that match the actual repository contents.

### Frontend
```bash
cd frontend
npm install
npm run dev
npm run build
npm run preview
```

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Before running any command:
- inspect `package.json`, `requirements.txt`, and the repository structure
- do not assume scripts exist if they are not defined
- prefer the minimum command needed to validate the requested change

---

## What to build first

When starting to shape the project, prioritize this order:

1. base app shell
2. global styles and tokens
3. layout primitives
4. card component system
5. modal component system
6. toast component system
7. homepage structure
8. product detail scaffolding
9. simple checkout scaffolding
10. backend payment and email notification flow

Do not start with admin-like complexity unless explicitly requested.

---

## What to avoid by default

- large refactors without need
- introducing Next.js or another major stack shift unless explicitly requested
- fake production-ready integrations
- placeholder code presented as final
- excessive folder nesting without benefit
- mixing all logic into a generic `js/` folder
- overcomplicated animation systems
- building logistics systems too early
- changing the brand direction without being asked

---

## Response expectations

When completing a task:
- summarize what changed
- mention assumptions
- mention verification performed
- mention the next directly useful step only when relevant
