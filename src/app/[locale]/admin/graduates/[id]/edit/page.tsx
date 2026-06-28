import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { GraduateForm } from "@/components/admin/GraduateForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale; id: string }> };

export default async function EditGraduatePage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let graduate;
  try {
    graduate = await db.graduate.findUnique({ where: { id } });
  } catch {
    graduate = null;
  }

  if (!graduate) notFound();

  return (
    <div>
      <PageHeader
        title={isAr ? "تعديل خريج" : "Edit graduate"}
        description={graduate.nameAr ?? graduate.name}
      />
      <GraduateForm
        locale={locale}
        mode="edit"
        graduateId={id}
        defaultValues={{
          name: graduate.name,
          nameAr: graduate.nameAr ?? undefined,
          biography: graduate.biography ?? undefined,
          biographyAr: graduate.biographyAr ?? undefined,
          photo: graduate.photo,
          isActive: graduate.isActive,
          featuredOnHomepage: graduate.featuredOnHomepage,
          order: graduate.order,
        }}
      />
    </div>
  );
}
