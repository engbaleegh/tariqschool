import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminArticlesPage({ params }: PageProps) {
  const { locale } = await params;
  const base = `/${locale}/admin/articles`;

  let rows: { id: string; title: string; date: string; status: string }[] = [];
  try {
    const items = await db.article.findMany({ orderBy: { createdAt: "desc" } });
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
        title="Articles"
        description="Manage blog posts and school news articles."
        action={{ label: "New article", href: `${base}/new` }}
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
