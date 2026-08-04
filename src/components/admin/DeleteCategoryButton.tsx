"use client";

import { useTransition } from "react";
import { deleteCategory } from "@/lib/actions/categories";

export function DeleteCategoryButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete category "${name}"? Articles in it must be reassigned first.`)) return;
    startTransition(() => deleteCategory(id));
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
