import { useEffect, useMemo, useState } from "react";
import type { DisplayProject } from "@/components/projects/project-types";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { getProjectGalleryUrls } from "@/utils/project-gallery";

const MEDIA_HEIGHT = "h-[min(26rem,48vh)]";

type ProjectModalMediaProps = {
  project: DisplayProject;
  gradientClass: string;
};

export function ProjectModalMedia({ project, gradientClass }: ProjectModalMediaProps) {
  const urls = useMemo(() => getProjectGalleryUrls(project), [project]);

  if (urls.length === 0) {
    return (
      <div
        className={cn(
          MEDIA_HEIGHT,
          "w-full shrink-0 bg-gradient-to-br",
          gradientClass,
        )}
      />
    );
  }

  if (urls.length === 1) {
    return (
      <div
        className={cn(
          MEDIA_HEIGHT,
          "relative w-full shrink-0 overflow-hidden bg-muted/10",
        )}
      >
        <img src={urls[0]} alt="" className="block h-full w-full object-cover object-center" />
      </div>
    );
  }

  return <ModalImageCarousel urls={urls} projectId={project.id} />;
}

function ModalImageCarousel({ urls, projectId }: { urls: string[]; projectId: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const sync = () => setCurrent(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <div className={cn(MEDIA_HEIGHT, "relative w-full shrink-0 bg-muted/10")}>
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="h-full w-full [&>div]:h-full">
        <CarouselContent className="-ml-0 h-full">
          {urls.map((src, idx) => (
            <CarouselItem key={`${projectId}-${idx}-${src}`} className="h-full basis-full pl-0">
              <img src={src} alt="" className="block h-full w-full object-cover object-center" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 border-border bg-background/95 text-foreground shadow-md hover:bg-background" />
        <CarouselNext className="right-2 top-1/2 z-10 h-9 w-9 -translate-y-1/2 border-border bg-background/95 text-foreground shadow-md hover:bg-background" />
      </Carousel>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-background/70 via-background/25 to-transparent pb-3 pt-8">
        <div className="pointer-events-auto flex items-center gap-2" role="tablist" aria-label="Slide indicators">
          {urls.map((_, i) => (
            <button
              key={`${projectId}-dot-${i}`}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Show image ${i + 1} of ${urls.length}`}
              className={cn(
                "size-2.5 shrink-0 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background/80",
                i === current
                  ? "bg-primary shadow-sm ring-2 ring-primary/40 ring-offset-2 ring-offset-background/90"
                  : "bg-background/90 ring-1 ring-border/80 hover:bg-muted hover:ring-border",
              )}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
