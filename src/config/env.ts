/**
 * Client-side public environment. Values come from `NEXT_PUBLIC_*` (and, locally, from `VITE_*`
 * bridged in `next.config.ts` for migration from Vite).
 *
 * Vercel: use `NEXT_PUBLIC_*` only — `VITE_*` is not applied on the server build unless you add it.
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 */

function optionalTrim(v: string | undefined): string | undefined {
  if (v === undefined || v === "") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}

export const env = {
  web3formsAccessKey: optionalTrim(process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY),
  contentfulSpaceId: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID),
  contentfulAccessToken: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN),
  /** Owner name used to filter parent `experiences`/`portfolios` entries (default: aichannode). */
  contentfulOwnerName: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_OWNER_NAME),
  /** Optional: published parent `experiences` entry ID — skips name query when set. */
  contentfulExperiencesEntryId: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_EXPERIENCES_ENTRY_ID),
  /** Parent content type ID in Contentful (default: `experiences`). */
  contentfulCtExperiences: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_CT_EXPERIENCES),
  /** Optional: published parent `portfolios` entry ID — skips name query when set. */
  contentfulPortfoliosEntryId: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_PORTFOLIOS_ENTRY_ID),
  /** Parent content type ID in Contentful (default: `portfolios`). */
  contentfulCtPortfolios: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_CT_PORTFOLIOS),
  /** Optional: published `social` entry ID — skips name query when set. */
  contentfulSocialEntryId: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_SOCIAL_ENTRY_ID),
  /** Content type ID for the social profile (default: `social`). */
  contentfulCtSocial: optionalTrim(process.env.NEXT_PUBLIC_CONTENTFUL_CT_SOCIAL),
} as const;

export function isWeb3FormsConfigured(): boolean {
  return Boolean(env.web3formsAccessKey);
}
