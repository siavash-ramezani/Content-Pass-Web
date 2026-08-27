# syntax=docker/dockerfile:1
#
# Multi-stage build for the ContentPass Next.js frontend.
# Consumed by the sibling backend repo's docker-compose.yml, which builds this
# app from this repo as a sibling build context (see ../content-pass-web).

# ---- Base image, shared by the deps/builder/runner stages -----------------
FROM node:22-alpine AS base

# ---- Dependencies -----------------------------------------------------
FROM base AS deps
# glibc compatibility shim some native Node addons need on Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* variables are inlined into the client JS bundle at `next build`
# time — Next.js does not read them again at runtime, even though they look
# like ordinary env vars on the server. Passing NEXT_PUBLIC_API_URL as a
# `docker run -e` / compose `environment:` entry would be too late: the value
# is already compiled into the static bundle by then. It has to come in as a
# build ARG instead, which is what the backend repo's docker-compose.yml does.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# public/ isn't tracked in git while empty (git doesn't track empty
# directories), so a fresh clone of this repo may not have it on disk. Ensure
# it exists so the runner stage's COPY below never fails on a clean checkout.
RUN mkdir -p public

RUN npm run build

# ---- Run ----------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# `output: "standalone"` (next.config.ts) traces only the files the server
# needs and writes a minimal server.js; it does not include public/ or
# .next/static, so those are copied in explicitly.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Standalone output ships its own server.js — this is the standalone
# equivalent of `next start` (which would require the full node_modules tree
# this image deliberately doesn't have).
CMD ["node", "server.js"]
