"use client";

import DataTable from "@/components/admin/DataTable";

type Row = { id: string; filename: string; type: string; size: string; date: string; url: string };

type Props = {
  locale: string;
  data: Row[];
};

export function MediaAdminTable({ locale, data }: Props) {
  const isAr = locale === "ar";

  return (
    <DataTable
      locale={locale}
      data={data}
      columns={[
        { key: "filename", header: isAr ? "الملف" : "File" },
        { key: "type", header: isAr ? "النوع" : "Type" },
        { key: "size", header: isAr ? "الحجم" : "Size" },
        { key: "date", header: isAr ? "التاريخ" : "Date" },
        {
          key: "url",
          header: isAr ? "رابط" : "Link",
          sortable: false,
          render: (row) => (
            <a
              href={String(row.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {isAr ? "فتح" : "Open"}
            </a>
          ),
        },
      ]}
    />
  );
}
