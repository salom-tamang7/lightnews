import type { Locale } from "@/lib/i18n/locale";

export function formatDate(date: Date | null, locale: Locale) {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale === "np" ? "ne-NP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
