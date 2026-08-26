"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, cancelSubscription } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export async function cancelSubscriptionAction() {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  try {
    await cancelSubscription(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  revalidatePath("/dashboard");
}
