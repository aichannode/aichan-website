import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionPageTitleProps = {
  /** Small mono label above the heading (e.g. "Experience"). */
  kicker: string;
  /** Main heading content; use `<span className="gradient-text">` for accent words. */
  children: ReactNode;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Bottom margin for the `h2` (section spacing below the title). */
  headingSpacingClassName?: string;
};

export function SectionPageTitle({
  kicker,
  children,
  className,
  headingSpacingClassName = "mb-16",
}: SectionPageTitleProps) {
  return (
    <div className={cn(className)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px w-12 bg-primary" aria-hidden />
        <span className="title-glow-sm font-mono text-sm uppercase tracking-wider text-primary">{kicker}</span>
      </div>
      <h2 className={cn("title-glow text-3xl font-bold text-foreground md:text-5xl", headingSpacingClassName)}>
        {children}
      </h2>
    </div>
  );
}
