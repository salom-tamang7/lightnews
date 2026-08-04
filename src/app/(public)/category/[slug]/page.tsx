import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { getArticlesByCategory } from "@/lib/queries/articles";
import { getLocale } from "@/lib/i18n/locale";
import { ArticleCard } from "@/components/ArticleCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [articles, locale] = await Promise.all([
    getArticlesByCategory(category.id, 30),
    getLocale(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl mb-8 pb-4 border-b border-hairline">
        {locale === "np" ? category.nameNp : category.nameEn}
      </h1>
      {articles.length === 0 ? (
        <p className="text-ink-muted font-body">
          {locale === "np" ? "यस श्रेणीमा हाल कुनै समाचार छैन।" : "No articles in this category yet."}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
