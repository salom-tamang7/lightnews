import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/actions/auth";
import { FlameMark } from "@/components/FlameMark";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Login page renders its own minimal chrome
  if (!session) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-bg text-ink font-sans">
      <aside className="w-56 shrink-0 border-r border-hairline flex flex-col">
        <div className="p-5 flex items-center gap-2">
          <FlameMark className="w-5 h-5" />
          <span className="font-display text-lg">
            Light<span className="text-gold">News</span>
          </span>
        </div>
        <nav className="flex-1 px-3 space-y-1 text-sm">
          <Link href="/admin" className="block px-3 py-2 rounded hover:bg-surface text-ink-muted hover:text-ink">
            Dashboard
          </Link>
          <Link
            href="/admin/articles"
            className="block px-3 py-2 rounded hover:bg-surface text-ink-muted hover:text-ink"
          >
            Articles
          </Link>
          <Link
            href="/admin/articles/new"
            className="block px-3 py-2 rounded hover:bg-surface text-ink-muted hover:text-ink"
          >
            + New article
          </Link>
          <Link
            href="/admin/categories"
            className="block px-3 py-2 rounded hover:bg-surface text-ink-muted hover:text-ink"
          >
            Categories
          </Link>
        </nav>
        <div className="p-3 border-t border-hairline">
          <div className="px-3 py-2 text-xs text-ink-faint font-label">
            {session.name} · {session.role}
          </div>
          <form action={logoutAction}>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-surface text-ink-muted hover:text-ink text-sm">
              Log out
            </button>
          </form>
          <Link
            href="/"
            className="block px-3 py-2 rounded hover:bg-surface text-ink-muted hover:text-ink text-sm"
          >
            ← View site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 max-w-4xl">{children}</main>
    </div>
  );
}
