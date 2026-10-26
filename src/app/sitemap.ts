import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }> = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/contribute", priority: 0.9, changeFrequency: "weekly" },
    { path: "/reglement", priority: 0.7, changeFrequency: "monthly" },
    { path: "/resultats", priority: 0.6, changeFrequency: "daily" },
    { path: "/mentions-legales", priority: 0.3, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${SITE.baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
