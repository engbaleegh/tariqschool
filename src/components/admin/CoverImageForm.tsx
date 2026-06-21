"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes } from "@/constants/enums";
import { updateHeroCover, type HeroCoverActionState } from "@/server/actions/settings";

type CoverImageFormProps = {
  locale: string;
  currentCover: string;
};

const initialState: HeroCoverActionState = { ok: false };

export function CoverImageForm({ locale, currentCover }: CoverImageFormProps) {
  const [preview, setPreview] = useState(currentCover);
  const [state, formAction, pending] = useActionState(updateHeroCover, initialState);
  const router = useRouter();
  const isAr = locale === "ar";

  useEffect(() => {
    setPreview(currentCover);
  }, [currentCover]);

  useEffect(() => {
    if (state.ok && state.imageUrl) {
      setPreview(state.imageUrl);
      router.refresh();
    }
  }, [state.ok, state.imageUrl, router]);

  return (
    <form action={formAction} className={formCardClass} encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="existingUrl" value={currentCover} />
      <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-900">
        <p className="font-medium">{isAr ? "الأبعاد الموصى بها" : "Recommended dimensions"}</p>
        <p className="mt-1 text-blue-800">
          {isAr
            ? "1920 × 600 بكسل (نسبة 16:5) — JPG, JPEG, PNG, WEBP — حتى 10 ميجابايت"
            : "1920 × 600 px (16:5 ratio) — JPG, JPEG, PNG, WEBP — up to 10MB"}
        </p>
        <p className="mt-1 text-xs text-blue-700">
          {isAr
            ? "يتم تحسين الصورة تلقائياً وإنشاء نسخ متجاوبة."
            : "Images are automatically optimized with responsive variants."}
        </p>
      </div>
      {preview && (
        <div className="relative mt-4 h-48 overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="mt-4">
        <label className={labelClass}>{isAr ? "صورة الغلاف" : "Cover image"}</label>
        <input
          name="coverImage"
          type={InputTypes.FILE}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className={inputClass}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
      </div>
      {state.error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {isAr ? "تم حفظ صورة الغلاف بنجاح" : "Cover image saved successfully"}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? isAr
            ? "جاري الحفظ..."
            : "Saving..."
          : isAr
            ? "حفظ صورة الغلاف"
            : "Save cover image"}
      </button>
    </form>
  );
}
