import { env } from "@/config/env";
import { requestContentfulGraphql } from "@/lib/contentful-graphql";

/** Parent `portfolios.name` value used for this portfolio owner. */
export const CONTENTFUL_PORTFOLIOS_OWNER_NAME = env.contentfulOwnerName ?? "aichannode";
export const CONTENT_TYPE_PORTFOLIOS = "portfolios";

export type PortfolioCard = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  /** Grid / card cover: CMS `thumbnail` when set, else first URL from `images` (or first entry in static fallback data). */
  image?: string;
  /** Remaining gallery URLs after the first (detail modal carousel). Omitted when only one asset. Used when `galleryUrls` is not set. */
  images?: string[];
  /**
   * Full list of modal carousel URLs from CMS `images` only.
   * When set (Contentful), the modal does not prepend the card thumbnail if that asset is separate from `images`.
   */
  galleryUrls?: string[];
  link?: string;
};

function toUrl(url: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

type GqlAsset = { url?: string | null } | null;

type GqlPortfolio = {
  sys: { id: string };
  title?: string | null;
  description?: string | null;
  skills?: Array<string | null> | null;
  link?: string | null;
  /** Contentful: field `thumbnail` — Media, single file (card cover; optional) */
  thumbnail?: GqlAsset;
  /** Contentful: field `images` — Media, many files */
  imagesCollection?: { items: Array<GqlAsset | null> } | null;
};

type GqlPortfoliosCollectionData = {
  [key: string]: {
    items: Array<{
      itemsCollection?: {
        items: Array<GqlPortfolio | null>;
      } | null;
    }>;
  };
};

function mapPortfolioItem(item: GqlPortfolio): PortfolioCard | null {
  const title = (item.title ?? "").trim();
  const description = (item.description ?? "").trim();
  if (!title && !description) return null;

  const galleryOrdered = [
    ...new Set(
      (item.imagesCollection?.items ?? [])
        .map((a) => toUrl((a?.url ?? "").trim()))
        .filter(Boolean) as string[],
    ),
  ];
  const thumbOnly = toUrl((item.thumbnail?.url ?? "").trim());
  const cardImage = thumbOnly || galleryOrdered[0];
  const galleryUrls =
    galleryOrdered.length > 0 ? galleryOrdered : thumbOnly ? [thumbOnly] : [];

  return {
    id: item.sys.id,
    title: title || "Untitled",
    description: description || "",
    skills: (item.skills ?? [])
      .map((v) => (v ?? "").trim())
      .filter(Boolean),
    image: cardImage,
    galleryUrls: galleryUrls.length ? galleryUrls : undefined,
    link: toUrl((item.link ?? "").trim()),
  };
}

function portfoliosContentType(): string {
  return env.contentfulCtPortfolios ?? CONTENT_TYPE_PORTFOLIOS;
}

export async function fetchPortfoliosFromCms(): Promise<PortfolioCard[]> {
  const ctSingle = portfoliosContentType();
  const ctCollection = `${portfoliosContentType()}Collection`;
  const entryId = env.contentfulPortfoliosEntryId;

  let rawItems: Array<GqlPortfolio | null> = [];

  if (entryId) {
    const queryById = `
      query PortfoliosById($entryId: String!) {
        ${ctSingle}(id: $entryId) {
          itemsCollection(limit: 50) {
            items {
              __typename
              ... on Portfolio {
                sys { id }
                title
                description
                link
                skills
                thumbnail {
                  url
                }
                imagesCollection(limit: 24) {
                  items {
                    url
                  }
                }
              }
            }
          }
        }
      }
    `;
    const data = await requestContentfulGraphql<Record<string, { itemsCollection?: { items: Array<GqlPortfolio | null> } | null } | null>>(
      queryById,
      { entryId },
    );
    rawItems = data[ctSingle]?.itemsCollection?.items ?? [];
  } else {
    const queryByName = `
      query PortfoliosByOwner($ownerName: String!) {
        ${ctCollection}(limit: 1, where: { name: $ownerName }) {
          items {
            itemsCollection(limit: 50) {
              items {
                __typename
                ... on Portfolio {
                  sys { id }
                  title
                  description
                  link
                  skills
                  thumbnail {
                    url
                  }
                  imagesCollection(limit: 24) {
                    items {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const data = await requestContentfulGraphql<GqlPortfoliosCollectionData>(queryByName, {
      ownerName: CONTENTFUL_PORTFOLIOS_OWNER_NAME,
    });
    const collection = data[ctCollection];
    if (!collection?.items?.length) return [];
    rawItems = collection.items[0]?.itemsCollection?.items ?? [];
  }

  return rawItems
    .filter((item): item is GqlPortfolio => Boolean(item?.sys?.id))
    .map((item) => mapPortfolioItem(item))
    .filter((item): item is PortfolioCard => Boolean(item));
}
