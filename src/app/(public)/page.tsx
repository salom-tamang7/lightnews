import Link from "next/link";
import Image from "next/image";
import { getFeaturedArticle, getLatestArticles, getArticlesByCategory } from "@/lib/queries/articles";
import { getAllCategories } from "@/lib/queries/categories";
import { getLocale, t } from "@/lib/i18n/locale";
import { ArticleCard } from "@/components/ArticleCard";
import { FlameMark } from "@/components/FlameMark";
import { formatDate } from "@/lib/format";

export const revalidate = 30;

export default async function HomePage() {
  const [featured, latest, categories, locale] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(6),
    getAllCategories(),
    getLocale(),
  ]);
  const dict = t(locale);

  const restLatest = latest.filter((a) => a.id !== featured?.id).slice(0, 5);

  const categoryStrips = await Promise.all(
    categories.slice(0, 4).map(async (c) => ({
      category: c,
      articles: await getArticlesByCategory(c.id, 4),
    }))
  );

  return (
    <div className="space-y-14">
      {/* Hero */}
      {featured && (
        <section className="grid lg:grid-cols-3 gap-8">
          <Link href={`/article/${featured.slug}`} className="lg:col-span-2 group block">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface">
              {featured.coverImage && (
                <Image
                  src={featured.coverImage}
                  alt={locale === "np" ? featured.titleNp : featured.titleEn}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="70vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
              <div className="absolute left-0 bottom-0 p-6">
                <div className="flex items-center gap-1.5 mb-3 bg-bg/70 backdrop-blur px-2.5 py-1 rounded-full w-fit">
                  <FlameMark className="w-3.5 h-3.5" live />
                  <span className="font-label text-[10px] tracking-widest uppercase text-gold">
                    {dict.live}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight text-ink max-w-2xl">
                  {locale === "np" ? featured.titleNp : featured.titleEn}
                </h1>
                <p className="text-ink-muted mt-3 max-w-xl hidden sm:block font-body">
                  {locale === "np" ? featured.excerptNp : featured.excerptEn}
                </p>
                <div className="mt-4 text-xs text-ink-faint font-label">
                  {dict.by} {featured.author.name} · {formatDate(featured.publishedAt, locale)}
                </div>
              </div>
            </div>
          </Link>

          <div>
            <h2 className="font-label text-xs tracking-widest uppercase text-gold mb-4 pb-3 border-b border-hairline">
              {dict.latest}
            </h2>
            <ul className="divide-y divide-hairline">
              {restLatest.map((a) => (
                <li key={a.id} className="py-3.5 first:pt-0">
                  <ArticleCard article={a} locale={locale} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {!featured && (
        <div className="text-center py-24 text-ink-muted font-body">
          No published articles yet.{" "}
          <Link href="/admin/login" className="text-gold underline">
            Go to admin
          </Link>{" "}
          to publish your first story.
        </div>
      )}

      {/* Category strips */}
      {categoryStrips.map(
        ({ category, articles }) =>
          articles.length > 0 && (
            <section key={category.id}>
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-hairline">
                <h2 className="font-display text-xl text-ink">
                  {locale === "np" ? category.nameNp : category.nameEn}
                </h2>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-xs font-label uppercase tracking-wide text-ink-muted hover:text-gold"
                >
                  {dict.readMore} →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} locale={locale} />
                ))}
              </div>
            </section>
          )
      )}
    </div>
  );
}
