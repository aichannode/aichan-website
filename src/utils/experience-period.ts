/** Parsed range for two-line experience date labels in the UI. */
export type ExperiencePeriodSplit = { start: string; end: string };

/** Contentful / `Intl` style range: "Oct 2024 – Feb 2026" */
const RANGE_EN_DASH = " – ";
/** Fallback if the string uses ASCII hyphen + spaces */
const RANGE_HYPHEN = " - ";
const UNTIL_PREFIX = "until ";

function splitOnFirstDelimiter(text: string, delimiter: string): ExperiencePeriodSplit | null {
  const index = text.indexOf(delimiter);
  if (index === -1) return null;

  const start = text.slice(0, index).trim();
  const end = text.slice(index + delimiter.length).trim();
  if (!start || !end) return null;

  return { start, end };
}

export function splitExperiencePeriod(period: string): ExperiencePeriodSplit | null {
  const text = period.trim();
  if (!text || text === "—") return null;

  const enDashRange = splitOnFirstDelimiter(text, RANGE_EN_DASH);
  if (enDashRange) return enDashRange;

  const hyphenRange = splitOnFirstDelimiter(text, RANGE_HYPHEN);
  if (hyphenRange) return hyphenRange;

  if (text.toLowerCase().startsWith(UNTIL_PREFIX)) {
    const end = text.slice(UNTIL_PREFIX.length).trim();
    return end ? { start: "Until", end } : null;
  }

  return null;
}
