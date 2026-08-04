import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/queries/articles";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Articles</h1>
        <Link href="/admin/articles/new" className="bg-gold text-bg text-sm font-medium rounded px-4 py-2">
          + New article
        </Link>
      </div>

      <div className="border border-hairline rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-ink-muted text-xs font-label uppercase">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Views</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {articles.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${a.id}/edit`} className="hover:text-gold">
                    {a.titleEn}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-muted">{a.category?.nameEn}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-label uppercase px-2 py-0.5 rounded-full ${
                      a.status === "published" ? "bg-gold/20 text-gold" : "bg-hairline text-ink-muted"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-muted">{a.views}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link href={`/admin/articles/${a.id}/edit`} className="text-xs text-gold hover:underline">
                    Edit
                  </Link>
                  <DeleteArticleButton id={a.id} title={a.titleEn} />
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
