"use client";

import { useState } from "react";
import { formCardClass, inputClass, labelClass } from "@/components/admin/form-classes";
import { InputTypes } from "@/constants/enums";

type MediaUploadPanelProps = {
  locale: string;
};

export function MediaUploadPanel({ locale }: MediaUploadPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const isAr = locale === "ar";

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setMessage("");
    setError("");
    setUploadedUrl("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File;
    if (!file?.size) {
      setError(isAr ? "اختر ملفاً أولاً" : "Select a file first");
      setUploading(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.set("file", file);
    uploadData.set("folder", String(formData.get("folder") ?? "media"));

    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? (isAr ? "فشل الرفع" : "Upload failed"));
        return;
      }
      setUploadedUrl(data.url);
      setMessage(isAr ? "تم رفع الملف إلى Vercel Blob بنجاح" : "File uploaded to Vercel Blob successfully");
      form.reset();
    } catch {
      setError(isAr ? "حدث خطأ أثناء الرفع" : "Upload error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className={formCardClass}>
      <p className="text-sm text-slate-600">
        {isAr
          ? "ارفع صوراً أو ملفات PDF — تُحفظ في Vercel Blob"
          : "Upload images or PDF files — stored in Vercel Blob"}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{isAr ? "المجلد" : "Folder"}</label>
          <select name="folder" className={inputClass} defaultValue="media">
            <option value="media">{isAr ? "وسائط عامة" : "General media"}</option>
            <option value="gallery">{isAr ? "معرض الصور" : "Gallery"}</option>
            <option value="articles">{isAr ? "مقالات" : "Articles"}</option>
            <option value="teachers">{isAr ? "معلمون" : "Teachers"}</option>
            <option value="covers">{isAr ? "أغلفة" : "Covers"}</option>
            <option value="results">{isAr ? "نتائج" : "Results"}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{isAr ? "الملف" : "File"}</label>
          <input
            name="file"
            type={InputTypes.FILE}
            required
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            className={inputClass}
          />
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
      {uploadedUrl && (
        <p className="mt-2 break-all text-xs text-slate-500">
          URL: <a href={uploadedUrl} className="text-indigo-600 hover:underline" target="_blank" rel="noreferrer">{uploadedUrl}</a>
        </p>
      )}
      <button
        type="submit"
        disabled={uploading}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {uploading ? (isAr ? "جاري الرفع..." : "Uploading...") : isAr ? "رفع الملف" : "Upload file"}
      </button>
    </form>
  );
}
