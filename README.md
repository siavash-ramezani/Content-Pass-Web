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

> **Note:** most endpoints (e.g. `GET /content`) require a valid JWT. Auth isn't wired up in the
> frontend yet, so calls to protected endpoints will currently return 401 — this is expected
> until login is implemented (see Roadmap).

## Roadmap

- [ ] Auth: login UI, JWT storage, authenticated API requests
- [ ] SSR content pages (list + detail)
- [ ] Subscriber dashboard
- [ ] Pricing page + plan selection
