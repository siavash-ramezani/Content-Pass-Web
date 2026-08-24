/**
 * Mirrors the Laravel backend's PlanResource.
 * Subscription tier that gates access to premium content.
 */
export interface Plan {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  billing_interval: "monthly" | "yearly";
  created_at: string;
  updated_at: string;
}
