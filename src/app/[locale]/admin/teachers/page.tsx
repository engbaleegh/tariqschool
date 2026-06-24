import PageHeader from "@/components/admin/PageHeader";
import { TeachersAdminTable } from "@/components/admin/tables/TeachersAdminTable";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type TeachersPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams?: Promise<{ saved?: string; deleted?: string }>;
};

export default async function TeachersPage({ params, searchParams }: TeachersPageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
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

  return (
    <div>
      <PageHeader
        title={isAr ? "المعلمون" : "Teachers"}
        description={
          isAr ? "إدارة بيانات الكادر التعليمي" : "Manage teaching staff profiles and departments."
        }
        action={{ label: isAr ? "إضافة معلم" : "Add teacher", href: `${base}/new` }}
      />
      {query.saved === "1" && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {isAr ? "تم حفظ المعلم بنجاح" : "Teacher saved successfully"}
        </p>
      )}
      {query.deleted === "1" && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {isAr ? "تم حذف المعلم بنجاح" : "Teacher deleted successfully"}
        </p>
      )}
      <TeachersAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا يوجد معلمون بعد. أضف معلماً جديداً." : "No teachers yet. Add a new teacher."}
      />
    </div>
  );
}
