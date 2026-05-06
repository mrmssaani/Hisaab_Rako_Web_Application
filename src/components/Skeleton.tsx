export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-muted rounded-md animate-pulse ${className}`} />
  );
}

export function CustomerSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 bg-surface rounded-md shadow-card">
      <SkeletonBlock className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
      <SkeletonBlock className="h-5 w-16" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-32 w-full rounded-md" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-20 rounded-md" />
        <SkeletonBlock className="h-20 rounded-md" />
      </div>
      <SkeletonBlock className="h-40 rounded-md" />
    </div>
  );
}
