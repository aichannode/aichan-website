import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { ProjectsEmptyState } from "@/components/projects/ProjectsEmptyState";
import { ProjectCard, type DisplayProject } from "@/components/projects/ProjectCard";
import { ProjectsGridSkeleton } from "@/components/projects/ProjectsGridSkeleton";
import { PROJECTS_SECTION_SKELETON_COUNT } from "@/constants/projects-ui";
import { projectsFallback } from "@/data/projects.fallback";
import { usePortfolios } from "@/hooks/usePortfolios";
import { isContentfulConfigured } from "@/lib/contentful";

type ListSource = "cms" | "fallback" | "empty" | "loading";

const defaultGradient = "from-primary/20 to-accent/10";

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: cmsItems, isLoading, isError, isSuccess } = usePortfolios();

  const { projects, source } = useMemo((): { projects: DisplayProject[]; source: ListSource } => {
    if (!isContentfulConfigured()) {
      return { projects: projectsFallback, source: "fallback" };
    }
    if (isLoading) {
      return { projects: [], source: "loading" };
    }
    if (isError) {
      return { projects: projectsFallback, source: "fallback" };
    }
    if (isSuccess && cmsItems && cmsItems.length > 0) {
      return { projects: cmsItems, source: "cms" };
    }
    return { projects: [], source: "empty" };
  }, [cmsItems, isLoading, isError, isSuccess]);

  const showSkeleton = source === "loading";
  const skeletonKeys = useMemo(
    () => Array.from({ length: PROJECTS_SECTION_SKELETON_COUNT }, (_, i) => `project-skeleton-${i}`),
    [],
  );

  return (
    <section id="projects" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-mono text-sm tracking-wider uppercase">Projects</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-foreground">
            Featured <span className="gradient-text">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {showSkeleton && <ProjectsGridSkeleton keysList={skeletonKeys} />}

          {!showSkeleton && source === "empty" && <ProjectsEmptyState />}

          {!showSkeleton &&
            source !== "empty" &&
            projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isInView={isInView}
                defaultGradient={defaultGradient}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
