"use server";

import { redirect } from "next/navigation";
import { ApiError, getCurrentSubscription, subscribeToPlan } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export async function subscribeAction(formData: FormData) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  const planId = Number(formData.get("planId"));

  // Render-time gating (hiding the Subscribe button for the user's current
  // plan) isn't a security boundary — this action is reachable by a direct
  // POST, so check again server-side rather than trusting the UI state.
  let alreadySubscribed = false;
  try {
    const current = await getCurrentSubscription(token);
    alreadySubscribed = current?.plan.id === planId;

    if (!alreadySubscribed) {
      await subscribeToPlan(planId, token);
    }
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    const message =
      err instanceof ApiError ? err.message : "Subscription failed. Please try again.";
    redirect(`/pricing?error=${encodeURIComponent(message)}`);
  }

  if (alreadySubscribed) {
    redirect(`/pricing?error=${encodeURIComponent("You're already subscribed to this plan.")}`);
  }

  redirect("/dashboard?subscribed=1");
}
