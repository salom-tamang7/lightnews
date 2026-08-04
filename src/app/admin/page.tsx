import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/queries/articles";

export default async function AdminDashboard() {
  const articles = await getAllArticlesForAdmin();
  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-surface border border-hairline rounded-lg p-4">
          <p className="text-xs font-label uppercase text-ink-muted">Published</p>
          <p className="font-display text-3xl text-gold mt-1">{published}</p>
        </div>
        <div className="bg-surface border border-hairline rounded-lg p-4">
          <p className="text-xs font-label uppercase text-ink-muted">Drafts</p>
          <p className="font-display text-3xl mt-1">{drafts}</p>
        </div>
        <div className="bg-surface border border-hairline rounded-lg p-4">
          <p className="text-xs font-label uppercase text-ink-muted">Total views</p>
          <p className="font-display text-3xl mt-1">{totalViews}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-label text-xs uppercase tracking-wide text-ink-muted">
          Recent articles
        </h2>
        <Link href="/admin/articles" className="text-xs text-gold">
          View all →
        </Link>
      </div>
      <ul className="divide-y divide-hairline border-t border-hairline">
        {articles.slice(0, 8).map((a) => (
          <li key={a.id} className="py-3 flex items-center justify-between">
            <Link href={`/admin/articles/${a.id}/edit`} className="text-sm hover:text-gold truncate">
              {a.titleEn}
            </Link>
            <span
              className={`text-[10px] font-label uppercase px-2 py-0.5 rounded-full ${
                a.status === "published" ? "bg-gold/20 text-gold" : "bg-hairline text-ink-muted"
              }`}
            >
              {a.status}
            </span>
          </li>
        ))}
        {articles.length === 0 && (
          <li className="py-6 text-ink-muted text-sm">
            No articles yet.{" "}
            <Link href="/admin/articles/new" className="text-gold">
              Create your first one
            </Link>
            .
          </li>
        )}
      </ul>
    </div>
  );
}
