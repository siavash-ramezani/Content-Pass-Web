# ContentPass Web

Next.js frontend for the ContentPass API — a subscription content platform. This app consumes
the ContentPass Laravel API over HTTP; it does not include or depend on the backend's source code.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for linting/formatting
- Native `fetch` for API calls (no HTTP client library)

## Project structure

```
app/         Routes (App Router) — layouts, pages
lib/         Shared utilities, including the API client (lib/api.ts)
components/  Reusable UI components
types/       Shared TypeScript types mirroring the backend's API Resources
```

## Setup

1. Clone the repo:
   ```bash
   git clone <this-repo-url>
   cd content-pass-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example env file and point it at your backend:
   ```bash
   cp .env.example .env.local
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
   The app runs at [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run lint`, `npm run format` (writes), `npm run format:check`.

## Backend dependency

This app depends on the **ContentPass Laravel API** running separately. `NEXT_PUBLIC_API_URL`
in `.env.local` should point at it — the default in `.env.example` assumes it's running locally
on port 8000 (e.g. via `php artisan serve` or Laravel Sail), at `http://localhost:8000/api/v1`.

The backend is a separate repository and isn't included here.

> **Note:** most endpoints (e.g. `GET /content`) require a valid JWT. Log in at `/login` first
> (an account must already exist on the backend — there's no registration UI yet) to reach
> `/dashboard`, which fetches content server-side with that token attached.

## Docker

This repo has a `Dockerfile` (multi-stage, using Next.js `output: "standalone"` for a lean
production image) and a `.dockerignore`. It's not meant to be built standalone day-to-day —
the **ContentPass backend repo**'s `docker-compose.yml` builds this app from this repo as a
sibling build context alongside the Laravel API and its other services, and runs it on port 3000.

The one thing to know when building manually: `NEXT_PUBLIC_API_URL` has to be passed as a Docker
**build** argument, not a runtime environment variable. Next.js inlines `NEXT_PUBLIC_*` variables
into the client JS bundle during `next build`; setting it only at `docker run` / container-start
time is too late — the value is already baked into the compiled bundle by then.

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 -t content-pass-web .
docker run -p 3000:3000 content-pass-web
```

## Auth & token storage

Login (`/login`) posts credentials to a Route Handler (`app/api/login/route.ts`), which calls
the backend's `POST /auth/login` and stores the returned JWT in an **HTTP-only cookie** —
not `localStorage`. Two reasons:

- The dashboard (`/dashboard`) is a Server Component that reads the token via `next/headers`
  and fetches content server-side (true SSR, no client-side loading spinner); `localStorage`
  isn't available on the server, so the token has to live somewhere the server can read it.
- HTTP-only cookies aren't reachable from JavaScript, which limits exposure to XSS compared
  to `localStorage`.

This is intentionally minimal: just enough to unblock SSR data fetching. There's no
registration UI, password reset, refresh-token handling, logout, or protected-route
middleware yet — those are later days.

## Roadmap

- [x] Auth: minimal login UI, HTTP-only cookie JWT storage, authenticated API requests
      (full auth UX — registration, logout, password reset, protected-route middleware —
      still planned)
- [x] SSR content pages — dashboard (`/dashboard`)
- [x] Pricing page + mock subscribe/cancel flow (`/pricing`, Server Actions calling the
      subscriptions API) — functional, not visually polished; no real payment processor
- [ ] Subscriber dashboard polish (detail pages, richer content views)
- [ ] Admin UI
