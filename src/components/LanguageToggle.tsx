"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageToggle({ locale }: { locale: "np" | "en" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(next: "np" | "en") {
    document.cookie = `ln_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="flex items-center rounded-full border border-hairline text-[11px] font-label tracking-wide overflow-hidden"
      aria-label="Language"
    >
      <button
        onClick={() => setLocale("np")}
        disabled={isPending}
        aria-pressed={locale === "np"}
        className={`px-2.5 py-1 transition-colors ${
          locale === "np" ? "bg-gold text-bg" : "text-ink-muted hover:text-ink"
        }`}
      >
        नेपाली
      </button>
      <button
        onClick={() => setLocale("en")}
        disabled={isPending}
        aria-pressed={locale === "en"}
        className={`px-2.5 py-1 transition-colors ${
          locale === "en" ? "bg-gold text-bg" : "text-ink-muted hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}
