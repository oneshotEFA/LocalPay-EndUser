# LocalPay End User Deposit App

A Next.js 16 App Router frontend that lets end users complete LocalPay deposits after arriving from a secure checkout link.

## What this app does

- Authenticates users from a signed checkout token (`/deposit/[token]`)
- Creates an HTTP-only session cookie for secure in-app API access
- Guides users through a multi-step deposit flow:
  1. Select receiving bank/account
  2. Choose verification method (Link, Screenshot, SMS)
  3. Submit proof
  4. View result / retry when allowed
- Shows paginated deposit history
- Proxies sensitive backend calls to NestJS so browser clients never directly hold backend auth tokens
- Supports screenshot OCR verification through `sharp` + `tesseract.js`

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand (session-scoped persisted flow state)
- **Data fetching/cache:** TanStack Query
- **OCR:** sharp + tesseract.js

## Project structure

```text
src/
  app/
    api/
      auth/                 # session bootstrap + current user
      deposit/              # deposit submit + account + history proxy routes
      extract-screenshot/   # OCR endpoint
    deposit/                # entry, token landing, and portal pages
  components/
    deposit/                # step UI (bank, method, proof, result)
    history/                # history list/cards/pagination
  lib/
    api.ts                  # frontend API wrapper
    token.ts                # checkout token verification
    session.ts              # session JWT + cookies
    server/imageExtraction.ts # OCR pipeline
  store/
    deposit.store.ts        # deposit flow state machine
providers/
  QueryProvider.tsx
  ThemeProvider.tsx
scripts/
  test.ts                   # local checkout token generation test
```

## Main flow

1. External platform sends user to `/deposit/<token>`
2. App verifies token via `/api/auth/session`
3. Session JWT is issued and stored in an HTTP-only cookie (`hu-sid`)
4. User completes deposit steps in `/deposit/portal`
5. Deposit payload is sent to `/api/deposit`, which forwards to NestJS
6. If backend returns `successUrl`, user is redirected; otherwise result is shown in-app

## Environment variables

Create a `.env.local` file (or set environment variables in deployment):

```bash
SESSION_SECRET=your_session_signing_secret
URL_SECRET=your_checkout_token_signing_secret
NESTJS_API_URL=https://your-nest-api-base-url
NEXT_PUBLIC_APP_DOMAIN=https://your-enduser-app-domain
NEXT_PUBLIC_PARENT_APP_URL=https://your-main-platform-url
```

## Local development

```bash
npm ci
npm run dev
```

App runs on the default Next.js port unless overridden.

## Available scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run built app
- `npm run lint` – run linter (currently configured as `next lint`)
- `npm run test:script` – generate a sample checkout URL token (requires env vars)

## API routes in this app

- `POST /api/auth/session` – validate checkout token and set session cookie
- `DELETE /api/auth/session` – clear session
- `GET /api/auth/me` – get authenticated user
- `POST /api/deposit` – submit single deposit (proxy)
- `GET /api/deposit/receiving-account` – fetch receiving accounts (proxy)
- `GET /api/deposit/history` – fetch paginated deposit history (proxy)
- `POST /api/extract-screenshot` – OCR extraction from uploaded screenshot

## Notes

- Session cookie is `httpOnly`, `sameSite=strict`, and `secure` in production.
- Build output currently shows Next.js config deprecation warnings for moved config keys.
- `npm run test:script` will fail unless required env vars (especially `URL_SECRET`) are set.
