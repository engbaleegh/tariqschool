import PageHeader from "@/components/admin/PageHeader";
import { AnnouncementsAdminTable } from "@/components/admin/tables/AnnouncementsAdminTable";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type AnnouncementsPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ saved?: string }>;
};

export default async function AnnouncementsPage({ params, searchParams }: AnnouncementsPageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/${Routes.ANNOUNCEMENTS}`;

  let rows: { id: string; title: string; date: string; status: string }[] = [];
  try {
    const items = await db.announcement.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: item.titleAr ?? item.title,
      date: item.publishedAt?.toLocaleDateString(locale) ?? item.createdAt.toLocaleDateString(locale),
      status: item.isPublished ? (isAr ? "منشور" : "Published") : isAr ? "مسودة" : "Draft",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title={isAr ? "الإعلانات" : "Announcements"}
        description={isAr ? "نشر الإعلانات والتحديثات المدرسية" : "Publish school-wide notices and updates."}
        action={{ label: isAr ? "إضافة" : "Add", href: `${base}/new` }}
      />
      {query.saved === "1" && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {isAr ? "تم حفظ الإعلان بنجاح" : "Announcement saved successfully"}
        </p>
      )}
      <AnnouncementsAdminTable locale={locale} base={base} data={rows} emptyMessage={isAr ? "لا توجد إعلانات بعد" : "No announcements yet"} />
    </div>
  );
}
