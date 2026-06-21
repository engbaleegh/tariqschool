"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n.config";
import { InputTypes } from "@/constants/enums";
import { getTranslations } from "@/constants/public-content";

type ContactFormProps = {
  locale: Locale;
};

export function ContactForm({ locale }: ContactFormProps) {
  const t = getTranslations(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, subject: subject || undefined, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? (locale === "ar" ? "فشل إرسال الرسالة" : "Failed to send message"));
        return;
      }
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setError(locale === "ar" ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-school space-y-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-school-slate-700">
            {t.name}
          </label>
          <input
            id="name"
            type={InputTypes.TEXT}
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-school"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-school-slate-700">
            {t.email}
          </label>
          <input
            id="email"
            type={InputTypes.EMAIL}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-school"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-school-slate-700">
            {locale === "ar" ? "الهاتف" : "Phone"}
          </label>
          <input
            id="phone"
            type={InputTypes.TEL}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-school"
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1 block text-sm font-medium text-school-slate-700">
            {locale === "ar" ? "الموضوع" : "Subject"}
          </label>
          <input
            id="subject"
            type={InputTypes.TEXT}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-school"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-school-slate-700">
          {t.message}
        </label>
        <textarea
          id="message"
          required
          minLength={10}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-school resize-y"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-school-emerald-700">
          {locale === "ar" ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent successfully!"}
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (locale === "ar" ? "جاري الإرسال..." : "Sending...") : t.sendMessage}
      </button>
    </form>
  );
}
