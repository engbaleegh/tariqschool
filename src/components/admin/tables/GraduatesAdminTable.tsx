"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { DeleteGraduateButton } from "@/components/admin/DeleteGraduateButton";
import { ToggleGraduateButton } from "@/components/admin/ToggleGraduateButton";

type Row = { id: string; name: string; status: string; order: number; isActive: boolean };

type Props = {
  locale: string;
  base: string;
  data: Row[];
  emptyMessage: string;
};

export function GraduatesAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
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
    />
  );
}
