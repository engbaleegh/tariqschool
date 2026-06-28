"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n.config";
import { InputTypes } from "@/constants/enums";
import { BOOTSTRAP_ADMIN } from "@/constants/site";

type SignInFormProps = {
  locale: Locale;
};

export function SignInForm({ locale }: SignInFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}/admin`;
  const sessionExpired = searchParams.get("reason") === "session-expired";
  const isAr = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result) {
        setError(isAr ? "تعذر الاتصال بالخادم. حاول مرة أخرى." : "Could not reach the server. Please try again.");
        return;
      }

      if (result.error || !result.ok) {
        setError(
          isAr
            ? "بيانات الدخول غير صحيحة. تحقق من البريد وكلمة المرور."
            : "Invalid email or password. Please check your credentials."
        );
        return;
      }

      window.location.assign(result.url ?? callbackUrl);
    } catch {
      setError(isAr ? "حدث خطأ غير متوقع. حاول مرة أخرى." : "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-md space-y-4 p-8">
      {sessionExpired && (
        <p
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
          role="status"
        >
          {isAr
            ? "انتهت جلستك بعد 10 دقائق من عدم النشاط. يرجى تسجيل الدخول مرة أخرى."
            : "Your session expired after 10 minutes of inactivity. Please sign in again."}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {isAr ? "البريد الإلكتروني" : "Email"}
        </label>
        <input
          id="email"
          type={InputTypes.EMAIL}
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          {isAr ? "كلمة المرور" : "Password"}
        </label>
        <input
          id="password"
          type={InputTypes.PASSWORD}
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        {isAr ? "بيانات الدخول الافتراضية:" : "Default login credentials:"}
        <br />
        {BOOTSTRAP_ADMIN.email} / {BOOTSTRAP_ADMIN.password}
      </p>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
      >
        {loading ? (isAr ? "جاري الدخول..." : "Signing in...") : isAr ? "تسجيل الدخول" : "Sign in"}
      </button>
    </form>
  );
}
