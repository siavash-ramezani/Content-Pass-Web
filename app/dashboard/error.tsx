"use client";

export default function DashboardError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        <p>Something went wrong loading your dashboard. This is usually temporary.</p>
        <button
          onClick={() => retry()}
          className="mt-3 rounded border border-red-300 px-3 py-1.5 text-sm font-medium dark:border-red-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
