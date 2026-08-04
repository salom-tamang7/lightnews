"use client";

import { useActionState } from "react";
import type { ArticleFormState } from "@/lib/actions/articles";
import { ImageUploadField } from "./ImageUploadField";

type Category = { id: number; nameEn: string; nameNp: string };

type ArticleDefaults = {
  titleEn: string;
  titleNp: string;
  excerptEn: string | null;
  excerptNp: string | null;
  contentEn: string;
  contentNp: string;
  categoryId: number;
  status: "draft" | "published";
  coverImage: string | null;
};

export function ArticleForm({
  categories,
  defaults,
  action,
  submitLabel,
}: {
  categories: Category[];
  defaults?: ArticleDefaults;
  action: (prev: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      <ImageUploadField defaultValue={defaults?.coverImage} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            Title (English)
          </label>
          <input
            name="titleEn"
            required
            defaultValue={defaults?.titleEn}
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            शीर्षक (नेपाली)
          </label>
          <input
            name="titleNp"
            required
            defaultValue={defaults?.titleNp}
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            Excerpt (English, optional)
          </label>
          <textarea
            name="excerptEn"
            rows={2}
            defaultValue={defaults?.excerptEn || ""}
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            संक्षेप (नेपाली, वैकल्पिक)
          </label>
          <textarea
            name="excerptNp"
            rows={2}
            defaultValue={defaults?.excerptNp || ""}
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            Content (English)
          </label>
          <textarea
            name="contentEn"
            required
            rows={12}
            defaultValue={defaults?.contentEn}
            placeholder="Separate paragraphs with a blank line."
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm font-body"
          />
        </div>
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            सामग्री (नेपाली)
          </label>
          <textarea
            name="contentNp"
            required
            rows={12}
            defaultValue={defaults?.contentNp}
            placeholder="अनुच्छेदहरू बीच खाली लाइन छोड्नुहोस्।"
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm font-body"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            Category
          </label>
          <select
            name="categoryId"
            required
            defaultValue={defaults?.categoryId}
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn} / {c.nameNp}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-label uppercase tracking-wide text-ink-muted mb-1.5">
            Status
          </label>
          <select
            name="status"
            defaultValue={defaults?.status || "draft"}
            className="w-full bg-surface border border-hairline rounded px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {state.error && <p className="text-crimson text-sm">{state.error}</p>}
      {state.success && <p className="text-gold text-sm">Saved.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-gold text-bg font-medium rounded px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
