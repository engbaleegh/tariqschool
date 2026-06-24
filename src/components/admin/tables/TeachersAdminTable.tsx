"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { DeleteTeacherButton } from "@/components/admin/DeleteTeacherButton";

export type TeacherRow = {
  id: string;
  name: string;
  department: string;
  email: string;
  status: string;
};

type Props = {
  locale: string;
  base: string;
  data: TeacherRow[];
  emptyMessage: string;
};

export function TeachersAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
      columns={[
        { key: "name", header: isAr ? "الاسم" : "Name", className: "w-[24%]" },
        { key: "department", header: isAr ? "القسم" : "Department", className: "w-[20%]" },
        { key: "email", header: isAr ? "البريد" : "Email", className: "w-[24%]" },
        { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[12%]" },
        {
          key: "actions",
          header: isAr ? "إجراءات" : "Actions",
          className: "w-[20%]",
          sortable: false,
          render: (row) => (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`${base}/${row.id}/edit`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                {isAr ? "تعديل" : "Edit"}
              </Link>
              <DeleteTeacherButton id={row.id as string} locale={locale} />
            </div>
          ),
        },
      ]}
    />
  );
}
