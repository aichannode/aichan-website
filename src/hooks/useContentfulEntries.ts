import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchEntries, isContentfulConfigured, type FetchEntriesParams } from "@/lib/contentful";

type UseContentfulEntriesOptions = Omit<FetchEntriesParams, "contentType"> & {
  contentType: string;
};

/**
 * Load Contentful entries for a content type via TanStack Query.
 * Query is disabled until Contentful env vars are set.
 */
export function useContentfulEntries(
  params: UseContentfulEntriesOptions,
  queryOptions?: Omit<UseQueryOptions<Awaited<ReturnType<typeof fetchEntries>>>, "queryKey" | "queryFn">,
) {
  const { contentType, ...rest } = params;

  return useQuery({
    queryKey: ["contentful", "entries", contentType, rest],
    queryFn: () => fetchEntries({ contentType, ...rest }),
    enabled: isContentfulConfigured() && Boolean(contentType),
    ...queryOptions,
  });
}
