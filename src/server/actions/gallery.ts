"use server";

import { db } from "@/lib/prisma";
import { GalleryCategory } from "@/generated/prisma";
import { createAuditLog } from "@/lib/audit";
import { assertAdminSession } from "@/lib/action-auth";
import {
  storeFileDetailed,
  storeMultipleFiles,
  deleteBlobUrl,
  isAllowedImage,
  StorageError,
  resolveMimeType,
} from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues } from "@/lib/form-values";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ALBUM_FORM_KEYS = ["title", "titleAr", "description", "descriptionAr", "category"];

function parseAlbumForm(formData: FormData) {
  const title = String(formData.get("titleAr") ?? formData.get("title") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim() || title,
    titleAr: String(formData.get("titleAr") ?? "").trim() || title,
    description: String(formData.get("description") ?? "").trim() || null,
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim() || null,
    category: (String(formData.get("category") ?? "GENERAL") as GalleryCategory) || GalleryCategory.GENERAL,
    isPublished: formData.get("isPublished") === "on",
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

async function uniqueAlbumSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "album";
  let suffix = 0;
  while (true) {
    const candidate = suffix ? `${base}-${suffix}` : base;
    const existing = await db.galleryAlbum.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
  }
}

export async function createGalleryAlbum(
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues(
      { ok: false, error: t(locale, "غير مصرح", "Unauthorized") },
      formData,
      ALBUM_FORM_KEYS
    );
  }

  try {
    const parsed = parseAlbumForm(formData);
    if (!parsed.titleAr && !parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "عنوان الألبوم مطلوب", "Album title is required") } },
        formData,
        ALBUM_FORM_KEYS
      );
    }

    const slug = await uniqueAlbumSlug(parsed.titleAr || parsed.title);
    let coverImage: string | null = null;

    const coverFile = formData.get("coverImage") as File | null;
    if (coverFile && coverFile.size > 0) {
      const mime = resolveMimeType(coverFile);
      if (!isAllowedImage(mime)) throw new StorageError("invalid-image");
      const stored = await storeFileDetailed(coverFile, "gallery");
      coverImage = stored.url;
    }

    const album = await db.galleryAlbum.create({
      data: { ...parsed, slug, coverImage },
    });

    const imageFiles = formData.getAll("images") as File[];
    const validImages = imageFiles.filter((f) => f && f.size > 0);
    if (validImages.length) {
      const stored = await storeMultipleFiles(validImages, "gallery");
      await db.galleryImage.createMany({
        data: stored.map((file, index) => ({
          albumId: album.id,
          url: file.url,
          order: index,
        })),
      });
    }

    await createAuditLog({
      action: "CREATE",
      entity: "GalleryAlbum",
      entityId: album.id,
      details: { title: album.title },
    });

    revalidatePath(`/${locale}/admin/gallery`);
    revalidatePath(`/${locale}/gallery`);
    return { ok: true, redirectTo: `/${locale}/admin/gallery/${album.id}/edit` };
  } catch (error) {
    if (error instanceof StorageError) {
      return withFormValues(
        {
          ok: false,
          error:
            error.message === "invalid-image"
              ? t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format")
              : error.message,
        },
        formData,
        ALBUM_FORM_KEYS
      );
    }
    console.error("createGalleryAlbum:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر إنشاء الألبوم", "Could not create album") },
      formData,
      ALBUM_FORM_KEYS
    );
  }
}

export async function updateGalleryAlbum(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues(
      { ok: false, error: t(locale, "غير مصرح", "Unauthorized") },
      formData,
      ALBUM_FORM_KEYS
    );
  }

  try {
    const existing = await db.galleryAlbum.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) {
      return withFormValues(
        { ok: false, error: t(locale, "الألبوم غير موجود", "Album not found") },
        formData,
        ALBUM_FORM_KEYS
      );
    }

    const parsed = parseAlbumForm(formData);
    if (!parsed.titleAr && !parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "عنوان الألبوم مطلوب", "Album title is required") } },
        formData,
        ALBUM_FORM_KEYS
      );
    }

    let coverImage = existing.coverImage;
    const coverFile = formData.get("coverImage") as File | null;
    if (coverFile && coverFile.size > 0) {
      const mime = resolveMimeType(coverFile);
      if (!isAllowedImage(mime)) throw new StorageError("invalid-image");
      if (existing.coverImage) await deleteBlobUrl(existing.coverImage);
      const stored = await storeFileDetailed(coverFile, "gallery");
      coverImage = stored.url;
    }

    if (formData.get("removeCover") === "on" && coverImage) {
      await deleteBlobUrl(coverImage);
      coverImage = null;
    }

    await db.galleryAlbum.update({
      where: { id },
      data: {
        ...parsed,
        coverImage,
        slug: await uniqueAlbumSlug(parsed.titleAr || parsed.title, id),
      },
    });

    const imageFiles = formData.getAll("images") as File[];
    const validImages = imageFiles.filter((f) => f && f.size > 0);
    if (validImages.length) {
      const stored = await storeMultipleFiles(validImages, "gallery");
      const startOrder = existing.images.length;
      await db.galleryImage.createMany({
        data: stored.map((file, index) => ({
          albumId: id,
          url: file.url,
          order: startOrder + index,
        })),
      });
    }

    await createAuditLog({
      action: "UPDATE",
      entity: "GalleryAlbum",
      entityId: id,
      details: { title: parsed.title },
    });

    revalidatePath(`/${locale}/admin/gallery`);
    revalidatePath(`/${locale}/admin/gallery/${id}/edit`);
    revalidatePath(`/${locale}/gallery`);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageError) {
      return withFormValues(
        {
          ok: false,
          error:
            error.message === "invalid-image"
              ? t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format")
              : error.message,
        },
        formData,
        ALBUM_FORM_KEYS
      );
    }
    console.error("updateGalleryAlbum:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر تحديث الألبوم", "Could not update album") },
      formData,
      ALBUM_FORM_KEYS
    );
  }
}

export async function deleteGalleryImage(imageId: string, locale: string) {
  await assertAdminSession();
  const image = await db.galleryImage.findUnique({ where: { id: imageId } });
  if (image) {
    await deleteBlobUrl(image.url);
    await db.galleryImage.delete({ where: { id: imageId } });
    await createAuditLog({ action: "DELETE", entity: "GalleryImage", entityId: imageId });
  }
  revalidatePath(`/${locale}/admin/gallery`);
  revalidatePath(`/${locale}/gallery`);
}

export async function deleteGalleryAlbum(id: string, locale: string) {
  await assertAdminSession();
  const album = await db.galleryAlbum.findUnique({
    where: { id },
    include: { images: true },
  });
  if (album) {
    if (album.coverImage) await deleteBlobUrl(album.coverImage);
    for (const img of album.images) await deleteBlobUrl(img.url);
    await db.galleryAlbum.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "GalleryAlbum", entityId: id });
  }
  revalidatePath(`/${locale}/admin/gallery`);
  revalidatePath(`/${locale}/gallery`);
  redirect(`/${locale}/admin/gallery`);
}
