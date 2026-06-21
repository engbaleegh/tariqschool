import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { DeleteGraduateButton } from "@/components/admin/DeleteGraduateButton";
import { ToggleGraduateButton } from "@/components/admin/ToggleGraduateButton";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/utils";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminGraduatesPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/${Routes.GRADUATES}`;

  let rows: {
    id: string;
    name: string;
    status: string;
    order: number;
    isActive: boolean;
  }[] = [];

  try {
    const items = await db.graduate.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    rows = items.map((item) => ({
      id: item.id,
      name: getLocalizedField(item, "name", locale),
      status: item.isActive ? (isAr ? "نشط" : "Active") : isAr ? "غير نشط" : "Inactive",
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
      <DataTable
        locale={locale}
        emptyMessage={isAr ? "لا يوجد خريجون بعد" : "No graduates yet"}
        columns={[
          { key: "name", header: isAr ? "الاسم" : "Name", className: "w-[30%]" },
          { key: "order", header: isAr ? "الترتيب" : "Order", className: "w-[10%]" },
          { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[12%]" },
          {
            key: "actions",
            header: isAr ? "إجراءات" : "Actions",
            className: "w-[28%]",
            sortable: false,
            render: (row) => (
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`${base}/${row.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {isAr ? "تعديل" : "Edit"}
                </Link>
                <ToggleGraduateButton
                  id={row.id as string}
                  locale={locale}
                  isActive={row.isActive as boolean}
                />
                <DeleteGraduateButton id={row.id as string} locale={locale} />
              </div>
            ),
          },
        ]}
        data={rows}
      />
    </div>
  );
}
