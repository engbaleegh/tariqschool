import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import sharp from "sharp";

const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const PDF_TYPE = "application/pdf";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export type StoredFile = {
  url: string;
  mimeType: string;
  size: number;
  responsiveUrls?: Record<string, string>;
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

export function responsiveSrcSet(responsiveUrls?: Record<string, string>): string | undefined {
  if (!responsiveUrls) return undefined;
  const entries = Object.entries(responsiveUrls)
    .map(([width, url]) => `${url} ${width}w`)
    .join(", ");
  return entries || undefined;
}

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  folder: string,
  contentType: string
): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${filename}`, buffer, {
      access: "public",
      contentType,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new StorageError(
      "File storage is not configured for production. Add BLOB_READ_WRITE_TOKEN in Vercel environment variables."
    );
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
}

async function optimizeImage(buffer: Buffer, width: number): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}

export async function storeFileDetailed(file: File, folder: string): Promise<StoredFile> {
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
    const filename = `${timestamp}-${safeFilename(file.name)}`;
    const url = await uploadBuffer(bytes, filename, folder, mimeType);
    return { url, mimeType, size: bytes.length };
  }

  const input = Buffer.from(await file.arrayBuffer());
  const responsiveUrls: Record<string, string> = {};
  let mainUrl = "";
  let mainSize = 0;

  for (const width of RESPONSIVE_WIDTHS) {
    const optimized = await optimizeImage(input, width);
    const filename = `${timestamp}-${baseName}-w${width}.webp`;
    const url = await uploadBuffer(optimized, filename, folder, "image/webp");
    responsiveUrls[String(width)] = url;
    if (width === 1920 || !mainUrl) {
      mainUrl = url;
      mainSize = optimized.length;
    }
  }

  return {
    url: mainUrl,
    mimeType: "image/webp",
    size: mainSize,
    responsiveUrls,
  };
}

export async function storeUploadedFile(file: File, folder: string): Promise<string> {
  const stored = await storeFileDetailed(file, folder);
  return stored.url;
}
