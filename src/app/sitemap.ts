import { MetadataRoute } from "next";
import { db } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const staticPages = [
    "", "about", "announcements", "blog", "activities", "teachers",
    "gallery", "results", "downloads", "calendar", "contact",
    "principal", "achievements", "honor-board", "regulations", "faq",
    "clubs", "departments", "parent-resources", "services",
  ];

  const locales = ["en", "ar"];

  const staticRoutes = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  try {
    const [announcements, articles, events] = await Promise.all([
      db.announcement.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.article.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      db.event.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const dynamicRoutes = locales.flatMap((locale) => [
      ...announcements.map((a) => ({
        url: `${baseUrl}/${locale}/announcements/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...articles.map((a) => ({
        url: `${baseUrl}/${locale}/blog/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...events.map((e) => ({
        url: `${baseUrl}/${locale}/activities/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]);

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
