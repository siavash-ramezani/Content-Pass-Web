import { redirect } from "next/navigation";
import { ApiError, getContentList } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import type { Content } from "@/types";

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

export default async function DashboardPage() {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  let content: Content[];
  try {
    content = await getContentList(token);
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

      <section className="mt-6">
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
