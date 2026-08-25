import type { User } from "./user";

/** Request body for POST /auth/login. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Response body for POST /auth/login (Day 1 JWT auth endpoint).
 * Assumes a { token, user } shape — adjust if the backend's actual response differs.
 */
export interface LoginResponse {
  token: string;
  user: User;
}
