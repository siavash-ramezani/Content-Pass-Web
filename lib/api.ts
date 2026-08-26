import type {
  ApiCollection,
  ApiErrorBody,
  ApiResource,
  Content,
  LoginCredentials,
  LoginResponse,
  Plan,
  Subscription,
} from "@/types";

/**
 * Thrown for any non-2xx response so callers can `catch` a single, typed error
 * instead of branching on `res.ok` everywhere.
 */
export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env.local and set it to the backend API URL.",
    );
  }
  return url.replace(/\/$/, "");
}

/**
 * Base fetch wrapper: resolves the path against NEXT_PUBLIC_API_URL, sets JSON
 * headers, and throws an ApiError on non-2xx responses.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await res.json().catch(() => null)) as T | ApiErrorBody | null;

  if (!res.ok) {
    const errorBody = body as ApiErrorBody | null;
    throw new ApiError(
      errorBody?.message ?? `Request failed with status ${res.status}`,
      res.status,
      errorBody,
    );
  }

  return body as T;
}

/**
 * GET /content — the Day 6 content listing endpoint (Redis-cached on the backend).
 * Requires authentication; pass the caller's JWT to attach it as a Bearer token.
 * Without a valid token this throws an ApiError with status 401.
 */
export async function getContentList(token?: string): Promise<Content[]> {
  const result = await apiFetch<ApiCollection<Content>>("/content", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return result.data;
}

/**
 * POST /auth/login — exchanges email/password for a JWT.
 * Intended to be called server-side only (from app/api/login/route.ts), which
 * persists the returned token into an HTTP-only cookie.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/** GET /plans — public, no auth required. */
export async function getPlans(): Promise<Plan[]> {
  const result = await apiFetch<ApiCollection<Plan>>("/plans");
  return result.data;
}

/** POST /subscriptions — subscribes the caller to a plan. */
export async function subscribeToPlan(planId: number, token: string): Promise<Subscription> {
  const result = await apiFetch<ApiResource<Subscription>>("/subscriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ plan_id: planId }),
  });
  return result.data;
}

/** DELETE /subscriptions/current — cancels the caller's active subscription. */
export async function cancelSubscription(token: string): Promise<void> {
  await apiFetch<null>("/subscriptions/current", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * GET /subscriptions/current. Returns null when the user has no active
 * subscription (assumes the backend responds 404 in that case).
 */
export async function getCurrentSubscription(token: string): Promise<Subscription | null> {
  try {
    const result = await apiFetch<ApiResource<Subscription>>("/subscriptions/current", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
