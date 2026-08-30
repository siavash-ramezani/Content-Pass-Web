function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div>
      <SkeletonBlock className="h-8 w-40" />

      <section className="mt-6">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="mt-3 h-16 w-full" />
      </section>

      <section className="mt-8">
        <SkeletonBlock className="h-4 w-24" />
        <div className="mt-3 flex flex-col gap-3">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </section>
    </div>
  );
}
