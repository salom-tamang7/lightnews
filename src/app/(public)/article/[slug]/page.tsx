import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, incrementViews, getArticlesByCategory } from "@/lib/queries/articles";
import { getLocale, t } from "@/lib/i18n/locale";
import { formatDate, readingTime } from "@/lib/format";
import { FlameMark } from "@/components/FlameMark";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const locale = await getLocale();
  return {
    title: `${locale === "np" ? article.titleNp : article.titleEn} — Light News`,
    description: (locale === "np" ? article.excerptNp : article.excerptEn) || undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const locale = await getLocale();
  const dict = t(locale);

  incrementViews(article.id).catch(() => {});

  const related = (await getArticlesByCategory(article.categoryId, 4)).filter(
    (a) => a.id !== article.id
  );

  const content = locale === "np" ? article.contentNp : article.contentEn;
  const title = locale === "np" ? article.titleNp : article.titleEn;
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link
          href={`/category/${article.category.slug}`}
          className="font-label text-[11px] tracking-widest uppercase text-gold"
        >
          {locale === "np" ? article.category.nameNp : article.category.nameEn}
        </Link>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted font-label mb-8 pb-6 border-b border-hairline">
        <Link href={`/author/${article.authorId}`} className="hover:text-gold">
          {dict.by} {article.author.name}
        </Link>
        <span>·</span>
        <span>{formatDate(article.publishedAt, locale)}</span>
        <span>·</span>
        <span>
          {readingTime(content)} {dict.minRead}
        </span>
        <span>·</span>
        <span>
          {article.views} {dict.views}
        </span>
      </div>

      {article.coverImage && (
        <div className="relative aspect-[16/9] mb-8 overflow-hidden bg-surface">
          <Image src={article.coverImage} alt={title} fill className="object-cover" priority />
        </div>
      )}

      <div className="font-body text-lg leading-relaxed text-ink space-y-5">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-hairline">
          <h2 className="font-label text-xs tracking-widest uppercase text-gold mb-6 flex items-center gap-2">
            <FlameMark className="w-4 h-4" />
            {locale === "np" ? "सम्बन्धित समाचार" : "Related stories"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} locale={locale} size="sm" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
