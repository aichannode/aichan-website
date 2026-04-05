import { useEffect, useMemo } from "react";
import { socialProfileFallback } from "@/data/social.fallback";
import { useSocialProfile } from "@/hooks/useSocialProfile";

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute("content", content);
}

function ensureMeta(attr: "name" | "property", key: string, content: string) {
  const sel = attr === "name" ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.querySelector(sel) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function formatTwitterSite(handle: string | undefined): string | undefined {
  const t = handle?.trim();
  if (!t) return undefined;
  return t.startsWith("@") ? t : `@${t}`;
}

/**
 * Syncs document title and meta tags with the social profile (Contentful or fallback).
 * SEO fields (`metaDescription`, `ogImage`, `twitterSite`) come from the same `social` entry when defined in Contentful.
 */
const SiteDocumentHead = () => {
  const { profile } = useSocialProfile();

  const fullname = profile.fullname?.trim() || socialProfileFallback.fullname!;
  const role = profile.role?.trim() || socialProfileFallback.role!;
  const title = `${fullname} | ${role}`;

  const description = useMemo(() => {
    const fromCms = profile.metaDescription?.trim();
    if (fromCms) return fromCms;
    return socialProfileFallback.metaDescription!.trim();
  }, [profile.metaDescription]);

  const ogImage = useMemo(() => {
    const fromCms = profile.ogImage?.trim();
    if (fromCms) return fromCms;
    return socialProfileFallback.ogImage!.trim();
  }, [profile.ogImage]);

  const twitterSite = useMemo(() => {
    const fromCms = formatTwitterSite(profile.twitterSite);
    if (fromCms) return fromCms;
    return formatTwitterSite(socialProfileFallback.twitterSite) ?? undefined;
  }, [profile.twitterSite]);

  useEffect(() => {
    document.title = title;

    setMetaContent('meta[name="author"]', fullname);
    ensureMeta("name", "description", description);

    ensureMeta("property", "og:title", title);
    ensureMeta("property", "og:description", description);
    ensureMeta("property", "og:image", ogImage);

    ensureMeta("name", "twitter:card", "summary_large_image");
    if (twitterSite) {
      ensureMeta("name", "twitter:site", twitterSite);
    }
    ensureMeta("name", "twitter:title", title);
    ensureMeta("name", "twitter:description", description);
    ensureMeta("name", "twitter:image", ogImage);
  }, [title, fullname, description, ogImage, twitterSite]);

  return null;
};

export default SiteDocumentHead;
