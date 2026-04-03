import type { PortfolioCard } from "@/lib/contentful-portfolio";

/**
 * Unique image URLs for the detail modal carousel.
 * Prefers CMS `galleryUrls` (`images` field only) when present so the card thumbnail can differ.
 * Otherwise uses `image` + `images` (fallback / local data).
 */
export function getProjectGalleryUrls(project: Pick<PortfolioCard, "image" | "images" | "galleryUrls">): string[] {
  if (project.galleryUrls?.length) {
    return [...new Set(project.galleryUrls)];
  }
  const list = [project.image, ...(project.images ?? [])].filter(Boolean) as string[];
  return [...new Set(list)];
}
