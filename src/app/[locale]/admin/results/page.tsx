import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { DeleteResultButton } from "@/components/admin/DeleteResultButton";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/utils";
import Link from "next/link";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminResultsPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/${Routes.RESULTS}`;

  let rows: {
    id: string;
    title: string;
    category: string;
    year: string;
    status: string;
  }[] = [];

  try {
    const items = await db.schoolResult.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: getLocalizedField(item, "title", locale),
      category: item.category ?? "—",
      year: item.academicYear ?? "—",
      status: item.isPublished ? (isAr ? "منشور" : "Published") : isAr ? "مخفي" : "Hidden",
    }));
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={isAr ? "النتائج" : "Results"}
        description={
          isAr
            ? "رفع ملفات النتائج الكاملة (PDF أو صور)"
            : "Upload complete result files (PDF or images)"
        }
        action={{ label: isAr ? "رفع نتيجة" : "Upload result", href: `${base}/new` }}
      />
      <DataTable
        locale={locale}
        columns={[
          { key: "title", header: isAr ? "العنوان" : "Title", className: "w-[32%]" },
          { key: "category", header: isAr ? "التصنيف" : "Category", className: "w-[18%]" },
          { key: "year", header: isAr ? "العام الدراسي" : "Academic Year", className: "w-[14%]" },
          { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[12%]" },
          {
            key: "actions",
            header: isAr ? "إجراءات" : "Actions",
            className: "w-[24%]",
            sortable: false,
            render: (row) => (
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`${base}/${row.id}/edit`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {isAr ? "تعديل" : "Edit"}
                </Link>
                <DeleteResultButton id={row.id as string} locale={locale} />
              </div>
            ),
          },
        ]}
        data={rows}
        emptyMessage={isAr ? "لا توجد نتائج بعد" : "No results yet"}
      />
    </div>
  );
}
