import { db } from "@/lib/prisma";
import { getAllLocalTeachers } from "@/lib/local-teachers";
import { getLocalPublishedResults } from "@/lib/local-results";
import type { LocalizedItem } from "@/constants/public-content";
import {
  announcements as fallbackAnnouncements,
  blogPosts as fallbackBlogPosts,
  activities as fallbackActivities,
  teachers as fallbackTeachers,
  galleryAlbums as fallbackGalleryAlbums,
  downloads as fallbackDownloads,
  calendarEventsPlaceholder,
  achievementsPlaceholder,
  honorStudentsPlaceholder,
  regulationsPlaceholder,
  clubsPlaceholder,
  departmentsPlaceholder,
  parentResourcesPlaceholder,
  servicesPlaceholder,
  faqItems,
} from "@/constants/public-content";

export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getPublishedAnnouncements(): Promise<LocalizedItem[]> {
  return safeQuery(async () => {
    const rows = await db.announcement.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    });
    if (!rows.length) return fallbackAnnouncements;
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      titleAr: row.titleAr ?? row.title,
      excerpt: row.excerpt ?? row.content.slice(0, 120),
      excerptAr: row.excerptAr ?? row.contentAr?.slice(0, 120) ?? row.excerpt ?? "",
      date: row.publishedAt?.toISOString().split("T")[0] ?? row.createdAt.toISOString().split("T")[0],
      category: row.category?.name,
      categoryAr: row.category?.nameAr ?? row.category?.name,
    }));
  }, fallbackAnnouncements);
}

export async function getPublishedArticles(): Promise<LocalizedItem[]> {
  return safeQuery(async () => {
    const rows = await db.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    if (!rows.length) return fallbackBlogPosts;
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      titleAr: row.titleAr ?? row.title,
      excerpt: row.excerpt ?? row.content.slice(0, 120),
      excerptAr: row.excerptAr ?? row.contentAr?.slice(0, 120) ?? "",
      date: row.publishedAt?.toISOString().split("T")[0] ?? row.createdAt.toISOString().split("T")[0],
    }));
  }, fallbackBlogPosts);
}

export async function getPublishedEvents() {
  return safeQuery(async () => {
    const rows = await db.event.findMany({
      where: { isPublished: true },
      orderBy: { eventDate: "desc" },
    });
    if (!rows.length) return fallbackActivities;
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      titleAr: row.titleAr ?? row.title,
      excerpt: row.description.slice(0, 120),
      excerptAr: row.descriptionAr?.slice(0, 120) ?? row.description.slice(0, 120),
      date: row.eventDate.toISOString().split("T")[0],
    }));
  }, fallbackActivities);
}

export async function getActiveTeachers() {
  let dbTeachers: Awaited<ReturnType<typeof mapTeachers>> = [];
  try {
    const rows = await db.teacher.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (rows.length) dbTeachers = mapTeachers(rows);
  } catch {
    // DB unavailable
  }

  const localRows = await getAllLocalTeachers();
  const localActive = mapTeachers(
    localRows.filter((t) => t.isActive).map((t) => ({ ...t, fullName: t.fullName }))
  );

  const merged = [...dbTeachers, ...localActive.filter((lt) => !dbTeachers.some((d) => d.id === lt.id))];
  if (merged.length) return merged;
  return fallbackTeachers;
}

function mapTeachers(
  rows: {
    id: string;
    fullName: string;
    fullNameAr?: string | null;
    jobTitle?: string | null;
    jobTitleAr?: string | null;
    department?: string | null;
    departmentAr?: string | null;
    photo?: string | null;
    biography?: string | null;
    biographyAr?: string | null;
    email?: string | null;
    phone?: string | null;
  }[]
) {
  return rows.map((row) => ({
    id: row.id,
    name: row.fullName,
    nameAr: row.fullNameAr ?? row.fullName,
    subject: row.jobTitle ?? "",
    subjectAr: row.jobTitleAr ?? row.jobTitle ?? "",
    department: row.department ?? "",
    departmentAr: row.departmentAr ?? row.department ?? "",
    photo: row.photo,
    biography: row.biography,
    biographyAr: row.biographyAr,
    email: row.email,
    phone: row.phone,
  }));
}

export async function getGalleryAlbums() {
  return safeQuery(async () => {
    const rows = await db.galleryAlbum.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { images: true } } },
    });
    if (!rows.length) return fallbackGalleryAlbums;
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      titleAr: row.titleAr ?? row.title,
      count: row._count.images,
      coverImage: row.coverImage,
    }));
  }, fallbackGalleryAlbums);
}

export async function getPublishedDownloads() {
  return safeQuery(async () => {
    const rows = await db.download.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    if (!rows.length) return fallbackDownloads;
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      titleAr: row.titleAr ?? row.title,
      type: row.fileType ?? "PDF",
      size: row.fileSize ? `${(row.fileSize / 1024 / 1024).toFixed(1)} MB` : "",
      fileUrl: row.fileUrl,
    }));
  }, fallbackDownloads);
}

export async function getCalendarEvents() {
  return safeQuery(async () => {
    const rows = await db.calendarEvent.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "asc" },
    });
    if (!rows.length) return calendarEventsPlaceholder;
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      titleAr: row.titleAr ?? row.title,
      startDate: row.startDate.toISOString().split("T")[0],
      endDate: row.endDate?.toISOString().split("T")[0],
      type: row.type,
      description: row.description,
      descriptionAr: row.descriptionAr,
    }));
  }, calendarEventsPlaceholder);
}

export async function getAchievements() {
  return safeQuery(async () => {
    const rows = await db.achievement.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) return achievementsPlaceholder;
    return rows;
  }, achievementsPlaceholder);
}

export async function getHonorStudents() {
  return safeQuery(async () => {
    const rows = await db.honorStudent.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) return honorStudentsPlaceholder;
    return rows;
  }, honorStudentsPlaceholder);
}

export async function getRegulations() {
  return safeQuery(async () => {
    const rows = await db.regulation.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) return regulationsPlaceholder;
    return rows;
  }, regulationsPlaceholder);
}

export async function getClubs() {
  return safeQuery(async () => {
    const rows = await db.club.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) return clubsPlaceholder;
    return rows;
  }, clubsPlaceholder);
}

export async function getDepartments() {
  return safeQuery(async () => {
    const rows = await db.department.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) return departmentsPlaceholder;
    return rows;
  }, departmentsPlaceholder);
}

export async function getParentResources() {
  return safeQuery(async () => {
    const rows = await db.parentResource.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) return parentResourcesPlaceholder;
    return rows;
  }, parentResourcesPlaceholder);
}

export async function getSchoolServices() {
  return safeQuery(async () => {
    const rows = await db.schoolService.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) return servicesPlaceholder;
    return rows;
  }, servicesPlaceholder);
}

export async function getFaqs() {
  return safeQuery(async () => {
    const rows = await db.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (!rows.length) {
      return faqItems.map((item, i) => ({
        id: String(i),
        question: item.q,
        questionAr: item.qAr,
        answer: item.a,
        answerAr: item.aAr,
      }));
    }
    return rows;
  }, faqItems.map((item, i) => ({
    id: String(i),
    question: item.q,
    questionAr: item.qAr,
    answer: item.a,
    answerAr: item.aAr,
  })));
}

export async function getPublishedResults() {
  let dbResults: Awaited<ReturnType<typeof mapSchoolResults>> = [];
  try {
    const rows = await db.schoolResult.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    if (rows.length) dbResults = mapSchoolResults(rows);
  } catch {
    // DB unavailable
  }

  const localResults = await getLocalPublishedResults();
  const mappedLocal = mapSchoolResults(
    localResults.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      fileType: r.fileType as "PDF" | "IMAGE",
    }))
  );

  const merged = [
    ...dbResults,
    ...mappedLocal.filter((lr) => !dbResults.some((d) => d.id === lr.id)),
  ];
  return merged;
}

function mapSchoolResults(
  rows: {
    id: string;
    title: string;
    titleAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    academicYear?: string | null;
    semester?: string | null;
    category?: string | null;
    fileUrl: string;
    fileType: string;
    createdAt: Date | string;
  }[]
) {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    titleAr: row.titleAr,
    description: row.description,
    descriptionAr: row.descriptionAr,
    academicYear: row.academicYear,
    semester: row.semester,
    category: row.category,
    fileUrl: row.fileUrl,
    fileType: row.fileType,
    createdAt:
      row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  }));
}

export async function getAdminStats() {
  return safeQuery(
    async () => ({
      articles: await db.article.count(),
      teachers: await db.teacher.count({ where: { isActive: true } }),
      events: await db.event.count({ where: { isPublished: true, eventDate: { gte: new Date() } } }),
      messages: await db.contactMessage.count({ where: { status: "NEW" } }),
      announcements: await db.announcement.count(),
    }),
    { articles: 0, teachers: 0, events: 0, messages: 0, announcements: 0 }
  );
}
