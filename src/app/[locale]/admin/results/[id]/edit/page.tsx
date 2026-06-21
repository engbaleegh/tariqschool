import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { ResultForm } from "@/components/admin/ResultForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale; id: string }> };

export default async function EditResultPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let result;
  try {
    result = await db.schoolResult.findUnique({ where: { id } });
  } catch {
    result = null;
  }

  if (!result) notFound();

  return (
    <div>
      <PageHeader
        title={isAr ? "تعديل نتيجة" : "Edit result"}
        description={result.titleAr ?? result.title}
      />
      <ResultForm
        locale={locale}
        mode="edit"
        resultId={id}
        defaultValues={{
          title: result.title,
          titleAr: result.titleAr ?? undefined,
          description: result.description ?? undefined,
          descriptionAr: result.descriptionAr ?? undefined,
          academicYear: result.academicYear ?? undefined,
          semester: result.semester ?? undefined,
          category: result.category ?? undefined,
          isPublished: result.isPublished,
          fileUrl: result.fileUrl,
          fileType: result.fileType,
        }}
      />
    </div>
  );
}
