import type { Entry, EntryCollection } from "contentful";
import { env } from "@/config/env";
import { getContentfulClient, isContentfulConfigured } from "@/lib/contentful";

/** Parent `experiences.name` value used for this portfolio owner. */
export const CONTENTFUL_OWNER_NAME = "aichannode";

/** Default content type API IDs — override with `VITE_CONTENTFUL_CT_EXPERIENCES` if yours differ. */
export const CONTENT_TYPE_EXPERIENCES = "experiences";

export type ExperienceCard = {
  id: string;
  role: string;
  company: string;
  period: string;
  current: boolean;
  summary: string;
};

/** Contentful often returns localized fields as `{ "en-US": value }` (or other locale keys). */
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

function readTextField(fields: Record<string, unknown>, key: string): string {
  return asString(fields[key]).trim();
}

function readDateField(fields: Record<string, unknown>, key: string): Date | null {
  const raw = readTextField(fields, key);
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

function buildPeriod(startDate: Date | null, endDate: Date | null): string {
  if (!startDate && !endDate) return "—";
  if (startDate && !endDate) return `${formatMonthYear(startDate)} – Present`;
  if (!startDate && endDate) return `Until ${formatMonthYear(endDate)}`;
  return `${formatMonthYear(startDate!)} – ${formatMonthYear(endDate!)}`;
}

function getEntryFields(entry: Entry): Record<string, unknown> {
  const raw = entry.fields as Record<string, unknown>;
  return raw ?? {};
}

function mapExperienceEntry(entry: Entry): ExperienceCard | null {
  const f = getEntryFields(entry);
  const role = readTextField(f, "role");
  const company = readTextField(f, "company");
  if (!role && !company) return null;

  const startDate = readDateField(f, "startDate");
  const endDate = readDateField(f, "endDate");

  return {
    id: entry.sys.id,
    role: role || "—",
    company: company || "—",
    period: buildPeriod(startDate, endDate),
    current: Boolean(startDate) && !endDate,
    summary: readTextField(f, "content") || "",
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

function resolveExperienceItems(parent: Entry, includes: EntryCollection<Entry>["includes"]): ExperienceCard[] {
  const raw = getItemsArray(parent);
  const byId = collectIncludedEntries(includes);
  const out: ExperienceCard[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Entry | { sys?: { id?: string; type?: string; linkType?: string } };

    if ("fields" in obj && obj.fields && typeof (obj as Entry).sys?.id === "string") {
      const card = mapExperienceEntry(obj as Entry);
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
    const card = mapExperienceEntry(linked);
    if (card) out.push(card);
  }

  return out;
}

function experiencesContentType(): string {
  return env.contentfulCtExperiences ?? CONTENT_TYPE_EXPERIENCES;
}

/**
 * Loads published `experiences` parent entry and resolves `items` → `experience` entries.
 *
 * - Prefer `VITE_CONTENTFUL_EXPERIENCES_ENTRY_ID` when set.
 * - Otherwise queries parent by `fields.name = aichannode` (plus localized attempts).
 */
export async function fetchExperiencesFromCms(): Promise<ExperienceCard[]> {
  if (!isContentfulConfigured()) {
    throw new Error("Contentful is not configured.");
  }

  const client = getContentfulClient();
  const ct = experiencesContentType();
  const entryId = env.contentfulExperiencesEntryId;

  if (entryId) {
    const res = (await client.getEntries({
      "sys.id": entryId,
      include: 10,
      limit: 1,
    })) as EntryCollection<Entry>;
    if (!res.items?.length) return [];
    return resolveExperienceItems(res.items[0], res.includes);
  }

  const attempts: Record<string, string>[] = [
    { "fields.name": CONTENTFUL_OWNER_NAME },
    { "fields.name.en-US": CONTENTFUL_OWNER_NAME },
    { "fields.name.en": CONTENTFUL_OWNER_NAME },
  ];

  for (const fieldQuery of attempts) {
    const res = (await client.getEntries({
      content_type: ct,
      ...fieldQuery,
      limit: 1,
      include: 10,
    })) as EntryCollection<Entry>;

    if (res.items?.length) {
      return resolveExperienceItems(res.items[0], res.includes);
    }
  }

  return [];
}
