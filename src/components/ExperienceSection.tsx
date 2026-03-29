import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { EXPERIENCE_SECTION_SKELETON_COUNT } from "@/constants/experience-ui";
import { experiencesFallback } from "@/data/experiences.fallback";
import { useExperiences } from "@/hooks/useExperiences";
import { isContentfulConfigured } from "@/lib/contentful";
import type { ExperienceCard } from "@/lib/contentful-experience";

type ListSource = "cms" | "fallback" | "empty" | "loading";

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
    <section id="experience" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Experience</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            Career <span className="gradient-text">Journey</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-0">
          {showSkeleton &&
            skeletonKeys.map((key) => (
              <div
                key={key}
                className="relative pl-8 pb-12 last:pb-0 border-l border-border animate-pulse"
              >
                <div className="absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-[7px] bg-muted" />
                <div className="p-6 rounded-xl bg-card border border-border space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted/80 rounded w-1/2" />
                  <div className="h-16 bg-muted/60 rounded w-full" />
                </div>
              </div>
            ))}

          {!showSkeleton && source === "empty" && (
            <p className="text-muted-foreground text-sm pl-8 max-w-xl">
              {import.meta.env.DEV ? (
                <>
                  No experience entries returned from Contentful. Confirm the parent content type ID (default{" "}
                  <code className="font-mono text-xs">experiences</code>), field{" "}
                  <code className="font-mono text-xs">name</code> (or localized{" "}
                  <code className="font-mono text-xs">en-US</code>) is <code className="font-mono text-xs">aichannode</code>,{" "}
                  <code className="font-mono text-xs">items</code> references are published, or set{" "}
                  <code className="font-mono text-xs">VITE_CONTENTFUL_EXPERIENCES_ENTRY_ID</code>.
                </>
              ) : (
                <>Experience content will appear here once published in Contentful.</>
              )}
            </p>
          )}

          {!showSkeleton &&
            source !== "empty" &&
            experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="relative pl-8 pb-12 last:pb-0 border-l border-border group"
              >
                <div
                  className={`absolute left-0 top-1 w-3 h-3 rounded-full -translate-x-[7px] border-2 transition-colors duration-300 ${
                    exp.current
                      ? "bg-primary border-primary box-glow"
                      : "bg-background border-muted-foreground group-hover:border-primary"
                  }`}
                />

                <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-500">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                    {exp.current && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-primary font-semibold text-sm">{exp.company}</span>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-muted-foreground text-sm font-mono">{exp.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{exp.summary}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
