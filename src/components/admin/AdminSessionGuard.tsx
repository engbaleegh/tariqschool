"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { ADMIN_IDLE_SECONDS } from "@/lib/admin-session";

type AdminSessionGuardProps = {
  locale: string;
};

/**
 * Signs out when the admin tab is idle for ADMIN_IDLE_SECONDS,
 * or when the user returns after being away that long.
 */
export default function AdminSessionGuard({ locale }: AdminSessionGuardProps) {
  const lastActivityRef = useRef(Date.now());
  const idleMs = ADMIN_IDLE_SECONDS * 1000;

  useEffect(() => {
    const touch = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, touch, { passive: true }));

    const interval = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current >= idleMs) {
        void signOut({ callbackUrl: `/${locale}/auth/signin?reason=session-expired` });
      }
    }, 30_000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        if (Date.now() - lastActivityRef.current >= idleMs) {
          void signOut({ callbackUrl: `/${locale}/auth/signin?reason=session-expired` });
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      events.forEach((event) => window.removeEventListener(event, touch));
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [locale, idleMs]);

  return null;
}
