import { getAllCategories } from "@/lib/queries/categories";
import { createArticle } from "@/lib/actions/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NewArticlePage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">New article</h1>
      <ArticleForm categories={categories} action={createArticle} submitLabel="Create article" />
    </div>
  );
}
