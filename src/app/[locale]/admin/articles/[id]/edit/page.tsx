import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale; id: string }> };

export default async function EditArticlePage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let item = null;
  try {
    item = await db.article.findUnique({ where: { id } });
  } catch {
    item = null;
  }
  if (!item) notFound();

  return (
    <div>
      <PageHeader title={isAr ? "تعديل المقال" : "Edit article"} description={item.titleAr ?? item.title} />
      <ArticleForm
        locale={locale}
        mode="edit"
        articleId={id}
        defaultValues={{
          title: item.title,
          titleAr: item.titleAr ?? undefined,
          excerpt: item.excerpt ?? undefined,
          excerptAr: item.excerptAr ?? undefined,
          content: item.content,
          contentAr: item.contentAr ?? undefined,
          isPublished: item.isPublished,
          featuredImage: item.featuredImage,
        }}
      />
    </div>
  );
}
