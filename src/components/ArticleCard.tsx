import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/locale";
import { formatDate } from "@/lib/format";

type CardArticle = {
  slug: string;
  titleEn: string;
  titleNp: string;
  excerptEn: string | null;
  excerptNp: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  category: { nameEn: string; nameNp: string; slug: string } | null;
};

export function ArticleCard({
  article,
  locale,
  size = "md",
}: {
  article: CardArticle;
  locale: Locale;
  size?: "sm" | "md" | "lg";
}) {
  const title = locale === "np" ? article.titleNp : article.titleEn;
  const excerpt = locale === "np" ? article.excerptNp : article.excerptEn;

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      {article.coverImage && (
        <div
          className={`relative overflow-hidden bg-surface mb-3 ${
            size === "lg" ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={article.coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={size === "lg" ? "60vw" : "25vw"}
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-1.5">
        {article.category && (
          <span className="font-label text-[10px] tracking-widest uppercase text-gold">
            {locale === "np" ? article.category.nameNp : article.category.nameEn}
          </span>
        )}
        <span className="text-ink-faint text-xs">
          {formatDate(article.publishedAt, locale)}
        </span>
      </div>
      <h3
        className={`font-display leading-snug text-ink group-hover:text-gold transition-colors ${
          size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-base" : "text-lg"
        }`}
      >
        {title}
      </h3>
      {excerpt && size !== "sm" && (
        <p className="text-ink-muted text-sm mt-1.5 font-body line-clamp-2">{excerpt}</p>
      )}
    </Link>
  );
}
