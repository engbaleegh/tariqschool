import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { CoverImageForm } from "@/components/admin/CoverImageForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";
import { getHeroCoverImage } from "@/lib/school-settings";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminHomepagePage({ params }: PageProps) {
  const { locale } = await params;
  const coverImage = await getHeroCoverImage();

  let banners: { id: string; title: string; order: string; status: string }[] = [];
  try {
    const items = await db.homepageBanner.findMany({ orderBy: { order: "asc" } });
    banners = items.map((item) => ({
      id: item.id,
      title: item.title,
      order: String(item.order),
      status: item.isActive ? "Active" : "Inactive",
    }));
  } catch {
    banners = [];
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={locale === "ar" ? "الصفحة الرئيسية" : "Homepage"}
        description={
          locale === "ar"
            ? "تغيير صورة الغلاف والبانرات"
            : "Manage cover image and banners"
        }
      />
      <CoverImageForm locale={locale} currentCover={coverImage} />
      {banners.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            {locale === "ar" ? "البانرات" : "Banners"}
          </h3>
          <DataTable
            columns={[
              { key: "title", header: locale === "ar" ? "العنوان" : "Title" },
              { key: "order", header: locale === "ar" ? "الترتيب" : "Order" },
              { key: "status", header: locale === "ar" ? "الحالة" : "Status" },
            ]}
            data={banners}
          />
        </div>
      )}
    </div>
  );
}
