import type { SocialProfile } from "@/lib/contentful-social";

/** Used when Contentful is off or returns no `social` entry. */
export const socialProfileFallback: SocialProfile = {
  id: "fallback-social",
  name: "fallback",
  fullname: "Hector Rosado",
  role: "Full-Stack & AI Engineer",
  metaDescription:
    "Hector Rosado — Full stack and AI engineer. End-to-end product work, APIs, and LLMs. Currently at RadCrew.",
  ogImage: "https://ibb.co/chy1bBC5",
  twitterSite: "@aichannode",
  phone: undefined,
  location: "Puerto Rico",
  email: "aichannode@gmail.com",
  linkedin: undefined,
  github: "https://github.com/aichannode",
  facebook: undefined,
  twitter: undefined,
  website: undefined,
};
