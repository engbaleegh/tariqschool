import { del, put, type PutBlobResult } from "@vercel/blob";
import sharp from "sharp";

const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const PDF_TYPE = "application/pdf";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const HERO_TARGET_WIDTH = 1920;
const HERO_TARGET_HEIGHT = 800;
const RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export type StoredFile = {
  url: string;
  pathname: string;
  mimeType: string;
  size: number;
  responsiveUrls?: Record<string, string>;
};

export type BlobUploadOptions = {
  /** Optimize as homepage hero (1920x800 cover crop) */
  heroCover?: boolean;
  /** Skip image optimization (upload raw bytes) */
  raw?: boolean;
  /** Resize to fit inside bounds without cropping (blog/article images) */
  contentImage?: boolean;
};

export function detectResultFileType(mimeType: string): "PDF" | "IMAGE" {
  return mimeType === PDF_TYPE ? "PDF" : "IMAGE";
}

export function isAllowedImage(mimeType: string) {
  return IMAGE_TYPES.has(mimeType);
}

export function isAllowedResultFile(mimeType: string) {
  return mimeType === PDF_TYPE || IMAGE_TYPES.has(mimeType);
}

export function resolveMimeType(file: File): string {
  if (file.type) return file.type.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  return map[ext ?? ""] ?? "application/octet-stream";
}

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getBlobPutOptions(contentType: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    throw new StorageError(
      "Vercel Blob is not configured. Link a public Blob store to this project (BLOB_READ_WRITE_TOKEN)."
    );
  }

  // Use only BLOB_READ_WRITE_TOKEN — do not mix with BLOB_STORE_ID from a different store.
  return {
    access: "public" as const,
    contentType,
    addRandomSuffix: true,
    token,
  };
}

async function uploadBuffer(
  buffer: Buffer,
  pathname: string,
  contentType: string
): Promise<PutBlobResult> {
  try {
    return await put(pathname, buffer, getBlobPutOptions(contentType));
  } catch (error) {
    console.error("Vercel Blob upload failed:", error);
    const message = error instanceof Error ? error.message : "Unknown blob error";
    throw new StorageError(`Vercel Blob upload failed: ${message}`);
  }
}

async function optimizeImage(buffer: Buffer, width: number): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}

async function optimizeContentImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 90 })
    .toBuffer();
}

async function optimizeHeroCover(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({
      width: HERO_TARGET_WIDTH,
      height: HERO_TARGET_HEIGHT,
      fit: "cover",
      position: "centre",
    })
    .webp({ quality: 85 })
    .toBuffer();
}

export async function deleteBlobUrl(url: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;

  try {
    await del(url, { token });
  } catch (error) {
    console.warn("Blob delete failed:", error);
  }
}

export async function storeFileDetailed(
  file: File,
  folder: string,
  options: BlobUploadOptions = {}
): Promise<StoredFile> {
  const mimeType = resolveMimeType(file);
  const isImage = isAllowedImage(mimeType);
  const maxSize = isImage ? MAX_IMAGE_BYTES : MAX_FILE_BYTES;

  if (file.size > maxSize) {
    throw new StorageError(
      isImage
        ? `Image must be under ${MAX_IMAGE_BYTES / 1024 / 1024}MB`
        : `File must be under ${MAX_FILE_BYTES / 1024 / 1024}MB`
    );
  }

  const timestamp = Date.now();
  const baseName = safeFilename(file.name.replace(/\.[^.]+$/, ""));

  if (!isImage) {
    if (!isAllowedResultFile(mimeType)) {
      throw new StorageError("Unsupported file type. Allowed: JPG, JPEG, PNG, WEBP, PDF");
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const blob = await uploadBuffer(bytes, `${folder}/${timestamp}-${safeFilename(file.name)}`, mimeType);
    return { url: blob.url, pathname: blob.pathname, mimeType, size: bytes.length };
  }

  const input = Buffer.from(await file.arrayBuffer());

  if (options.raw) {
    const blob = await uploadBuffer(input, `${folder}/${timestamp}-${safeFilename(file.name)}`, mimeType);
    return { url: blob.url, pathname: blob.pathname, mimeType, size: input.length };
  }

  if (options.heroCover) {
    const optimized = await optimizeHeroCover(input);
    const blob = await uploadBuffer(optimized, `${folder}/${timestamp}-${baseName}-hero.webp`, "image/webp");
    return {
      url: blob.url,
      pathname: blob.pathname,
      mimeType: "image/webp",
      size: optimized.length,
    };
  }

  if (options.contentImage) {
    const optimized = await optimizeContentImage(input);
    const blob = await uploadBuffer(optimized, `${folder}/${timestamp}-${baseName}-full.webp`, "image/webp");
    return {
      url: blob.url,
      pathname: blob.pathname,
      mimeType: "image/webp",
      size: optimized.length,
    };
  }

  const responsiveUrls: Record<string, string> = {};
  let mainUrl = "";
  let mainPathname = "";
  let mainSize = 0;

  for (const width of RESPONSIVE_WIDTHS) {
    const optimized = await optimizeImage(input, width);
    const blob = await uploadBuffer(
      optimized,
      `${folder}/${timestamp}-${baseName}-w${width}.webp`,
      "image/webp"
    );
    responsiveUrls[String(width)] = blob.url;
    if (width === 1920 || !mainUrl) {
      mainUrl = blob.url;
      mainPathname = blob.pathname;
      mainSize = optimized.length;
    }
  }

  return {
    url: mainUrl,
    pathname: mainPathname,
    mimeType: "image/webp",
    size: mainSize,
    responsiveUrls,
  };
}

export async function storeUploadedFile(
  file: File,
  folder: string,
  options?: BlobUploadOptions
): Promise<string> {
  const stored = await storeFileDetailed(file, folder, options);
  return stored.url;
}

export async function storeMultipleFiles(
  files: File[],
  folder: string
): Promise<StoredFile[]> {
  const results: StoredFile[] = [];
  for (const file of files) {
    if (file.size > 0) {
      results.push(await storeFileDetailed(file, folder));
    }
  }
  return results;
}
