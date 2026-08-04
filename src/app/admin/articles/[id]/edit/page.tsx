import { notFound } from "next/navigation";
import { getAllCategories } from "@/lib/queries/categories";
import { getArticleByIdForAdmin } from "@/lib/queries/articles";
import { updateArticle } from "@/lib/actions/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const articleId = Number(id);

  const [categories, article] = await Promise.all([
    getAllCategories(),
    getArticleByIdForAdmin(articleId),
  ]);

  if (!article) notFound();

  const boundUpdate = updateArticle.bind(null, articleId);

  return (
    <div>
      <h1 className="font-display text-2xl mb-2">Edit article</h1>
      {created && <p className="text-gold text-sm mb-4">Article created — you can keep editing below.</p>}
      <p className="text-ink-faint text-xs font-label mb-6">/article/{article.slug}</p>
      <ArticleForm
        categories={categories}
        defaults={article}
        action={boundUpdate}
        submitLabel="Save changes"
      />
    </div>
  );
}
