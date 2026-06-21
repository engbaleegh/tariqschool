"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n.config";
import { InputTypes } from "@/constants/enums";

import { BOOTSTRAP_ADMIN } from "@/constants/site";

type SignInFormProps = {
  locale: Locale;
};

export function SignInForm({ locale }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}/admin`;
  const isAr = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(isAr ? "بيانات الدخول غير صحيحة" : "Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-md space-y-4 p-8">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          {isAr ? "البريد الإلكتروني" : "Email"}
        </label>
        <input
          id="email"
          type={InputTypes.EMAIL}
          required
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
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
