import PageHeader from "@/components/admin/PageHeader";
import { UsersAdminTable } from "@/components/admin/tables/UsersAdminTable";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }>; searchParams?: Promise<{ saved?: string }> };

export default async function AdminUsersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/users`;

  let rows: { id: string; name: string; email: string; role: string; status: string }[] = [];
  try {
    const items = await db.user.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.isActive ? (isAr ? "نشط" : "Active") : isAr ? "غير نشط" : "Inactive",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title={isAr ? "المستخدمون" : "Users"}
        description={isAr ? "إدارة حسابات لوحة التحكم" : "Manage admin panel accounts."}
        action={{ label: isAr ? "إضافة مستخدم" : "Add user", href: `${base}/new` }}
      />
      {query.saved === "1" && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {isAr ? "تم حفظ المستخدم بنجاح" : "User saved successfully"}
        </p>
      )}
      <UsersAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا يوجد مستخدمون بعد" : "No users yet"}
      />
    </div>
  );
}
