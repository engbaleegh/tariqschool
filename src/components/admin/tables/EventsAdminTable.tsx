"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";

type Row = { id: string; title: string; date: string; status: string };

type Props = { locale: string; base: string; data: Row[]; emptyMessage: string };

export function EventsAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
      columns={[
        { key: "title", header: isAr ? "الفعالية" : "Event", className: "w-[36%]" },
        { key: "date", header: isAr ? "التاريخ" : "Date", className: "w-[20%]" },
        { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[14%]" },
        {
          key: "actions",
          header: isAr ? "إجراءات" : "Actions",
          className: "w-[20%]",
          sortable: false,
          render: (row) => (
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`${base}/${row.id}/edit`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                {isAr ? "تعديل" : "Edit"}
              </Link>
              <DeleteEventButton id={row.id as string} locale={locale} />
            </div>
          ),
        },
      ]}
    />
  );
}
