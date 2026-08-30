import { NextResponse } from "next/server";
import { ApiError, login } from "@/lib/api";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  try {
    const { token } = await login({ email, password });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day — ideally derived from the JWT's own exp claim
    });
    return response;
  } catch (err) {
    // Client errors (wrong credentials, validation) are safe to show as-is.
    if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    // Anything else — backend 5xx, or unreachable entirely (status 0, see
    // lib/api.ts) — don't leak upstream internals; show a generic message.
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 502 },
    );
  }
}
