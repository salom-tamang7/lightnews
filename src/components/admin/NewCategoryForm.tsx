"use client";

import { useActionState } from "react";
import { createCategory, type CategoryFormState } from "@/lib/actions/categories";

const initialState: CategoryFormState = {};

export function NewCategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 bg-surface border border-hairline rounded-lg p-4">
      <div>
        <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
          Name (English)
        </label>
        <input name="nameEn" required className="bg-bg border border-hairline rounded px-3 py-2 text-sm w-40" />
      </div>
      <div>
        <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
          नाम (नेपाली)
        </label>
        <input name="nameNp" required className="bg-bg border border-hairline rounded px-3 py-2 text-sm w-40" />
      </div>
      <div>
        <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
          Order
        </label>
        <input
          name="order"
          type="number"
          defaultValue={0}
          className="bg-bg border border-hairline rounded px-3 py-2 text-sm w-20"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-gold text-bg font-medium rounded px-4 py-2 text-sm disabled:opacity-60"
      >
        {isPending ? "Adding…" : "Add category"}
      </button>
      {state.error && <p className="text-crimson text-sm w-full">{state.error}</p>}
    </form>
  );
}
