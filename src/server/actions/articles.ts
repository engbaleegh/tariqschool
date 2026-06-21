"use server";

import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { slugify, resolveBilingualField } from "@/lib/utils";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues } from "@/lib/form-values";
import { storeFileDetailed, isAllowedImage, StorageError, resolveMimeType } from "@/lib/storage";
import { assertAdminSession } from "@/lib/action-auth";
import { revalidatePath } from "next/cache";

const ARTICLE_FORM_KEYS = [
  "title",
  "titleAr",
  "excerpt",
  "excerptAr",
  "content",
  "contentAr",
];

function parseArticleForm(formData: FormData) {
  const isPublished = formData.get("isPublished") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "");

  const title = resolveBilingualField(
    String(formData.get("title") ?? ""),
    String(formData.get("titleAr") ?? "")
  );
  const content = resolveBilingualField(
    String(formData.get("content") ?? ""),
    String(formData.get("contentAr") ?? "")
  );

  const categoryId = String(formData.get("categoryId") ?? "").trim();

  return {
    title,
    titleAr: String(formData.get("titleAr") ?? "").trim() || title,
    content,
    contentAr: String(formData.get("contentAr") ?? "").trim() || content,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    excerptAr: String(formData.get("excerptAr") ?? "").trim() || null,
    featuredImage: String(formData.get("featuredImage") ?? "").trim() || null,
    categoryId: categoryId || null,
    isPublished,
    isFeatured: formData.get("isFeatured") === "on",
    publishedAt:
      isPublished && publishedAtRaw
        ? new Date(publishedAtRaw)
        : isPublished
          ? new Date()
          : null,
  };
}

async function parseFeaturedImage(formData: FormData, existing?: string | null) {
  const file = formData.get("featuredImageFile") as File | null;
  let featuredImage = String(formData.get("featuredImage") ?? "").trim() || existing || null;
  if (file && file.size > 0) {
    const mime = resolveMimeType(file);
    if (!isAllowedImage(mime)) throw new StorageError("invalid-image");
    const stored = await storeFileDetailed(file, "articles");
    featuredImage = stored.url;
  }
  return featuredImage;
}

async function uniqueSlug(title: string, excludeId?: string) {
  const baseSlug = slugify(title) || "article";
  let suffix = 0;

  while (true) {
    const candidate = suffix ? `${baseSlug}-${suffix}` : baseSlug;
    const existing = await db.article.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
  }
}

export async function createArticle(
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
      ARTICLE_FORM_KEYS
    );
  }

  try {
    const parsed = parseArticleForm(formData);

    if (!parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "العنوان مطلوب", "Title is required") } },
        formData,
        ARTICLE_FORM_KEYS
      );
    }
    if (!parsed.content) {
      return withFormValues(
        { ok: false, fieldErrors: { content: t(locale, "المحتوى مطلوب", "Content is required") } },
        formData,
        ARTICLE_FORM_KEYS
      );
    }

    const featuredImage = await parseFeaturedImage(formData);
    const slug = await uniqueSlug(parsed.title);

    const article = await db.article.create({
      data: { ...parsed, featuredImage, slug },
    });

    await createAuditLog({
      action: "CREATE",
      entity: "Article",
      entityId: article.id,
      details: { title: article.title },
    });

    revalidatePath(`/${locale}/admin/articles`);
    revalidatePath(`/${locale}/blog`);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageError) {
      const msg =
        error.message === "invalid-image"
          ? t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format")
          : error.message;
      return withFormValues({ ok: false, error: msg }, formData, ARTICLE_FORM_KEYS);
    }
    console.error("createArticle:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر حفظ المقال", "Could not save article") },
      formData,
      ARTICLE_FORM_KEYS
    );
  }
}

export async function updateArticle(
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
      ARTICLE_FORM_KEYS
    );
  }

  try {
    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return withFormValues(
        { ok: false, error: t(locale, "المقال غير موجود", "Article not found") },
        formData,
        ARTICLE_FORM_KEYS
      );
    }

    const parsed = parseArticleForm(formData);
    if (!parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "العنوان مطلوب", "Title is required") } },
        formData,
        ARTICLE_FORM_KEYS
      );
    }
    if (!parsed.content) {
      return withFormValues(
        { ok: false, fieldErrors: { content: t(locale, "المحتوى مطلوب", "Content is required") } },
        formData,
        ARTICLE_FORM_KEYS
      );
    }

    const featuredImage = await parseFeaturedImage(formData, existing.featuredImage);

    const article = await db.article.update({
      where: { id },
      data: {
        ...parsed,
        featuredImage,
        slug: await uniqueSlug(parsed.title, id),
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entity: "Article",
      entityId: id,
      details: { title: article.title },
    });

    revalidatePath(`/${locale}/admin/articles`);
    revalidatePath(`/${locale}/blog`);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageError) {
      const msg =
        error.message === "invalid-image"
          ? t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format")
          : error.message;
      return withFormValues({ ok: false, error: msg }, formData, ARTICLE_FORM_KEYS);
    }
    console.error("updateArticle:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر تحديث المقال", "Could not update article") },
      formData,
      ARTICLE_FORM_KEYS
    );
  }
}

export async function deleteArticle(id: string, locale: string) {
  await assertAdminSession();
  await db.article.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Article", entityId: id });
  revalidatePath(`/${locale}/admin/articles`);
  revalidatePath(`/${locale}/blog`);
}
