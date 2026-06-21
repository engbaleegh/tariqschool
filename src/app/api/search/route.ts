import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`search:${ip}`, 30, 60_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const locale = searchParams.get("locale") ?? "en";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = { contains: q, mode: "insensitive" as const };

  const [announcements, articles, events, teachers] = await Promise.all([
    db.announcement.findMany({
      where: { isPublished: true, OR: [{ title: searchTerm }, { titleAr: searchTerm }] },
      take: 5,
      select: { id: true, title: true, titleAr: true, slug: true },
    }),
    db.article.findMany({
      where: { isPublished: true, OR: [{ title: searchTerm }, { titleAr: searchTerm }] },
      take: 5,
      select: { id: true, title: true, titleAr: true, slug: true },
    }),
    db.event.findMany({
      where: { isPublished: true, OR: [{ title: searchTerm }, { titleAr: searchTerm }] },
      take: 5,
      select: { id: true, title: true, titleAr: true, slug: true },
    }),
    db.teacher.findMany({
      where: { isActive: true, OR: [{ fullName: searchTerm }, { fullNameAr: searchTerm }] },
      take: 5,
      select: { id: true, fullName: true, fullNameAr: true },
    }),
  ]);

  return NextResponse.json({
    results: {
      announcements: announcements.map((a) => ({
        ...a,
        type: "announcement",
        href: `/${locale}/announcements/${a.slug}`,
      })),
      articles: articles.map((a) => ({
        ...a,
        type: "article",
        href: `/${locale}/blog/${a.slug}`,
      })),
      events: events.map((e) => ({
        ...e,
        type: "event",
        href: `/${locale}/activities/${e.slug}`,
      })),
      teachers: teachers.map((t) => ({
        ...t,
        type: "teacher",
        href: `/${locale}/teachers#${t.id}`,
      })),
    },
  });
}
