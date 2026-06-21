import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminUsersPage({ params }: PageProps) {
  await params;

  let rows: { id: string; name: string; email: string; role: string; status: string }[] = [];
  try {
    const items = await db.user.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.isActive ? "Active" : "Inactive",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader title="Users" description="Admin and editor accounts." />
      <DataTable
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "role", header: "Role" },
          { key: "status", header: "Status" },
        ]}
        data={rows}
      />
    </div>
  );
}
