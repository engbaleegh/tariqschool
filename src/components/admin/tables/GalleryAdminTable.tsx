"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type Row = { id: string; title: string; category: string; status: string; count: number };

type Props = {
  locale: string;
  base: string;
  data: Row[];
  emptyMessage: string;
};

export function GalleryAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
      columns={[
        { key: "title", header: isAr ? "الألبوم" : "Album", className: "w-[30%]" },
        { key: "category", header: isAr ? "التصنيف" : "Category", className: "w-[18%]" },
        { key: "count", header: isAr ? "الصور" : "Images", className: "w-[10%]" },
        { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[12%]" },
        {
          key: "actions",
          header: isAr ? "إجراءات" : "Actions",
          className: "w-[15%]",
          sortable: false,
          render: (row) => (
            <Link
              href={`${base}/${row.id}/edit`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {isAr ? "تعديل" : "Edit"}
            </Link>
          ),
        },
      ]}
    />
  );
}
