import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { TeacherForm } from "@/components/admin/TeacherForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type EditTeacherPageProps = {
  params: Promise<{ locale: Locale; id: string }>;
};

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  if (id.startsWith("local-")) {
    notFound();
  }

  let teacher = null;
  try {
    teacher = await db.teacher.findUnique({ where: { id } });
  } catch {
    teacher = null;
  }

  if (!teacher) notFound();

  return (
    <div>
      <PageHeader
        title={isAr ? "تعديل معلم" : "Edit teacher"}
        description={teacher.fullNameAr ?? teacher.fullName}
      />
      <TeacherForm
        locale={locale}
        mode="edit"
        teacherId={id}
        defaultValues={{
          fullName: teacher.fullName,
          fullNameAr: teacher.fullNameAr ?? undefined,
          email: teacher.email ?? undefined,
          phone: teacher.phone ?? undefined,
          jobTitle: teacher.jobTitle ?? undefined,
          jobTitleAr: teacher.jobTitleAr ?? undefined,
          department: teacher.department ?? undefined,
          departmentAr: teacher.departmentAr ?? undefined,
          biography: teacher.biography ?? undefined,
          biographyAr: teacher.biographyAr ?? undefined,
          qualifications: teacher.qualifications ?? undefined,
          qualificationsAr: teacher.qualificationsAr ?? undefined,
          photo: teacher.photo,
          isActive: teacher.isActive,
        }}
      />
    </div>
  );
}
