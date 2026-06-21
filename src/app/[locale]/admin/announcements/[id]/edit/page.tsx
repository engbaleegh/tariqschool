import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type EditAnnouncementPageProps = {
  params: Promise<{ locale: Locale; id: string }>;
};

export default async function EditAnnouncementPage({ params }: EditAnnouncementPageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let item = null;
  try {
    item = await db.announcement.findUnique({ where: { id } });
  } catch {
    item = null;
  }
  if (!item) notFound();

  return (
    <div>
      <PageHeader
        title={isAr ? "تعديل الإعلان" : "Edit announcement"}
        description={item.titleAr ?? item.title}
      />
      <AnnouncementForm
        locale={locale}
        mode="edit"
        announcementId={id}
        defaultValues={{
          title: item.title,
          titleAr: item.titleAr ?? undefined,
          excerpt: item.excerpt ?? undefined,
          excerptAr: item.excerptAr ?? undefined,
          content: item.content,
          contentAr: item.contentAr ?? undefined,
          isPublished: item.isPublished,
          publishedAt: item.publishedAt?.toISOString().split("T")[0] ?? "",
        }}
      />
    </div>
  );
}
