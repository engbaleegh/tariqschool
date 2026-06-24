import PageHeader from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewUserPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "إضافة مستخدم" : "Add user"}
        description={isAr ? "إنشاء حساب جديد للوحة التحكم" : "Create a new admin panel account"}
      />
      <UserForm locale={locale} mode="create" />
    </div>
  );
}
