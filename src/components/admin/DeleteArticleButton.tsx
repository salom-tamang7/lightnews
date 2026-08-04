"use client";

import { useTransition } from "react";
import { deleteArticle } from "@/lib/actions/articles";

export function DeleteArticleButton({ id, title }: { id: number; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(() => deleteArticle(id));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-crimson hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
