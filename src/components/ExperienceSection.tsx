import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { SectionPageTitle } from "@/components/SectionPageTitle";
import { EXPERIENCE_SECTION_SKELETON_COUNT } from "@/constants/experience-ui";
import { experiencesFallback } from "@/data/experiences.fallback";
import { useExperiences } from "@/hooks/useExperiences";
import { isContentfulConfigured } from "@/lib/contentful";
import type { ExperienceCard } from "@/lib/contentful-experience";
import { splitExperiencePeriod } from "@/utils/experience-period";

type ListSource = "cms" | "fallback" | "empty" | "loading";

function ExperiencePeriodLabel({ period }: { period: string }) {
  const split = splitExperiencePeriod(period);
  const textClass =
    "text-xs md:text-sm font-mono text-muted-foreground tabular-nums leading-tight transition-colors duration-500 group-hover:text-primary";
  if (split) {
    return (
      <span className={`${textClass} flex w-fit max-w-full flex-col items-start gap-0.5 text-left`}>
        <span>{split.start}-</span>
        <span>{split.end}</span>
      </span>
    );
  }
  return <span className={`${textClass} block w-fit max-w-full text-left`}>{period}</span>;
}

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: cmsItems, isLoading, isError, isSuccess } = useExperiences();

  const { experiences, source } = useMemo((): {
    experiences: ExperienceCard[];
    source: ListSource;
  } => {
    if (!isContentfulConfigured()) {
      return { experiences: experiencesFallback, source: "fallback" };
    }
    if (isLoading) {
      return { experiences: [], source: "loading" };
    }
    if (isError) {
      return { experiences: experiencesFallback, source: "fallback" };
    }
    if (isSuccess && cmsItems && cmsItems.length > 0) {
      return { experiences: cmsItems, source: "cms" };
    }
    return { experiences: [], source: "empty" };
  }, [cmsItems, isLoading, isError, isSuccess]);

  const showSkeleton = source === "loading";
  const skeletonKeys = useMemo(
    () => Array.from({ length: EXPERIENCE_SECTION_SKELETON_COUNT }, (_, i) => `experience-skeleton-${i}`),
    [],
  );

  return (
    <section id="experience" className="py-32 relative overflow-x-clip" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionPageTitle kicker="Experience">
            Career <span className="gradient-text">Journey</span>
          </SectionPageTitle>
        </motion.div>

        {/* Shift left so card column centers on viewport (matches fixed centered globe). Offset = date col + half gap = 12rem + 1rem */}
        <div className="max-w-5xl mx-auto relative md:-translate-x-[7rem]">
          {/* Continuous vertical timeline — dates sit to the left of this line */}
          <div
            className="pointer-events-none absolute left-[calc(12rem+theme(spacing.4))] top-2 bottom-8 w-px bg-border"
            aria-hidden
          />
          {showSkeleton &&
            skeletonKeys.map((key) => (
              <div
                key={key}
                className="relative grid grid-cols-[12rem_1fr] gap-x-8 pb-12 last:pb-0 animate-pulse"
              >
                <div className="flex w-full flex-col items-end gap-1 pt-1 pr-0">
                  <div className="h-3 w-16 bg-muted rounded shrink-0" />
                  <div className="h-3 w-14 bg-muted rounded shrink-0" />
                </div>
                <div className="relative min-w-0">
                  <div className="absolute top-3 left-[calc(-1*theme(spacing.8)/2)] -translate-x-1/2 w-3 h-3 rounded-full bg-muted border-2 border-border z-10" />
                  <div className="p-6 rounded-xl bg-card border border-border space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="h-5 bg-muted rounded w-40 max-w-[55%]" />
                      <div className="h-4 bg-muted/80 rounded w-28" />
                    </div>
                    <div className="h-16 bg-muted/60 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}

          {!showSkeleton && source === "empty" && (
            <p className="text-muted-foreground text-sm max-w-xl md:pl-[calc(12rem+theme(spacing.8))]">
              {process.env.NODE_ENV === "development" ? (
                <>
                  No experience entries returned from Contentful. Confirm the parent content type ID (default{" "}
                  <code className="font-mono text-xs">experiences</code>), field{" "}
                  <code className="font-mono text-xs">name</code> (or localized{" "}
                  <code className="font-mono text-xs">en-US</code>) is <code className="font-mono text-xs">aichannode</code>,{" "}
                  <code className="font-mono text-xs">items</code> references are published, or set{" "}
                  <code className="font-mono text-xs">NEXT_PUBLIC_CONTENTFUL_EXPERIENCES_ENTRY_ID</code>.
                </>
              ) : (
                <>Experience content will appear here once published in Contentful.</>
              )}
            </p>
          )}

          {!showSkeleton &&
            source !== "empty" &&
            experiences.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 28, x: -16 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{
                  once: false,
                  amount: 0.22,
                  margin: "0px 0px -70px 0px",
                }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid grid-cols-[12rem_1fr] gap-x-8 pb-12 last:pb-0 group"
              >
                <div className="flex w-full justify-end pt-1.5 pr-0">
                  <ExperiencePeriodLabel period={exp.period} />
                </div>
                <div className="relative min-w-0">
                  <div
                    className={`absolute top-3 left-[calc(-1*theme(spacing.8)/2)] -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-colors duration-300 z-10 ${exp.current
                      ? "bg-primary border-primary box-glow"
                      : "bg-background border-muted-foreground group-hover:border-primary"
                      }`}
                  />
                  <div className="p-6 rounded-xl bg-card border border-border transition-all duration-500 group-hover:border-primary/30">
                    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                      <span className="text-sm font-semibold text-primary">{exp.company}</span>
                      {exp.current && (
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{exp.summary}</p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
