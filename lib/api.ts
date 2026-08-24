import type { ApiCollection, ApiErrorBody, Content } from "@/types";

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
 *
 * No auth token handling yet — that lands with login (Day 9). Endpoints that
 * require authentication (e.g. GET /content) will 401 until then; that's expected.
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
 * This endpoint requires authentication, so until auth is wired up (Day 9) this
 * call is expected to throw an ApiError with status 401.
 */
export async function getContentList(): Promise<Content[]> {
  const result = await apiFetch<ApiCollection<Content>>("/content");
  return result.data;
}
