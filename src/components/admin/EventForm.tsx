"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
import { createEvent, updateEvent } from "@/server/actions/events";

type EventFormProps = {
  locale: string;
  mode: "create" | "edit";
  eventId?: string;
  defaultValues?: {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    eventDate?: string;
    isPublished?: boolean;
    images?: string[];
  };
};

export function EventForm({ locale, mode, eventId, defaultValues }: EventFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/admin/events`;
  const action = mode === "create" ? createEvent : updateEvent.bind(null, eventId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const values = usePersistedFormValues(
    {
      title: defaultValues?.title ?? "",
      titleAr: defaultValues?.titleAr ?? "",
      description: defaultValues?.description ?? "",
      descriptionAr: defaultValues?.descriptionAr ?? "",
      eventDate: defaultValues?.eventDate ?? "",
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
          {state.fieldErrors?.eventDate && <p>{state.fieldErrors.eventDate}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "اسم الفعالية (عربي) *" : "Event name (Arabic) *"}</label>
          <input name="titleAr" dir="rtl" defaultValue={fieldValue(values, "titleAr")} key={`titleAr-${fieldValue(values, "titleAr")}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "الاسم (إنجليزي)" : "Name (English)"}</label>
          <input name="title" defaultValue={fieldValue(values, "title")} key={`title-${fieldValue(values, "title")}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "تاريخ الفعالية *" : "Event date *"}</label>
          <input name="eventDate" type={InputTypes.DATE} defaultValue={fieldValue(values, "eventDate")} key={`eventDate-${fieldValue(values, "eventDate")}`} className={inputClass} required />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "نبذة (عربي)" : "Description (Arabic)"}</label>
          <textarea name="descriptionAr" rows={4} dir="rtl" defaultValue={fieldValue(values, "descriptionAr")} key={`descriptionAr-${fieldValue(values, "descriptionAr").slice(0, 20)}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "نبذة (إنجليزي)" : "Description (English)"}</label>
          <textarea name="description" rows={4} defaultValue={fieldValue(values, "description")} key={`description-${fieldValue(values, "description").slice(0, 20)}`} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "صور الفعالية" : "Event images"}</label>
          {defaultValues?.images && defaultValues.images.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2">
              {defaultValues.images.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="h-24 w-full rounded-lg border object-cover" />
              ))}
            </div>
          )}
          <input name="images" type={InputTypes.FILE} accept="image/jpeg,image/jpg,image/png,image/webp" multiple className={inputClass} />
          <p className="mt-1 text-xs text-slate-500">{isAr ? "يمكن اختيار صورة واحدة أو عدة صور" : "Select one or multiple images"}</p>
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="isPublished" type={InputTypes.CHECKBOX} defaultChecked={defaultValues?.isPublished ?? true} />
          {isAr ? "نشر على الموقع" : "Publish on website"}
        </label>
      </div>

      <FormActions
        locale={locale}
        cancelHref={listHref}
        isSubmitting={pending}
        submitLabel={pending ? (isAr ? "جاري الحفظ..." : "Saving...") : isAr ? "حفظ الفعالية" : "Save event"}
      />
    </form>
  );
}
