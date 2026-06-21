import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { DeleteResultButton } from "@/components/admin/DeleteResultButton";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { db } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/utils";

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
        columns={[
          { key: "title", header: isAr ? "العنوان" : "Title" },
          { key: "category", header: isAr ? "التصنيف" : "Category" },
          { key: "year", header: isAr ? "العام الدراسي" : "Academic Year" },
          { key: "status", header: isAr ? "الحالة" : "Status" },
          {
            key: "id",
            header: isAr ? "إجراءات" : "Actions",
            render: (row) => <DeleteResultButton id={row.id as string} locale={locale} />,
          },
        ]}
        data={rows}
        emptyMessage={isAr ? "لا توجد نتائج بعد" : "No results yet"}
      />
    </div>
  );
}
