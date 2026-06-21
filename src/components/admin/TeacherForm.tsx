"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes, Routes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
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

  const values = usePersistedFormValues(
    {
      fullName: defaultValues?.fullName ?? "",
      fullNameAr: defaultValues?.fullNameAr ?? defaultValues?.fullName ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      jobTitle: defaultValues?.jobTitle ?? "",
      jobTitleAr: defaultValues?.jobTitleAr ?? "",
      department: defaultValues?.department ?? "",
      departmentAr: defaultValues?.departmentAr ?? "",
      biography: defaultValues?.biography ?? "",
      biographyAr: defaultValues?.biographyAr ?? "",
      qualifications: defaultValues?.qualifications ?? "",
      qualificationsAr: defaultValues?.qualificationsAr ?? "",
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

      {(state.error || state.fieldErrors?.fullName) && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
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
            defaultValue={fieldValue(values, "fullNameAr")}
            key={`fullNameAr-${fieldValue(values, "fullNameAr")}`}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label>
          <input
            name="fullName"
            type={InputTypes.TEXT}
            defaultValue={fieldValue(values, "fullName")}
            key={`fullName-${fieldValue(values, "fullName")}`}
            className={inputClass}
          />
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
          <input name="photo" type={InputTypes.FILE} accept="image/jpeg,image/jpg,image/png,image/webp" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>{isAr ? "البريد" : "Email"}</label>
          <input name="email" type={InputTypes.EMAIL} defaultValue={fieldValue(values, "email")} key={`email-${fieldValue(values, "email")}`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "الهاتف" : "Phone"}</label>
          <input name="phone" type={InputTypes.TEL} defaultValue={fieldValue(values, "phone")} key={`phone-${fieldValue(values, "phone")}`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المنصب (عربي)" : "Position (Arabic)"}</label>
          <input name="jobTitleAr" type={InputTypes.TEXT} dir="rtl" defaultValue={fieldValue(values, "jobTitleAr")} key={`jobTitleAr-${fieldValue(values, "jobTitleAr")}`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المنصب (إنجليزي)" : "Position (English)"}</label>
          <input name="jobTitle" type={InputTypes.TEXT} defaultValue={fieldValue(values, "jobTitle")} key={`jobTitle-${fieldValue(values, "jobTitle")}`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "القسم (عربي)" : "Department (Arabic)"}</label>
          <input name="departmentAr" type={InputTypes.TEXT} dir="rtl" defaultValue={fieldValue(values, "departmentAr")} key={`departmentAr-${fieldValue(values, "departmentAr")}`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "القسم (إنجليزي)" : "Department (English)"}</label>
          <input name="department" type={InputTypes.TEXT} defaultValue={fieldValue(values, "department")} key={`department-${fieldValue(values, "department")}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "المؤهلات (عربي)" : "Qualifications (Arabic)"}</label>
          <textarea name="qualificationsAr" rows={2} dir="rtl" defaultValue={fieldValue(values, "qualificationsAr")} key={`qualificationsAr-${fieldValue(values, "qualificationsAr")}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "المؤهلات (إنجليزي)" : "Qualifications (English)"}</label>
          <textarea name="qualifications" rows={2} defaultValue={fieldValue(values, "qualifications")} key={`qualifications-${fieldValue(values, "qualifications")}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "السيرة الذاتية (عربي)" : "Biography (Arabic)"}</label>
          <textarea name="biographyAr" rows={4} dir="rtl" defaultValue={fieldValue(values, "biographyAr")} key={`biographyAr-${fieldValue(values, "biographyAr").slice(0, 20)}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "السيرة الذاتية (إنجليزي)" : "Biography (English)"}</label>
          <textarea name="biography" rows={4} defaultValue={fieldValue(values, "biography")} key={`biography-${fieldValue(values, "biography").slice(0, 20)}`} className={inputClass} />
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
