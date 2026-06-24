"use client";

import Link from "next/link";
import DataTable from "@/components/admin/DataTable";

type Row = { id: string; title: string; date: string; status: string };

type Props = {
  base: string;
  data: Row[];
};

export function AnnouncementsAdminTable({ base, data }: Props) {
  return (
    <DataTable
      columns={[
        { key: "title", header: "Title" },
        { key: "date", header: "Date" },
        { key: "status", header: "Status" },
        {
          key: "actions",
          header: "Actions",
          sortable: false,
          render: (row) => (
            <Link
              href={`${base}/${row.id}/edit`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Edit
            </Link>
          ),
        },
      ]}
      data={data}
    />
  );
}
