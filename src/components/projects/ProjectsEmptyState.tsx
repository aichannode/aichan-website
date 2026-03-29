export function ProjectsEmptyState() {
  return (
    <p className="text-muted-foreground text-sm max-w-2xl md:col-span-2 lg:col-span-3">
      {import.meta.env.DEV ? (
        <>
          No portfolio entries returned from Contentful. Confirm parent content type{" "}
          <code className="font-mono text-xs">portfolios</code>, field{" "}
          <code className="font-mono text-xs">name</code> is{" "}
          <code className="font-mono text-xs">aichannode</code>, and referenced{" "}
          <code className="font-mono text-xs">portfolio</code> items are published.
        </>
      ) : (
        <>Featured work will appear here once published in Contentful.</>
      )}
    </p>
  );
}
