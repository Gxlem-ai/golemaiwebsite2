import type { MetadataRoute } from "next";
import { ROUTES, siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return ROUTES.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
