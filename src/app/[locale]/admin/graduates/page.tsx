import PageHeader from "@/components/admin/PageHeader";
import { GraduatesAdminTable } from "@/components/admin/tables/GraduatesAdminTable";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function AdminGraduatesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/${Routes.GRADUATES}`;

  let rows: {
    id: string;
    name: string;
    status: string;
    order: number;
    isActive: boolean;
    featuredOnHomepage: boolean;
  }[] = [];

  try {
    const items = await db.graduate.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    rows = items.map((item) => ({
      id: item.id,
      name: getLocalizedField(item, "name", locale),
      status: item.isActive ? (isAr ? "نشط" : "Active") : isAr ? "غير نشط" : "Inactive",
      order: item.order,
      isActive: item.isActive,
      featuredOnHomepage: item.featuredOnHomepage,
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title={isAr ? "الخريجون" : "Graduates"}
        description={
          isAr
            ? "اختر حتى 3 خريجين للعرض في الصفحة الرئيسية"
            : "Choose up to 3 graduates to feature on the homepage"
        }
        action={{ label: isAr ? "إضافة خريج" : "Add graduate", href: `${base}/new` }}
      />
      {query.error === "homepage-limit" && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {isAr ? "يمكن عرض 3 خريجين فقط في الصفحة الرئيسية" : "Only 3 graduates can appear on the homepage"}
        </p>
      )}
      <GraduatesAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا يوجد خريجون بعد" : "No graduates yet"}
      />
    </div>
  );
}
