"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
import { createCalendarEntry, updateCalendarEntry } from "@/server/actions/calendar";

type CalendarEventFormProps = {
  locale: string;
  mode: "create" | "edit";
  entryId?: string;
  defaultValues?: {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    isPublished?: boolean;
  };
};

const TYPES = [
  { value: "GENERAL", ar: "عام", en: "General" },
  { value: "SEMESTER", ar: "فصل دراسي", en: "Semester" },
  { value: "EXAM", ar: "امتحان", en: "Exam" },
  { value: "HOLIDAY", ar: "إجازة", en: "Holiday" },
  { value: "ACTIVITY", ar: "نشاط", en: "Activity" },
];

export function CalendarEventForm({ locale, mode, entryId, defaultValues }: CalendarEventFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/admin/calendar`;
  const action = mode === "create" ? createCalendarEntry : updateCalendarEntry.bind(null, entryId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const values = usePersistedFormValues(
    {
      title: defaultValues?.title ?? "",
      titleAr: defaultValues?.titleAr ?? "",
      description: defaultValues?.description ?? "",
      descriptionAr: defaultValues?.descriptionAr ?? "",
      startDate: defaultValues?.startDate ?? "",
      endDate: defaultValues?.endDate ?? "",
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
          {state.fieldErrors?.title && <p>{state.fieldErrors.title}</p>}
          {state.fieldErrors?.startDate && <p>{state.fieldErrors.startDate}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "عنوان الحدث (عربي) *" : "Event title (Arabic) *"}</label>
          <input name="titleAr" dir="rtl" defaultValue={fieldValue(values, "titleAr")} key={`titleAr-${fieldValue(values, "titleAr")}`} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "تاريخ البداية *" : "Start date *"}</label>
          <input name="startDate" type={InputTypes.DATE} defaultValue={fieldValue(values, "startDate")} key={`startDate-${fieldValue(values, "startDate")}`} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "تاريخ النهاية" : "End date"}</label>
          <input name="endDate" type={InputTypes.DATE} defaultValue={fieldValue(values, "endDate")} key={`endDate-${fieldValue(values, "endDate")}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "النوع" : "Type"}</label>
          <select name="type" defaultValue={defaultValues?.type ?? "GENERAL"} className={inputClass}>
            {TYPES.map((type) => (
              <option key={type.value} value={type.value}>{isAr ? type.ar : type.en}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الوصف (عربي)" : "Description (Arabic)"}</label>
          <textarea name="descriptionAr" rows={3} dir="rtl" defaultValue={fieldValue(values, "descriptionAr")} key={`descriptionAr-${fieldValue(values, "descriptionAr").slice(0, 20)}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الوصف (إنجليزي)" : "Description (English)"}</label>
          <textarea name="description" rows={3} defaultValue={fieldValue(values, "description")} key={`description-${fieldValue(values, "description").slice(0, 20)}`} className={inputClass} />
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="isPublished" type={InputTypes.CHECKBOX} defaultChecked={defaultValues?.isPublished ?? true} />
          {isAr ? "عرض في التقويم العام" : "Show on public calendar"}
        </label>
      </div>

      <FormActions
        locale={locale}
        cancelHref={listHref}
        isSubmitting={pending}
        submitLabel={pending ? (isAr ? "جاري الحفظ..." : "Saving...") : isAr ? "حفظ الحدث" : "Save event"}
      />
    </form>
  );
}
