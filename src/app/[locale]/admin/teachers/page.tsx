import PageHeader from "@/components/admin/PageHeader";
import { TeachersAdminTable } from "@/components/admin/tables/TeachersAdminTable";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";
import { getAllLocalTeachers } from "@/lib/local-teachers";

type TeachersPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function TeachersPage({ params }: TeachersPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/${Routes.TEACHERS}`;

  let rows: { id: string; name: string; department: string; email: string; status: string }[] = [];

  try {
    const items = await db.teacher.findMany({ orderBy: { order: "asc" } });
    rows = items.map((item) => ({
      id: item.id,
      name: item.fullNameAr ?? item.fullName,
      department: item.departmentAr ?? item.department ?? "—",
      email: item.email ?? "—",
      status: item.isActive ? (isAr ? "نشط" : "Active") : isAr ? "غير نشط" : "Inactive",
    }));
  } catch {
    rows = [];
  }

  const localTeachers = await getAllLocalTeachers();
  const localRows = localTeachers.map((item) => ({
    id: item.id,
    name: item.fullNameAr ?? item.fullName,
    department: item.departmentAr ?? item.department ?? "—",
    email: item.email ?? "—",
    status: item.isActive ? (isAr ? "نشط" : "Active") : isAr ? "غير نشط" : "Inactive",
  }));

  rows = [...rows, ...localRows.filter((lt) => !rows.some((r) => r.id === lt.id))];

  return (
    <div>
      <PageHeader
        title={isAr ? "المعلمون" : "Teachers"}
        description={
          isAr ? "إدارة بيانات الكادر التعليمي" : "Manage teaching staff profiles and departments."
        }
        action={{ label: isAr ? "إضافة معلم" : "Add teacher", href: `${base}/new` }}
      />
      <TeachersAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا يوجد معلمون بعد. أضف معلماً جديداً." : "No teachers yet. Add a new teacher."}
      />
    </div>
  );
}
