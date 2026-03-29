type ProjectsGridSkeletonProps = {
  keysList: string[];
};

export function ProjectsGridSkeleton({ keysList }: ProjectsGridSkeletonProps) {
  return (
    <>
      {keysList.map((key) => (
        <div
          key={key}
          className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse"
        >
          <div className="h-40 bg-muted/70" />
          <div className="p-6 space-y-3">
            <div className="h-5 bg-muted rounded w-2/3" />
            <div className="h-12 bg-muted/70 rounded w-full" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-muted/60 rounded-md" />
              <div className="h-6 w-16 bg-muted/60 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
