import "server-only";

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 64);
}

export function withSuffix(base: string, suffix: string): string {
  const sanitized = suffix.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  const joined = `${base}-${sanitized}`;
  return joined.slice(0, 64);
}
