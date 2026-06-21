import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const PDF_TYPE = "application/pdf";

export function detectResultFileType(mimeType: string): "PDF" | "IMAGE" {
  return mimeType === PDF_TYPE ? "PDF" : "IMAGE";
}

export function isAllowedImage(mimeType: string) {
  return IMAGE_TYPES.has(mimeType);
}

export function isAllowedResultFile(mimeType: string) {
  return mimeType === PDF_TYPE || IMAGE_TYPES.has(mimeType);
}

export async function storeUploadedFile(file: File, folder: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return blob.url;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, safeName), bytes);
  return `/uploads/${folder}/${safeName}`;
}
