"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";

type Row = { id: string; name: string; email: string; role: string; status: string };

type Props = { locale: string; base: string; data: Row[]; emptyMessage: string };

export function UsersAdminTable({ locale, base, data, emptyMessage }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      emptyMessage={emptyMessage}
      columns={[
        { key: "name", header: isAr ? "الاسم" : "Name", className: "w-[22%]" },
        { key: "email", header: isAr ? "البريد" : "Email", className: "w-[28%]" },
        { key: "role", header: isAr ? "الدور" : "Role", className: "w-[16%]" },
        { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[12%]" },
        {
          key: "actions",
          header: isAr ? "إجراءات" : "Actions",
          className: "w-[18%]",
          sortable: false,
          render: (row) => (
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`${base}/${row.id}/edit`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                {isAr ? "تعديل" : "Edit"}
              </Link>
              <DeleteUserButton id={row.id as string} locale={locale} />
            </div>
          ),
        },
      ]}
    />
  );
}
