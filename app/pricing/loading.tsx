function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${className}`} />;
}

export default function PricingLoading() {
  return (
    <div>
      <SkeletonBlock className="h-8 w-32" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="mt-2 h-8 w-24" />
            <SkeletonBlock className="mt-4 h-4 w-full" />
            <SkeletonBlock className="mt-2 h-4 w-3/4" />
            <SkeletonBlock className="mt-6 h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
