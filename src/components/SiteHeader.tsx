import Link from "next/link";
import { getAllCategories } from "@/lib/queries/categories";
import { getLocale, t } from "@/lib/i18n/locale";
import { FlameMark } from "./FlameMark";
import { LanguageToggle } from "./LanguageToggle";

export async function SiteHeader() {
  const [categories, locale] = await Promise.all([getAllCategories(), getLocale()]);
  const dict = t(locale);

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-hairline">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <FlameMark className="w-6 h-6" />
            <span className="font-display text-xl tracking-tight text-ink">
              Light<span className="text-gold">News</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <form action="/search" className="hidden sm:block">
              <input
                type="search"
                name="q"
                placeholder={dict.searchPlaceholder}
                className="bg-surface border border-hairline rounded-full px-4 py-1.5 text-sm w-56 placeholder:text-ink-faint focus:w-72 transition-all"
              />
            </form>
            <LanguageToggle locale={locale} />
          </div>
        </div>

        <nav className="flex items-center gap-5 overflow-x-auto pb-3 -mt-1 text-sm font-sans">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap text-ink-muted hover:text-gold transition-colors border-b-2 border-transparent hover:border-gold pb-1"
            >
              {locale === "np" ? c.nameNp : c.nameEn}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
