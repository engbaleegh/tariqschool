"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes, Routes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { createTeacher, updateTeacher } from "@/server/actions/teachers";

type TeacherFormValues = {
  fullName?: string;
  fullNameAr?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  jobTitleAr?: string;
  department?: string;
  departmentAr?: string;
  biography?: string;
  biographyAr?: string;
  qualifications?: string;
  qualificationsAr?: string;
  photo?: string | null;
  isActive?: boolean;
};

type TeacherFormProps = {
  locale: string;
  mode: "create" | "edit";
  teacherId?: string;
  defaultValues?: TeacherFormValues;
};

export function TeacherForm({ locale, mode, teacherId, defaultValues }: TeacherFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/${Routes.ADMIN}/${Routes.TEACHERS}`;
  const action = mode === "create" ? createTeacher : updateTeacher.bind(null, teacherId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  useEffect(() => {
    if (state.ok) router.push(`${listHref}?saved=1`);
  }, [state.ok, router, listHref]);

  return (
    <form action={formAction} className={formCardClass} encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />
      {defaultValues?.photo && (
        <input type="hidden" name="existingPhoto" value={defaultValues.photo} />
      )}

      {(state.error || state.fieldErrors?.fullName) && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error ?? state.fieldErrors?.fullName}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "اسم المعلم *" : "Full name *"}</label>
          <input
            name="fullNameAr"
            type={InputTypes.TEXT}
            dir="rtl"
            defaultValue={defaultValues?.fullNameAr ?? defaultValues?.fullName ?? ""}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label>
          <input name="fullName" type={InputTypes.TEXT} defaultValue={defaultValues?.fullName ?? ""} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "صورة المعلم" : "Teacher photo"}</label>
          {defaultValues?.photo && (
            <div className="mb-3 flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200">
                <Image src={defaultValues.photo} alt="" fill className="object-cover" unoptimized />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input name="removePhoto" type={InputTypes.CHECKBOX} />
                {isAr ? "حذف الصورة" : "Remove photo"}
              </label>
            </div>
          )}
          <input name="photo" type={InputTypes.FILE} accept="image/jpeg,image/png,image/webp" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>{isAr ? "البريد" : "Email"}</label>
          <input name="email" type={InputTypes.EMAIL} defaultValue={defaultValues?.email ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "الهاتف" : "Phone"}</label>
          <input name="phone" type={InputTypes.TEL} defaultValue={defaultValues?.phone ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المنصب (عربي)" : "Position (Arabic)"}</label>
          <input name="jobTitleAr" type={InputTypes.TEXT} dir="rtl" defaultValue={defaultValues?.jobTitleAr ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المنصب (إنجليزي)" : "Position (English)"}</label>
          <input name="jobTitle" type={InputTypes.TEXT} defaultValue={defaultValues?.jobTitle ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "القسم (عربي)" : "Department (Arabic)"}</label>
          <input name="departmentAr" type={InputTypes.TEXT} dir="rtl" defaultValue={defaultValues?.departmentAr ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "القسم (إنجليزي)" : "Department (English)"}</label>
          <input name="department" type={InputTypes.TEXT} defaultValue={defaultValues?.department ?? ""} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "المؤهلات" : "Qualifications"}</label>
          <textarea name="qualificationsAr" rows={2} dir="rtl" defaultValue={defaultValues?.qualificationsAr ?? ""} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "السيرة الذاتية" : "Biography"}</label>
          <textarea name="biographyAr" rows={4} dir="rtl" defaultValue={defaultValues?.biographyAr ?? ""} className={inputClass} />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="isActive" type={InputTypes.CHECKBOX} defaultChecked={defaultValues?.isActive ?? true} />
          {isAr ? "نشط" : "Active"}
        </label>
      </div>

      <FormActions
        cancelHref={listHref}
        submitLabel={
          pending
            ? isAr
              ? "جاري الحفظ..."
              : "Saving..."
            : mode === "create"
              ? isAr
                ? "حفظ المعلم"
                : "Create teacher"
              : isAr
                ? "حفظ التغييرات"
                : "Save changes"
        }
      />
    </form>
  );
}
