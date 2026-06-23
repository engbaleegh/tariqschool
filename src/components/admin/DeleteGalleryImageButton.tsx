"use client";

import { deleteGalleryImage } from "@/server/actions/gallery";

type DeleteGalleryImageButtonProps = {
  imageId: string;
  locale: string;
};

export function DeleteGalleryImageButton({ imageId, locale }: DeleteGalleryImageButtonProps) {
  const isAr = locale === "ar";

  return (
    <form action={deleteGalleryImage.bind(null, imageId, locale)}>
      <button
        type="submit"
        className="w-full text-xs text-red-600 hover:text-red-800"
        onClick={(e) => {
          if (!confirm(isAr ? "حذف هذه الصورة؟" : "Delete this image?")) {
            e.preventDefault();
          }
        }}
      >
        {isAr ? "حذف" : "Delete"}
      </button>
    </form>
  );
}
