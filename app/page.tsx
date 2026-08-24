import { ApiError, getContentList } from "@/lib/api";
import type { Content } from "@/types";

export default async function Home() {
  let content: Content[] | null = null;
  let error: Error | null = null;

  try {
    content = await getContentList();
  } catch (err) {
    error = err instanceof Error ? err : new Error("Unknown error");
  }

  if (error) {
    const isUnauthorized = error instanceof ApiError && error.status === 401;

    return (
      <div>
        <h1 className="text-2xl font-semibold">Content</h1>
        <p className="mt-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {isUnauthorized
            ? "Unauthorized — login required. Auth isn't wired up yet (coming Day 9), so this is expected for now."
            : `Failed to load content: ${error.message}`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Content</h1>
      {content && content.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-4">
          {content.map((item) => (
            <li key={item.id} className="rounded border border-zinc-200 p-4 dark:border-zinc-800">
              <h2 className="font-medium">{item.title}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.excerpt}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">No content found.</p>
      )}
    </div>
  );
}
