import PageHeader from "@/components/admin/PageHeader";
import { GraduatesAdminTable } from "@/components/admin/tables/GraduatesAdminTable";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/utils";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminGraduatesPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/${Routes.GRADUATES}`;

  let rows: {
    id: string;
    name: string;
    status: string;
    home: string;
    order: number;
    isActive: boolean;
  }[] = [];

  try {
    const items = await db.graduate.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    rows = items.map((item) => ({
      id: item.id,
      name: getLocalizedField(item, "name", locale),
      status: item.isActive ? (isAr ? "نشط" : "Active") : isAr ? "غير نشط" : "Inactive",
      home: item.featuredOnHomepage ? (isAr ? "نعم" : "Yes") : isAr ? "لا" : "No",
      order: item.order,
      isActive: item.isActive,
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
            ? "إدارة الخريجين المعروضين في الموقع"
            : "Manage graduates displayed on the public website"
        }
        action={{ label: isAr ? "إضافة خريج" : "Add graduate", href: `${base}/new` }}
      />
      <GraduatesAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا يوجد خريجون بعد" : "No graduates yet"}
      />
    </div>
  );
}
