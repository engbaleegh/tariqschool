"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { DeleteCalendarButton } from "@/components/admin/DeleteCalendarButton";

type Row = { id: string; title: string; start: string; type: string };

type Props = { locale: string; base: string; data: Row[]; emptyMessage: string };

export function CalendarAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
      columns={[
        { key: "title", header: isAr ? "الحدث" : "Event", className: "w-[36%]" },
        { key: "start", header: isAr ? "التاريخ" : "Date", className: "w-[22%]" },
        { key: "type", header: isAr ? "النوع" : "Type", className: "w-[16%]" },
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
              <DeleteCalendarButton id={row.id as string} locale={locale} />
            </div>
          ),
        },
      ]}
    />
  );
}
