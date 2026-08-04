import { searchArticles } from "@/lib/queries/articles";
import { getLocale, t } from "@/lib/i18n/locale";
import { ArticleCard } from "@/components/ArticleCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const locale = await getLocale();
  const dict = t(locale);

  const results = query ? await searchArticles(query) : [];

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl mb-8 pb-4 border-b border-hairline">
        {dict.searchResultsFor} <span className="text-gold">&ldquo;{query}&rdquo;</span>
      </h1>
      {results.length === 0 ? (
        <p className="text-ink-muted font-body">{dict.noResults}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
