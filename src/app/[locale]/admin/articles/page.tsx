import PageHeader from "@/components/admin/PageHeader";
import { ArticlesAdminTable } from "@/components/admin/tables/ArticlesAdminTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/utils";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminArticlesPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const base = `/${locale}/admin/articles`;

  let rows: { id: string; title: string; date: string; status: string }[] = [];
  try {
    const items = await db.article.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: getLocalizedField(item, "title", locale),
      date: item.publishedAt?.toLocaleDateString(locale) ?? item.createdAt.toLocaleDateString(locale),
      status: item.isPublished ? (isAr ? "منشور" : "Published") : isAr ? "مسودة" : "Draft",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title={isAr ? "المقالات" : "Articles"}
        description={
          isAr ? "إدارة مقالات المدونة وأخبار المدرسة" : "Manage blog posts and school news articles."
        }
        action={{ label: isAr ? "مقال جديد" : "New article", href: `${base}/new` }}
      />
      <ArticlesAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا توجد مقالات بعد" : "No articles yet"}
      />
    </div>
  );
}
