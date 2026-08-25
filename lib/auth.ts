import { cookies } from "next/headers";

/** Name of the HTTP-only cookie that stores the JWT (set by app/api/login/route.ts). */
export const AUTH_COOKIE_NAME = "cp_token";

/** Reads the JWT from the HTTP-only cookie. Server-side only (next/headers). */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}
