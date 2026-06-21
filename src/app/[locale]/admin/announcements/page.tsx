import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type AnnouncementsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AnnouncementsPage({ params }: AnnouncementsPageProps) {
  const { locale } = await params;
  const base = `/${locale}/${Routes.ADMIN}/${Routes.ANNOUNCEMENTS}`;

  let rows: { id: string; title: string; date: string; status: string }[] = [];
  try {
    const items = await db.announcement.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.publishedAt?.toLocaleDateString() ?? item.createdAt.toLocaleDateString(),
      status: item.isPublished ? "Published" : "Draft",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Publish school-wide notices and updates."
        action={{ label: "New announcement", href: `${base}/new` }}
      />
      <DataTable
        columns={[
          { key: "title", header: "Title" },
          { key: "date", header: "Date" },
          { key: "status", header: "Status" },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <Link href={`${base}/${row.id}/edit`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Edit
              </Link>
            ),
          },
        ]}
        data={rows}
      />
    </div>
  );
}
