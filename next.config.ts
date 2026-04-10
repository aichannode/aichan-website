import type { NextConfig } from "next";

/**
 * Next.js only embeds `NEXT_PUBLIC_*` in the browser bundle. Many projects still have
 * `VITE_*` keys from the old Vite setup — map them here so Contentful/Web3Forms work
 * without renaming every variable (restart `next dev` after changing `.env`).
 */
function clientPublicEnv(): Record<string, string> {
  const pick = (nextKey: string, viteKey: string) =>
    (process.env[nextKey]?.trim() || process.env[viteKey]?.trim() || "") as string;

  return {
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: pick(
      "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY",
      "VITE_WEB3FORMS_ACCESS_KEY",
    ),
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID: pick(
      "NEXT_PUBLIC_CONTENTFUL_SPACE_ID",
      "VITE_CONTENTFUL_SPACE_ID",
    ),
    NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: pick(
      "NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN",
      "VITE_CONTENTFUL_ACCESS_TOKEN",
    ),
    NEXT_PUBLIC_CONTENTFUL_OWNER_NAME: pick(
      "NEXT_PUBLIC_CONTENTFUL_OWNER_NAME",
      "VITE_CONTENTFUL_OWNER_NAME",
    ),
    NEXT_PUBLIC_CONTENTFUL_EXPERIENCES_ENTRY_ID: pick(
      "NEXT_PUBLIC_CONTENTFUL_EXPERIENCES_ENTRY_ID",
      "VITE_CONTENTFUL_EXPERIENCES_ENTRY_ID",
    ),
    NEXT_PUBLIC_CONTENTFUL_CT_EXPERIENCES: pick(
      "NEXT_PUBLIC_CONTENTFUL_CT_EXPERIENCES",
      "VITE_CONTENTFUL_CT_EXPERIENCES",
    ),
    NEXT_PUBLIC_CONTENTFUL_PORTFOLIOS_ENTRY_ID: pick(
      "NEXT_PUBLIC_CONTENTFUL_PORTFOLIOS_ENTRY_ID",
      "VITE_CONTENTFUL_PORTFOLIOS_ENTRY_ID",
    ),
    NEXT_PUBLIC_CONTENTFUL_CT_PORTFOLIOS: pick(
      "NEXT_PUBLIC_CONTENTFUL_CT_PORTFOLIOS",
      "VITE_CONTENTFUL_CT_PORTFOLIOS",
    ),
    NEXT_PUBLIC_CONTENTFUL_SOCIAL_ENTRY_ID: pick(
      "NEXT_PUBLIC_CONTENTFUL_SOCIAL_ENTRY_ID",
      "VITE_CONTENTFUL_SOCIAL_ENTRY_ID",
    ),
    NEXT_PUBLIC_CONTENTFUL_CT_SOCIAL: pick(
      "NEXT_PUBLIC_CONTENTFUL_CT_SOCIAL",
      "VITE_CONTENTFUL_CT_SOCIAL",
    ),
  };
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: clientPublicEnv(),
};

export default nextConfig;
