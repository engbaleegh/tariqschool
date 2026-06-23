"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FormActions from "@/components/admin/FormActions";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes } from "@/constants/enums";
import { initialFormState } from "@/lib/action-state";
import { fieldValue, usePersistedFormValues } from "@/hooks/usePersistedFormValues";
import { createGalleryAlbum, updateGalleryAlbum } from "@/server/actions/gallery";
import { DeleteGalleryImageButton } from "@/components/admin/DeleteGalleryImageButton";

const CATEGORIES = [
  { value: "GENERAL", ar: "عام", en: "General" },
  { value: "ACTIVITIES", ar: "أنشطة", en: "Activities" },
  { value: "CELEBRATIONS", ar: "احتفالات", en: "Celebrations" },
  { value: "SPORTS", ar: "رياضة", en: "Sports" },
  { value: "TRIPS", ar: "رحلات", en: "Trips" },
  { value: "CLASSROOMS", ar: "فصول", en: "Classrooms" },
];

type GalleryImage = { id: string; url: string; alt?: string | null };

type GalleryAlbumFormProps = {
  locale: string;
  mode: "create" | "edit";
  albumId?: string;
  defaultValues?: {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    category?: string;
    coverImage?: string | null;
    isPublished?: boolean;
    order?: number;
    images?: GalleryImage[];
  };
};

export function GalleryAlbumForm({ locale, mode, albumId, defaultValues }: GalleryAlbumFormProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const listHref = `/${locale}/admin/gallery`;
  const action = mode === "create" ? createGalleryAlbum : updateGalleryAlbum.bind(null, albumId!);
  const [state, formAction, pending] = useActionState(action, initialFormState);

  const values = usePersistedFormValues(
    {
      title: defaultValues?.title ?? "",
      titleAr: defaultValues?.titleAr ?? "",
      description: defaultValues?.description ?? "",
      descriptionAr: defaultValues?.descriptionAr ?? "",
      category: defaultValues?.category ?? "GENERAL",
    },
    state
  );

  useEffect(() => {
    if (state.ok) {
      router.push(state.redirectTo ?? `${listHref}?saved=1`);
      router.refresh();
    }
  }, [state.ok, state.redirectTo, router, listHref]);

  return (
    <form action={formAction} className={formCardClass} encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />

      {(state.error || state.fieldErrors?.title) && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error ?? state.fieldErrors?.title}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "عنوان الألبوم (عربي) *" : "Album title (Arabic) *"}</label>
          <input
            name="titleAr"
            type={InputTypes.TEXT}
            dir="rtl"
            defaultValue={fieldValue(values, "titleAr")}
            key={`titleAr-${fieldValue(values, "titleAr")}`}
            className={inputClass}
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
          <label className={labelClass}>{isAr ? "التصنيف" : "Category"}</label>
          <select
            name="category"
            className={inputClass}
            defaultValue={fieldValue(values, "category", "GENERAL")}
            key={`category-${fieldValue(values, "category")}`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {isAr ? cat.ar : cat.en}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>{isAr ? "صورة الغلاف" : "Cover image"}</label>
          {defaultValues?.coverImage && (
            <div className="mb-3 flex items-center gap-4">
              <div className="relative h-24 w-36 overflow-hidden rounded-lg border border-slate-200">
                <Image src={defaultValues.coverImage} alt="" fill className="object-cover" unoptimized />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input name="removeCover" type={InputTypes.CHECKBOX} />
                {isAr ? "حذف الغلاف" : "Remove cover"}
              </label>
            </div>
          )}
          <input name="coverImage" type={InputTypes.FILE} accept="image/jpeg,image/jpg,image/png,image/webp" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            {mode === "create"
              ? isAr
                ? "صور الألبوم (متعدد)"
                : "Album images (multiple)"
              : isAr
                ? "إضافة صور جديدة"
                : "Add new images"}
          </label>
          <input
            name="images"
            type={InputTypes.FILE}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className={inputClass}
          />
        </div>

        {defaultValues?.images && defaultValues.images.length > 0 && (
          <div className="sm:col-span-2">
            <p className={labelClass}>{isAr ? "الصور الحالية" : "Current images"}</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {defaultValues.images.map((img) => (
                <div key={img.id} className="overflow-hidden rounded-lg border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-28 w-full object-cover" />
                  <div className="p-2">
                    <DeleteGalleryImageButton imageId={img.id} locale={locale} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input name="isPublished" type={InputTypes.CHECKBOX} defaultChecked={defaultValues?.isPublished ?? true} />
          {isAr ? "نشر للزوار" : "Publish for visitors"}
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
                ? "إنشاء الألبوم"
                : "Create album"
              : isAr
                ? "حفظ التغييرات"
                : "Save changes"
        }
      />
    </form>
  );
}
