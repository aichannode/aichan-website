import { useQuery } from "@tanstack/react-query";
import { env } from "@/config/env";
import { CONTENTFUL_OWNER_NAME, fetchExperiencesFromCms } from "@/lib/contentful-experience";
import { isContentfulConfigured } from "@/lib/contentful";

export function useExperiences() {
  const cacheKey = env.contentfulExperiencesEntryId ?? CONTENTFUL_OWNER_NAME;

  return useQuery({
    queryKey: ["contentful", "experiences", cacheKey],
    queryFn: () => fetchExperiencesFromCms(),
    enabled: isContentfulConfigured(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
