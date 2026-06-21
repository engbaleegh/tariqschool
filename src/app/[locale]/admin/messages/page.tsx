import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminMessagesPage({ params }: PageProps) {
  await params;

  let rows: { id: string; name: string; email: string; subject: string; status: string; date: string }[] = [];
  try {
    const items = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject ?? "—",
      status: item.status,
      date: item.createdAt.toLocaleDateString(),
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader title="Messages" description="Contact form submissions from the public site." />
      <DataTable
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "subject", header: "Subject" },
          { key: "status", header: "Status" },
          { key: "date", header: "Date" },
        ]}
        data={rows}
      />
    </div>
  );
}
