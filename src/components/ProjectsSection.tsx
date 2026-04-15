import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SectionPageTitle } from "@/components/SectionPageTitle";
import { ProjectsEmptyState } from "@/components/projects/ProjectsEmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { DisplayProject } from "@/components/projects/project-types";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";
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
  const [detailProject, setDetailProject] = useState<DisplayProject | null>(null);
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
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <SectionPageTitle kicker="Projects">
            Featured <span className="gradient-text">Work</span>
          </SectionPageTitle>
        </motion.div>

        <ProjectDetailModal
          project={detailProject}
          open={detailProject !== null}
          onOpenChange={(open) => {
            if (!open) setDetailProject(null);
          }}
          fallbackGradient={defaultGradient}
        />

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
                onOpenDetails={setDetailProject}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
