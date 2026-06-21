"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes, Routes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { createSchoolResult } from "@/server/actions/results";

const CATEGORIES = [
  { ar: "نتائج الفصل", en: "Semester Results" },
  { ar: "النتائج النهائية", en: "Final Results" },
  { ar: "نتائج الامتحانات", en: "Examination Results" },
  { ar: "نتائج الدرجات", en: "Grade Results" },
];

type ResultUploadFormProps = {
  locale: string;
};

export function ResultUploadForm({ locale }: ResultUploadFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/${Routes.ADMIN}/${Routes.RESULTS}`;
  const [state, formAction, pending] = useActionState(createSchoolResult, initialFormState);

  useEffect(() => {
    if (state.ok) router.push(`${listHref}?saved=1`);
  }, [state.ok, router, listHref]);

  return (
    <form action={formAction} className={formCardClass} encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />

      {(state.error || state.fieldErrors) && (
        <div className="mb-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error && <p>{state.error}</p>}
          {state.fieldErrors?.title && <p>{state.fieldErrors.title}</p>}
          {state.fieldErrors?.resultFile && <p>{state.fieldErrors.resultFile}</p>}
        </div>
      )}

      {state.ok && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {isAr ? "تم رفع النتيجة بنجاح" : "Result uploaded successfully"}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "عنوان النتيجة *" : "Result title *"}</label>
          <input name="titleAr" type={InputTypes.TEXT} dir="rtl" className={inputClass} placeholder={isAr ? "مثال: نتائج الفصل الأول" : "e.g. First Semester Results"} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
          <input name="title" type={InputTypes.TEXT} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الوصف" : "Description"}</label>
          <textarea name="descriptionAr" rows={3} dir="rtl" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "العام الدراسي" : "Academic year"}</label>
          <input name="academicYear" type={InputTypes.TEXT} placeholder="2025-2026" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "الفصل الدراسي" : "Semester"}</label>
          <input name="semester" type={InputTypes.TEXT} placeholder={isAr ? "الفصل الأول" : "First semester"} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "التصنيف" : "Category"}</label>
          <select name="category" className={inputClass} defaultValue="">
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
            {isAr ? "ملف النتيجة (PDF, JPG, PNG, JPEG) *" : "Result file (PDF, JPG, PNG, JPEG) *"}
          </label>
          <input
            name="resultFile"
            type={InputTypes.FILE}
            required
            accept="application/pdf,image/jpeg,image/jpg,image/png"
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="isPublished" type={InputTypes.CHECKBOX} defaultChecked />
          {isAr ? "نشر للزوار" : "Publish for visitors"}
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? (isAr ? "جاري الرفع..." : "Uploading...") : isAr ? "رفع النتيجة" : "Upload result"}
      </button>
    </form>
  );
}
