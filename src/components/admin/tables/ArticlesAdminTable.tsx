"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type Row = { id: string; title: string; date: string; status: string };

type Props = {
  locale: string;
  base: string;
  data: Row[];
  emptyMessage: string;
};

export function ArticlesAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
      columns={[
        { key: "title", header: isAr ? "العنوان" : "Title", className: "w-[40%]" },
        { key: "date", header: isAr ? "التاريخ" : "Date", className: "w-[20%]" },
        { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[15%]" },
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
