"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { DeleteResultButton } from "@/components/admin/DeleteResultButton";

type Row = { id: string; title: string; category: string; year: string; status: string };

type Props = {
  locale: string;
  base: string;
  data: Row[];
  emptyMessage: string;
};

export function ResultsAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
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
    />
  );
}
