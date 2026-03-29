import { motion } from "framer-motion";
import type { PortfolioCard } from "@/lib/contentful-portfolio";

export type DisplayProject = PortfolioCard & { color?: string };

type ProjectCardProps = {
  project: DisplayProject;
  index: number;
  isInView: boolean;
  defaultGradient: string;
};

function isLiveProjectLink(url?: string) {
  return Boolean(url && (url.startsWith("http://") || url.startsWith("https://")));
}

export function ProjectCard({ project, index, isInView, defaultGradient }: ProjectCardProps) {
  const live = isLiveProjectLink(project.link);
  const gradient = project.color ?? defaultGradient;
  const shellClass = `h-40 flex items-center justify-center relative overflow-hidden shrink-0 ${
    project.image ? "" : `bg-gradient-to-br ${gradient}`
  }`;

  const body = (
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {(project.skills ?? []).map((tag) => (
          <span
            key={`${project.id}-${tag}`}
            className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const thumbnail = (
    <>
      {project.image ? (
        <>
          <img
            src={project.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${
              live ? "transition-transform duration-500 group-hover:scale-[1.03]" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors font-mono">
          {`0${index + 1}`}
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="group rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col"
    >
      {live ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          aria-label={`Open ${project.title}`}
        >
          <div className={`${shellClass} cursor-pointer`}>{thumbnail}</div>
          {body}
        </a>
      ) : (
        <>
          <div className={shellClass}>{thumbnail}</div>
          {body}
        </>
      )}
    </motion.div>
  );
}
