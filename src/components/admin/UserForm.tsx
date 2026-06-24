"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
import { createUser, updateUser } from "@/server/actions/users";

const ROLES = [
  { value: "SUPER_ADMIN", ar: "مدير عام", en: "Super Admin" },
  { value: "ADMIN", ar: "مدير", en: "Admin" },
  { value: "EDITOR", ar: "محرر", en: "Editor" },
];

type UserFormProps = {
  locale: string;
  mode: "create" | "edit";
  userId?: string;
  defaultValues?: {
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  };
};

export function UserForm({ locale, mode, userId, defaultValues }: UserFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/admin/users`;
  const action = mode === "create" ? createUser : updateUser.bind(null, userId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const values = usePersistedFormValues(
    {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      role: defaultValues?.role ?? "EDITOR",
    },
    state
  );

  useEffect(() => {
    if (state.ok) router.push(`${listHref}?saved=1`);
  }, [state.ok, router, listHref]);

  return (
    <form action={formAction} className={formCardClass}>
      <input type="hidden" name="locale" value={locale} />

      {(state.error || state.fieldErrors) && (
        <div className="mb-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error && <p>{state.error}</p>}
          {state.fieldErrors?.name && <p>{state.fieldErrors.name}</p>}
          {state.fieldErrors?.email && <p>{state.fieldErrors.email}</p>}
          {state.fieldErrors?.password && <p>{state.fieldErrors.password}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الاسم *" : "Name *"}</label>
          <input name="name" defaultValue={fieldValue(values, "name")} key={`name-${fieldValue(values, "name")}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "البريد الإلكتروني *" : "Email *"}</label>
          <input name="email" type={InputTypes.EMAIL} defaultValue={fieldValue(values, "email")} key={`email-${fieldValue(values, "email")}`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "الدور" : "Role"}</label>
          <select name="role" defaultValue={fieldValue(values, "role")} className={inputClass}>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>{isAr ? role.ar : role.en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{mode === "create" ? (isAr ? "كلمة المرور *" : "Password *") : (isAr ? "كلمة مرور جديدة" : "New password")}</label>
          <input name="password" type={InputTypes.PASSWORD} className={inputClass} autoComplete={mode === "create" ? "new-password" : "off"} />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="isActive" type={InputTypes.CHECKBOX} defaultChecked={defaultValues?.isActive ?? true} />
          {isAr ? "نشط" : "Active"}
        </label>
      </div>

      <FormActions
        locale={locale}
        cancelHref={listHref}
        isSubmitting={pending}
        submitLabel={pending ? (isAr ? "جاري الحفظ..." : "Saving...") : isAr ? "حفظ المستخدم" : "Save user"}
      />
    </form>
  );
}
