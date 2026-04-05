import { env } from "@/config/env";
import { requestContentfulGraphql } from "@/lib/contentful-graphql";

/** Matches `social.name` in Contentful — defaults to `VITE_CONTENTFUL_OWNER_NAME`. */
export const CONTENTFUL_SOCIAL_NAME = env.contentfulOwnerName ?? "aichannode";

export const CONTENT_TYPE_SOCIAL = "social";

export type SocialProfile = {
  id: string;
  /** Entry title / lookup key */
  name: string;
  fullname?: string;
  role?: string;
  phone?: string;
  location?: string;
  /** `<meta name="description">`, Open Graph & Twitter description */
  metaDescription?: string;
  /** Absolute URL for `og:image` and `twitter:image` */
  ogImage?: string;
  /** Twitter @handle for `twitter:site` (with or without leading @) */
  twitterSite?: string;
  linkedin?: string;
  email?: string;
  github?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
};

function trim(s: string | null | undefined): string | undefined {
  const t = (s ?? "").trim();
  return t === "" ? undefined : t;
}

function toWebUrl(url: string): string {
  const u = url.trim();
  if (!u) return u;
  if (u.startsWith("mailto:") || u.startsWith("tel:")) return u;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("//")) return `https:${u}`;
  return `https://${u}`;
}

type GqlSocial = {
  sys: { id: string };
  name?: string | null;
  phone?: string | null;
  location?: string | null;
  fullname?: string | null;
  role?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  twitterSite?: string | null;
  linkedin?: string | null;
  email?: string | null;
  github?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  website?: string | null;
};

function mapSocialItem(item: GqlSocial): SocialProfile {
  return {
    id: item.sys.id,
    name: trim(item.name) ?? "—",
    fullname: trim(item.fullname),
    role: trim(item.role),
    metaDescription: trim(item.metaDescription),
    ogImage: trim(item.ogImage) ? toWebUrl(item.ogImage!.trim()) : undefined,
    twitterSite: trim(item.twitterSite),
    phone: trim(item.phone),
    location: trim(item.location),
    linkedin: trim(item.linkedin) ? toWebUrl(item.linkedin!.trim()) : undefined,
    email: trim(item.email),
    github: trim(item.github) ? toWebUrl(item.github!.trim()) : undefined,
    facebook: trim(item.facebook) ? toWebUrl(item.facebook!.trim()) : undefined,
    twitter: trim(item.twitter) ? toWebUrl(item.twitter!.trim()) : undefined,
    website: trim(item.website) ? toWebUrl(item.website!.trim()) : undefined,
  };
}

function socialContentType(): string {
  return env.contentfulCtSocial ?? CONTENT_TYPE_SOCIAL;
}

export async function fetchSocialFromCms(): Promise<SocialProfile | null> {
  const ct = socialContentType();
  const ctCollection = `${ct}Collection`;
  const entryId = env.contentfulSocialEntryId;
  const lookupName = CONTENTFUL_SOCIAL_NAME;

  if (entryId) {
    const queryById = `
      query SocialById($entryId: String!) {
        ${ct}(id: $entryId) {
          sys { id }
          name
          phone
          location
          fullname
          role
          metaDescription
          ogImage
          twitterSite
          linkedin
          email
          github
          facebook
          twitter
          website
        }
      }
    `;
    const data = await requestContentfulGraphql<Record<string, GqlSocial | null>>(queryById, { entryId });
    const item = data[ct];
    if (!item?.sys?.id) return null;
    return mapSocialItem(item);
  }

  const queryByName = `
    query SocialByName($name: String!) {
      ${ctCollection}(limit: 1, where: { name: $name }) {
        items {
          sys { id }
          name
          phone
          location
          fullname
          role
          metaDescription
          ogImage
          twitterSite
          linkedin
          email
          github
          facebook
          twitter
          website
        }
      }
    }
  `;
  const data = await requestContentfulGraphql<Record<string, { items: Array<GqlSocial | null> } | null>>(queryByName, {
    name: lookupName,
  });
  const items = data[ctCollection]?.items ?? [];
  const first = items.find((i): i is GqlSocial => Boolean(i?.sys?.id));
  if (!first) return null;
  return mapSocialItem(first);
}
