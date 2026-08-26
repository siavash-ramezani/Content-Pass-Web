import type { Plan } from "./plan";

export type SubscriptionStatus = "active" | "cancelled";

/**
 * Mirrors the Laravel backend's SubscriptionResource
 * (GET /subscriptions/current, POST /subscriptions).
 * Assumes a nested `plan` and a `renews_at` timestamp — verify against the actual backend shape.
 */
export interface Subscription {
  id: number;
  plan: Plan;
  status: SubscriptionStatus;
  renews_at: string | null;
  created_at: string;
  updated_at: string;
}
