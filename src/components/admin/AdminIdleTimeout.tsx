"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

const IDLE_MS = 10 * 60 * 1000;
const STORAGE_KEY = "admin-last-active";
const CHECK_INTERVAL_MS = 30_000;

function throttle(fn: () => void, ms: number) {
  let last = 0;
  return () => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn();
    }
  };
}

type AdminIdleTimeoutProps = {
  locale: string;
};

export function AdminIdleTimeout({ locale }: AdminIdleTimeoutProps) {
  const { status } = useSession();
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const signInUrl = `/${locale}/auth/signin`;

    const touch = () => {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    };

    const expireSession = () => {
      localStorage.removeItem(STORAGE_KEY);
      void signOut({ callbackUrl: signInUrl });
    };

    const isUserExpired = () => {
      const last = Number(localStorage.getItem(STORAGE_KEY) || 0);
      return last > 0 && Date.now() - last > IDLE_MS;
    };

    if (isUserExpired()) {
      expireSession();
      return;
    }

    touch();

    const onVisibilityChange = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
        touch();
        return;
      }

      const hiddenAt = hiddenAtRef.current;
      if (hiddenAt && Date.now() - hiddenAt >= IDLE_MS) {
        expireSession();
        return;
      }

      if (isUserExpired()) {
        expireSession();
        return;
      }

      touch();
    };

    const throttledTouch = throttle(touch, 5000);
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"] as const;

    activityEvents.forEach((event) =>
      document.addEventListener(event, throttledTouch, { passive: true })
    );
    document.addEventListener("visibilitychange", onVisibilityChange);

    const interval = setInterval(() => {
      if (!document.hidden && isUserExpired()) {
        expireSession();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      activityEvents.forEach((event) =>
        document.removeEventListener(event, throttledTouch)
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(interval);
    };
  }, [status, locale]);

  return null;
}
