import Link from "next/link";
import { getCurrentSubscription, getPlans } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { subscribeAction } from "./actions";

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export default async function PricingPage({ searchParams }: PageProps<"/pricing">) {
  const [{ error }, token, plans] = await Promise.all([searchParams, getAuthToken(), getPlans()]);

  let currentPlanId: number | null = null;
  if (token) {
    try {
      const subscription = await getCurrentSubscription(token);
      currentPlanId = subscription?.plan.id ?? null;
    } catch {
      currentPlanId = null;
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Pricing</h1>

      {error && (
        <p className="mt-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;

          return (
            <li
              key={plan.id}
              className="flex flex-col rounded border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-1 text-2xl font-semibold">
                {formatPrice(plan.price, plan.currency)}
                <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                  {" "}
                  / {plan.billing_interval}
                </span>
              </p>
              <ul className="mt-4 flex-1 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>

              {isCurrent ? (
                <span className="mt-6 rounded bg-zinc-100 px-4 py-2 text-center text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  Current plan
                </span>
              ) : token ? (
                <form action={subscribeAction} className="mt-6">
                  <input type="hidden" name="planId" value={plan.id} />
                  <button
                    type="submit"
                    className="w-full rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="mt-6 block rounded bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  Subscribe
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
