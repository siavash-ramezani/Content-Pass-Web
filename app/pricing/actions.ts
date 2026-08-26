"use server";

import { redirect } from "next/navigation";
import { ApiError, subscribeToPlan } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export async function subscribeAction(formData: FormData) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  const planId = Number(formData.get("planId"));

  try {
    await subscribeToPlan(planId, token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    const message =
      err instanceof ApiError ? err.message : "Subscription failed. Please try again.";
    redirect(`/pricing?error=${encodeURIComponent(message)}`);
  }

  redirect("/dashboard?subscribed=1");
}
