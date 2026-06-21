"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes, Routes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
import { createSchoolResult, updateSchoolResult } from "@/server/actions/results";

const CATEGORIES = [
  { ar: "نتائج الفصل", en: "Semester Results" },
  { ar: "النتائج النهائية", en: "Final Results" },
  { ar: "نتائج الامتحانات", en: "Examination Results" },
  { ar: "نتائج الدرجات", en: "Grade Results" },
];

type ResultFormProps = {
  locale: string;
  mode: "create" | "edit";
  resultId?: string;
  defaultValues?: {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    academicYear?: string;
    semester?: string;
    category?: string;
    isPublished?: boolean;
    fileUrl?: string;
    fileType?: string;
  };
};

export function ResultForm({ locale, mode, resultId, defaultValues }: ResultFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/${Routes.ADMIN}/${Routes.RESULTS}`;
  const action =
    mode === "create" ? createSchoolResult : updateSchoolResult.bind(null, resultId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const values = usePersistedFormValues(
    {
      title: defaultValues?.title ?? "",
      titleAr: defaultValues?.titleAr ?? "",
      description: defaultValues?.description ?? "",
      descriptionAr: defaultValues?.descriptionAr ?? "",
      academicYear: defaultValues?.academicYear ?? "",
      semester: defaultValues?.semester ?? "",
      category: defaultValues?.category ?? "",
    },
    state
  );

  useEffect(() => {
    if (state.ok) router.push(`${listHref}?saved=1`);
  }, [state.ok, router, listHref]);

  return (
    <form action={formAction} className={formCardClass} encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />

      {(state.error || state.fieldErrors) && (
        <div className="mb-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error && <p>{state.error}</p>}
          {state.fieldErrors?.title && <p>{state.fieldErrors.title}</p>}
          {state.fieldErrors?.resultFile && <p>{state.fieldErrors.resultFile}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "عنوان النتيجة *" : "Result title *"}</label>
          <input
            name="titleAr"
            type={InputTypes.TEXT}
            dir="rtl"
            defaultValue={fieldValue(values, "titleAr")}
            key={`titleAr-${fieldValue(values, "titleAr")}`}
            className={inputClass}
            placeholder={isAr ? "مثال: نتائج الفصل الأول" : "e.g. First Semester Results"}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
          <input
            name="title"
            type={InputTypes.TEXT}
            defaultValue={fieldValue(values, "title")}
            key={`title-${fieldValue(values, "title")}`}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الوصف" : "Description"}</label>
          <textarea
            name="descriptionAr"
            rows={3}
            dir="rtl"
            defaultValue={fieldValue(values, "descriptionAr")}
            key={`descriptionAr-${fieldValue(values, "descriptionAr")}`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "العام الدراسي" : "Academic year"}</label>
          <input
            name="academicYear"
            type={InputTypes.TEXT}
            placeholder="2025-2026"
            defaultValue={fieldValue(values, "academicYear")}
            key={`academicYear-${fieldValue(values, "academicYear")}`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "الفصل الدراسي" : "Semester"}</label>
          <input
            name="semester"
            type={InputTypes.TEXT}
            placeholder={isAr ? "الفصل الأول" : "First semester"}
            defaultValue={fieldValue(values, "semester")}
            key={`semester-${fieldValue(values, "semester")}`}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "التصنيف" : "Category"}</label>
          <select
            name="category"
            className={inputClass}
            defaultValue={fieldValue(values, "category")}
            key={`category-${fieldValue(values, "category")}`}
          >
            <option value="">{isAr ? "اختر التصنيف" : "Select category"}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.en} value={cat.en}>
                {isAr ? cat.ar : cat.en}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>
            {mode === "create"
              ? isAr
                ? "ملف النتيجة (PDF, JPG, PNG, JPEG, WEBP) *"
                : "Result file (PDF, JPG, PNG, JPEG, WEBP) *"
              : isAr
                ? "استبدال الملف (اختياري)"
                : "Replace file (optional)"}
          </label>
          {defaultValues?.fileUrl && (
            <p className="mb-2 text-xs text-slate-500">
              {isAr ? "الملف الحالي:" : "Current file:"}{" "}
              <a href={defaultValues.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {isAr ? "عرض" : "View"}
              </a>
            </p>
          )}
          <input
            name="resultFile"
            type={InputTypes.FILE}
            required={mode === "create"}
            accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            name="isPublished"
            type={InputTypes.CHECKBOX}
            defaultChecked={defaultValues?.isPublished ?? true}
          />
          {isAr ? "نشر للزوار" : "Publish for visitors"}
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending
          ? isAr
            ? "جاري الرفع..."
            : "Uploading..."
          : mode === "create"
            ? isAr
              ? "رفع النتيجة"
              : "Upload result"
            : isAr
              ? "حفظ التغييرات"
              : "Save changes"}
      </button>
    </form>
  );
}
