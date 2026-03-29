import type { Entry, EntryCollection } from "contentful";
import { env } from "@/config/env";
import { getContentfulClient, isContentfulConfigured } from "@/lib/contentful";

/** Parent `portfolios.name` value used for this portfolio owner. */
export const CONTENTFUL_PORTFOLIOS_OWNER_NAME = "aichannode";
export const CONTENT_TYPE_PORTFOLIOS = "portfolios";

export type PortfolioCard = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  image?: string;
  link?: string;
};

function unwrapLocale<T = unknown>(value: T): T | unknown {
  if (value == null) return value;
  if (typeof value !== "object" || Array.isArray(value)) return value;
  const o = value as Record<string, unknown>;
  const keys = Object.keys(o);
  if (keys.length === 0) return value;
  const localeLike = (k: string) => /^[a-z]{2}(-[A-Z]{2})?$/.test(k);
  if (!keys.every(localeLike)) return value;
  return (o["en-US"] ?? o["en"] ?? o[keys[0]]) as unknown;
}

function asString(v: unknown): string {
  const u = unwrapLocale(v);
  return typeof u === "string" ? u : u == null ? "" : String(u);
}

function toUrl(url: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return url;
}

function readTextField(fields: Record<string, unknown>, key: string): string {
  return asString(fields[key]).trim();
}

function readStringListField(fields: Record<string, unknown>, key: string): string[] {
  const raw = unwrapLocale(fields[key]);
  if (!Array.isArray(raw)) return [];
  return raw.map((v) => asString(v).trim()).filter(Boolean);
}

function getEntryFields(entry: Entry): Record<string, unknown> {
  const raw = entry.fields as Record<string, unknown>;
  return raw ?? {};
}

function readImageUrl(fields: Record<string, unknown>): string | undefined {
  const image = unwrapLocale(fields.image);
  if (!image || typeof image !== "object") return undefined;
  const imageEntry = image as { fields?: Record<string, unknown> };
  const imgFields = imageEntry.fields;
  if (!imgFields) return undefined;
  const file = unwrapLocale(imgFields.file);
  if (!file || typeof file !== "object") return undefined;
  const fileObj = file as { url?: unknown };
  return toUrl(asString(fileObj.url));
}

function mapPortfolioEntry(entry: Entry): PortfolioCard | null {
  const f = getEntryFields(entry);
  const title = readTextField(f, "title");
  const description = readTextField(f, "description");
  if (!title && !description) return null;
  return {
    id: entry.sys.id,
    title: title || "Untitled",
    description: description || "",
    skills: readStringListField(f, "skills"),
    image: readImageUrl(f),
    link: toUrl(readTextField(f, "link")),
  };
}

function collectIncludedEntries(includes: EntryCollection<Entry>["includes"]): Map<string, Entry> {
  const map = new Map<string, Entry>();
  if (!includes?.Entry?.length) return map;
  for (const e of includes.Entry) {
    if (e?.sys?.id) map.set(e.sys.id, e);
  }
  return map;
}

function getItemsArray(parent: Entry): unknown[] {
  const f = getEntryFields(parent);
  const raw = unwrapLocale(f.items);
  return Array.isArray(raw) ? raw : [];
}

function resolvePortfolioItems(parent: Entry, includes: EntryCollection<Entry>["includes"]): PortfolioCard[] {
  const raw = getItemsArray(parent);
  const byId = collectIncludedEntries(includes);
  const out: PortfolioCard[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Entry | { sys?: { id?: string; type?: string; linkType?: string } };

    if ("fields" in obj && obj.fields && typeof (obj as Entry).sys?.id === "string") {
      const card = mapPortfolioEntry(obj as Entry);
      if (card) out.push(card);
      continue;
    }

    const sys = obj.sys;
    const id =
      sys?.type === "Link" && sys.linkType === "Entry" && typeof sys.id === "string"
        ? sys.id
        : undefined;
    if (!id) continue;
    const linked = byId.get(id);
    if (!linked) continue;
    const card = mapPortfolioEntry(linked);
    if (card) out.push(card);
  }

  return out;
}

function portfoliosContentType(): string {
  return env.contentfulCtPortfolios ?? CONTENT_TYPE_PORTFOLIOS;
}

export async function fetchPortfoliosFromCms(): Promise<PortfolioCard[]> {
  if (!isContentfulConfigured()) {
    throw new Error("Contentful is not configured.");
  }

  const client = getContentfulClient();
  const ct = portfoliosContentType();
  const entryId = env.contentfulPortfoliosEntryId;

  if (entryId) {
    const res = (await client.getEntries({
      "sys.id": entryId,
      include: 10,
      limit: 1,
    })) as EntryCollection<Entry>;
    if (!res.items?.length) return [];
    return resolvePortfolioItems(res.items[0], res.includes);
  }

  const attempts: Record<string, string>[] = [
    { "fields.name": CONTENTFUL_PORTFOLIOS_OWNER_NAME },
    { "fields.name.en-US": CONTENTFUL_PORTFOLIOS_OWNER_NAME },
    { "fields.name.en": CONTENTFUL_PORTFOLIOS_OWNER_NAME },
  ];

  for (const fieldQuery of attempts) {
    const res = (await client.getEntries({
      content_type: ct,
      ...fieldQuery,
      limit: 1,
      include: 10,
    })) as EntryCollection<Entry>;

    if (res.items?.length) {
      return resolvePortfolioItems(res.items[0], res.includes);
    }
  }

  return [];
}
