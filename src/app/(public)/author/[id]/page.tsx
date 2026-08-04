import { notFound } from "next/navigation";
import { getUserById } from "@/lib/queries/users";
import { getArticlesByAuthor } from "@/lib/queries/articles";
import { getLocale } from "@/lib/i18n/locale";
import { ArticleCard } from "@/components/ArticleCard";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await getUserById(Number(id));
  if (!author) notFound();

  const [articles, locale] = await Promise.all([
    getArticlesByAuthor(author.id),
    getLocale(),
  ]);

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-hairline">
        <p className="font-label text-xs tracking-widest uppercase text-gold mb-1">
          {locale === "np" ? "लेखक" : "Author"}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl">{author.name}</h1>
        <p className="text-ink-faint text-sm mt-2 font-label">
          {articles.length} {locale === "np" ? "समाचारहरू" : "articles"}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} locale={locale} />
        ))}
      </div>
    </div>
  );
}
