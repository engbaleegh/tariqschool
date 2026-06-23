"use client";

import { deleteGalleryAlbum } from "@/server/actions/gallery";

type DeleteGalleryAlbumButtonProps = {
  albumId: string;
  locale: string;
};

export function DeleteGalleryAlbumButton({ albumId, locale }: DeleteGalleryAlbumButtonProps) {
  const isAr = locale === "ar";

  return (
    <form action={deleteGalleryAlbum.bind(null, albumId, locale)}>
      <button
        type="submit"
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        onClick={(e) => {
          if (!confirm(isAr ? "حذف هذا الألبوم وجميع صوره؟" : "Delete this album and all its images?")) {
            e.preventDefault();
          }
        }}
      >
        {isAr ? "حذف الألبوم" : "Delete album"}
      </button>
    </form>
  );
}
