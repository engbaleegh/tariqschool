import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale; id: string }> };

export default async function EditUserPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const user = await db.user.findUnique({ where: { id } }).catch(() => null);
  if (!user) notFound();

  return (
    <div>
      <PageHeader title={isAr ? "تعديل مستخدم" : "Edit user"} description={user.name} />
      <UserForm
        locale={locale}
        mode="edit"
        userId={id}
        defaultValues={{
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        }}
      />
    </div>
  );
}
