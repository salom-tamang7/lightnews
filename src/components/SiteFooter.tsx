import Link from "next/link";
import { getAllCategories } from "@/lib/queries/categories";
import { getLocale, t } from "@/lib/i18n/locale";
import { FlameMark } from "./FlameMark";

export async function SiteFooter() {
  const [categories, locale] = await Promise.all([getAllCategories(), getLocale()]);
  const dict = t(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FlameMark className="w-5 h-5" />
            <span className="font-display text-lg">
              Light<span className="text-gold">News</span>
            </span>
          </div>
          <p className="text-sm text-ink-muted font-body max-w-xs">{dict.footerTagline}</p>
        </div>

        <div>
          <h3 className="font-label text-xs tracking-widest text-ink-faint uppercase mb-3">
            {dict.footerCategories}
          </h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="text-ink-muted hover:text-gold">
                  {locale === "np" ? c.nameNp : c.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-label text-xs tracking-widest text-ink-faint uppercase mb-3">
            {dict.footerAbout}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/admin/login" className="text-ink-muted hover:text-gold">
                {dict.admin}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-faint font-label">
          © {year} Light News
        </div>
      </div>
    </footer>
  );
}
