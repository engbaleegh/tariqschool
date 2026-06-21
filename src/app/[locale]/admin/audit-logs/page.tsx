import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminAuditLogsPage({ params }: PageProps) {
  await params;

  let rows: { id: string; action: string; entity: string; user: string; date: string }[] = [];
  try {
    const items = await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: true },
    });
    rows = items.map((item) => ({
      id: item.id,
      action: item.action,
      entity: item.entity,
      user: item.user?.name ?? "System",
      date: item.createdAt.toLocaleString(),
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader title="Audit Logs" description="Recent admin activity across the CMS." />
      <DataTable
        columns={[
          { key: "action", header: "Action" },
          { key: "entity", header: "Entity" },
          { key: "user", header: "User" },
          { key: "date", header: "Date" },
        ]}
        data={rows}
      />
    </div>
  );
}
