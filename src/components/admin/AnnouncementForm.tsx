"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes, Routes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { createAnnouncement, updateAnnouncement } from "@/server/actions/announcements";

type AnnouncementFormProps = {
  locale: string;
  mode: "create" | "edit";
  announcementId?: string;
  defaultValues?: {
    title?: string;
    titleAr?: string;
    excerpt?: string;
    excerptAr?: string;
    content?: string;
    contentAr?: string;
    isPublished?: boolean;
    publishedAt?: string;
  };
};

export function AnnouncementForm({
  locale,
  mode,
  announcementId,
  defaultValues,
}: AnnouncementFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/${Routes.ADMIN}/${Routes.ANNOUNCEMENTS}`;
  const action =
    mode === "create" ? createAnnouncement : updateAnnouncement.bind(null, announcementId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  useEffect(() => {
    if (state.ok) router.push(`${listHref}?saved=1`);
  }, [state.ok, router, listHref]);

  return (
    <form action={formAction} className={formCardClass}>
      <input type="hidden" name="locale" value={locale} />

      {(state.error || state.fieldErrors) && (
        <div className="mb-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error && <p>{state.error}</p>}
          {state.fieldErrors?.title && <p>{state.fieldErrors.title}</p>}
          {state.fieldErrors?.content && <p>{state.fieldErrors.content}</p>}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className={labelClass}>{isAr ? "العنوان (عربي) *" : "Title (Arabic) *"}</label>
          <input name="titleAr" type={InputTypes.TEXT} dir="rtl" defaultValue={defaultValues?.titleAr ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
          <input name="title" type={InputTypes.TEXT} defaultValue={defaultValues?.title ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "مقتطف (عربي)" : "Excerpt (Arabic)"}</label>
          <input name="excerptAr" type={InputTypes.TEXT} dir="rtl" defaultValue={defaultValues?.excerptAr ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المحتوى (عربي) *" : "Content (Arabic) *"}</label>
          <textarea name="contentAr" rows={6} dir="rtl" defaultValue={defaultValues?.contentAr ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المحتوى (إنجليزي)" : "Content (English)"}</label>
          <textarea name="content" rows={6} defaultValue={defaultValues?.content ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "تاريخ النشر" : "Publish date"}</label>
          <input name="publishedAt" type={InputTypes.DATE} defaultValue={defaultValues?.publishedAt ?? ""} className={inputClass} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input name="isPublished" type={InputTypes.CHECKBOX} defaultChecked={defaultValues?.isPublished ?? true} />
          {isAr ? "نشر فوراً" : "Publish immediately"}
        </label>
      </div>

      <FormActions
        cancelHref={listHref}
        submitLabel={pending ? (isAr ? "جاري الحفظ..." : "Saving...") : isAr ? "حفظ الإعلان" : "Save announcement"}
      />
    </form>
  );
}
