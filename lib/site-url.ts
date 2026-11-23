/**
 * Canonical site origin, used to resolve Open Graph, canonical and sitemap URLs.
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL, for an explicit override (e.g. a custom domain)
 *  2. VERCEL_PROJECT_PRODUCTION_URL, set by Vercel to the project's production domain
 *  3. VERCEL_URL, the per-deployment URL for preview builds
 *  4. localhost, for local development
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

/** The pages this project serves itself, for the sitemap. */
export const ROUTES = ["/", "/product", "/about"] as const;
