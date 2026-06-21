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
  const isAr = locale === "ar";

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setMessage("");
    setError("");

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
      setMessage(isAr ? "تم رفع الملف بنجاح" : "File uploaded successfully");
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
          ? "ارفع صوراً، فيديوهات (MP4)، مقالات PDF، أو ملفات أخرى عن المدرسة والأنشطة"
          : "Upload photos, videos (MP4), PDF articles, or other school activity files"}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>{isAr ? "نوع المحتوى" : "Content folder"}</label>
          <select name="folder" className={inputClass} defaultValue="media">
            <option value="media">{isAr ? "وسائط عامة" : "General media"}</option>
            <option value="activities">{isAr ? "أنشطة" : "Activities"}</option>
            <option value="gallery">{isAr ? "معرض الصور" : "Gallery"}</option>
            <option value="articles">{isAr ? "مقالات" : "Articles"}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{isAr ? "الملف" : "File"}</label>
          <input
            name="file"
            type={InputTypes.FILE}
            required
            accept="image/*,video/mp4,video/webm,application/pdf"
            className={inputClass}
          />
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
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
