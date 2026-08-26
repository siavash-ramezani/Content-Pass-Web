import Link from "next/link";
import { redirect } from "next/navigation";
import { ApiError, getContentList, getCurrentSubscription } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import type { Content, Subscription } from "@/types";
import { cancelSubscriptionAction } from "./actions";

function ContentCard({ item }: { item: Content }) {
  return (
    <li
      className={
        item.accessible
          ? "rounded border border-zinc-200 p-4 dark:border-zinc-800"
          : "rounded border border-zinc-200 bg-zinc-50 p-4 opacity-60 dark:border-zinc-800 dark:bg-zinc-900"
      }
    >
      <h3 className="font-medium">{item.title}</h3>
      <p className="mt-1 text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
        {item.type}
        {!item.accessible && " · Locked"}
      </p>
    </li>
  );
}

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  const { subscribed } = await searchParams;

  let content: Content[];
  let subscription: Subscription | null;
  try {
    [content, subscription] = await Promise.all([
      getContentList(token),
      getCurrentSubscription(token),
    ]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  const accessible = content.filter((item) => item.accessible);
  const locked = content.filter((item) => !item.accessible);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {subscribed && (
        <p className="mt-4 rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          Subscribed successfully.
        </p>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Subscription
        </h2>
        {subscription ? (
          <div className="mt-3 flex items-center justify-between rounded border border-zinc-200 p-4 dark:border-zinc-800">
            <div>
              <p className="font-medium">{subscription.plan.name}</p>
              {subscription.renews_at && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Renews {new Date(subscription.renews_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <form action={cancelSubscriptionAction}>
              <button
                type="submit"
                className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 dark:border-red-800 dark:text-red-300"
              >
                Cancel subscription
              </button>
            </form>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            No active subscription.{" "}
            <Link href="/pricing" className="font-medium underline">
              View plans
            </Link>
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Accessible
        </h2>
        {accessible.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-3">
            {accessible.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">No accessible content.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Locked
        </h2>
        {locked.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-3">
            {locked.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">No locked content.</p>
        )}
      </section>
    </div>
  );
}
