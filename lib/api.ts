import type {
  ApiCollection,
  ApiErrorBody,
  Content,
  LoginCredentials,
  LoginResponse,
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
