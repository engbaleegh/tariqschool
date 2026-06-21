"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
import { createArticle, updateArticle } from "@/server/actions/articles";

type ArticleFormProps = {
  locale: string;
  mode: "create" | "edit";
  articleId?: string;
  defaultValues?: {
    title?: string;
    titleAr?: string;
    excerpt?: string;
    excerptAr?: string;
    content?: string;
    contentAr?: string;
    isPublished?: boolean;
    featuredImage?: string | null;
  };
};

export function ArticleForm({ locale, mode, articleId, defaultValues }: ArticleFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/admin/articles`;
  const action = mode === "create" ? createArticle : updateArticle.bind(null, articleId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const values = usePersistedFormValues(
    {
      title: defaultValues?.title ?? "",
      titleAr: defaultValues?.titleAr ?? "",
      excerpt: defaultValues?.excerpt ?? "",
      excerptAr: defaultValues?.excerptAr ?? "",
      content: defaultValues?.content ?? "",
      contentAr: defaultValues?.contentAr ?? "",
    },
    state
  );

  useEffect(() => {
    if (state.ok) router.push(`${listHref}?saved=1`);
  }, [state.ok, router, listHref]);

  return (
    <form action={formAction} className={formCardClass} encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />
      {defaultValues?.featuredImage && (
        <input type="hidden" name="featuredImage" value={defaultValues.featuredImage} />
      )}

      {(state.error || state.fieldErrors) && (
        <div className="mb-4 space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error && <p>{state.error}</p>}
          {state.fieldErrors?.title && <p>{state.fieldErrors.title}</p>}
          {state.fieldErrors?.content && <p>{state.fieldErrors.content}</p>}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className={labelClass}>{isAr ? "العنوان (عربي) *" : "Title (Arabic) *"}</label>
          <input
            name="titleAr"
            type={InputTypes.TEXT}
            dir="rtl"
            defaultValue={fieldValue(values, "titleAr")}
            key={`titleAr-${fieldValue(values, "titleAr")}`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
          <input
            name="title"
            type={InputTypes.TEXT}
            defaultValue={fieldValue(values, "title")}
            key={`title-${fieldValue(values, "title")}`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "مقتطف (عربي)" : "Excerpt (Arabic)"}</label>
          <input
            name="excerptAr"
            type={InputTypes.TEXT}
            dir="rtl"
            defaultValue={fieldValue(values, "excerptAr")}
            key={`excerptAr-${fieldValue(values, "excerptAr")}`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المحتوى (عربي) *" : "Content (Arabic) *"}</label>
          <textarea
            name="contentAr"
            rows={8}
            dir="rtl"
            defaultValue={fieldValue(values, "contentAr")}
            key={`contentAr-${fieldValue(values, "contentAr").slice(0, 20)}`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "المحتوى (إنجليزي)" : "Content (English)"}</label>
          <textarea
            name="content"
            rows={8}
            defaultValue={fieldValue(values, "content")}
            key={`content-${fieldValue(values, "content").slice(0, 20)}`}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{isAr ? "صورة المقال" : "Featured image"}</label>
          {defaultValues?.featuredImage && (
            <div className="mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={defaultValues.featuredImage}
                alt=""
                className="h-32 w-auto rounded-lg border border-slate-200 object-cover"
              />
            </div>
          )}
          <input
            name="featuredImageFile"
            type={InputTypes.FILE}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="isPublished"
            type={InputTypes.CHECKBOX}
            defaultChecked={defaultValues?.isPublished ?? true}
          />
          {isAr ? "نشر فوراً" : "Publish immediately"}
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
            : isAr
              ? "حفظ المقال"
              : "Save article"
        }
      />
    </form>
  );
}
