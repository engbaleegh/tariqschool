import PageHeader from "@/components/admin/PageHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewArticlePage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "مقال جديد" : "New article"}
        description={isAr ? "إنشاء مقال أو خبر للمدونة" : "Create a blog post or news article."}
      />
      <ArticleForm locale={locale} mode="create" />
    </div>
  );
}
