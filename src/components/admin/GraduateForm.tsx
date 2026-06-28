"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes, Routes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
import { createGraduate, updateGraduate } from "@/server/actions/graduates";

type GraduateFormValues = {
  name?: string;
  nameAr?: string;
  biography?: string;
  biographyAr?: string;
  photo?: string | null;
    isActive?: boolean;
    featuredOnHomepage?: boolean;
    order?: number;
};

type GraduateFormProps = {
  locale: string;
  mode: "create" | "edit";
  graduateId?: string;
  defaultValues?: GraduateFormValues;
};

export function GraduateForm({ locale, mode, graduateId, defaultValues }: GraduateFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/${Routes.ADMIN}/graduates`;
  const action = mode === "create" ? createGraduate : updateGraduate.bind(null, graduateId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const values = usePersistedFormValues(
    {
      name: defaultValues?.name ?? "",
      nameAr: defaultValues?.nameAr ?? defaultValues?.name ?? "",
      biography: defaultValues?.biography ?? "",
      biographyAr: defaultValues?.biographyAr ?? "",
    },
    state
  );

  useEffect(() => {
    if (state.ok) router.push(`${listHref}?saved=1`);
  }, [state.ok, router, listHref]);

  return (
    <form action={formAction} className={formCardClass} encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />
      {defaultValues?.photo && (
        <input type="hidden" name="existingPhoto" value={defaultValues.photo} />
      )}

      {(state.error || state.fieldErrors?.name) && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error ?? state.fieldErrors?.name}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "اسم الخريج *" : "Graduate name *"}</label>
          <input
            name="nameAr"
            type={InputTypes.TEXT}
            dir="rtl"
            defaultValue={fieldValue(values, "nameAr")}
            key={`nameAr-${fieldValue(values, "nameAr")}`}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label>
          <input
            name="name"
            type={InputTypes.TEXT}
            defaultValue={fieldValue(values, "name")}
            key={`name-${fieldValue(values, "name")}`}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "صورة الخريج" : "Graduate photo"}</label>
          {defaultValues?.photo && (
            <div className="mb-3 flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200">
                <Image src={defaultValues.photo} alt="" fill className="object-cover" unoptimized />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input name="removePhoto" type={InputTypes.CHECKBOX} />
                {isAr ? "حذف الصورة" : "Remove photo"}
              </label>
            </div>
          )}
          <input name="photo" type={InputTypes.FILE} accept="image/jpeg,image/jpg,image/png,image/webp" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "السيرة (عربي)" : "Biography (Arabic)"}</label>
          <textarea
            name="biographyAr"
            rows={4}
            dir="rtl"
            defaultValue={fieldValue(values, "biographyAr")}
            key={`biographyAr-${fieldValue(values, "biographyAr").slice(0, 20)}`}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "السيرة (إنجليزي)" : "Biography (English)"}</label>
          <textarea
            name="biography"
            rows={4}
            defaultValue={fieldValue(values, "biography")}
            key={`biography-${fieldValue(values, "biography").slice(0, 20)}`}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>{isAr ? "الترتيب" : "Display order"}</label>
          <input
            name="order"
            type={InputTypes.NUMBER}
            defaultValue={String(defaultValues?.order ?? 0)}
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="isActive" type={InputTypes.CHECKBOX} defaultChecked={defaultValues?.isActive ?? true} />
          {isAr ? "نشط / يظهر للزوار" : "Active / visible to visitors"}
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            name="featuredOnHomepage"
            type={InputTypes.CHECKBOX}
            defaultChecked={defaultValues?.featuredOnHomepage ?? false}
          />
          {isAr ? "عرض في الصفحة الرئيسية (حد أقصى 3)" : "Show on homepage (max 3)"}
        </label>
      </div>

      <FormActions
        locale={locale}
        cancelHref={listHref}
        isSubmitting={pending}
        submitLabel={
          pending
            ? isAr
              ? "جاري الحفظ..."
              : "Saving..."
            : mode === "create"
              ? isAr
                ? "إضافة خريج"
                : "Add graduate"
              : isAr
                ? "حفظ التغييرات"
                : "Save changes"
        }
      />
    </form>
  );
}
