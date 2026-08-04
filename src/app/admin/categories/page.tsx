import { getAllCategories } from "@/lib/queries/categories";
import { NewCategoryForm } from "@/components/admin/NewCategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Categories</h1>
      <div className="mb-8">
        <NewCategoryForm />
      </div>
      <div className="border border-hairline rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-ink-muted text-xs font-label uppercase">
            <tr>
              <th className="text-left px-4 py-3">English</th>
              <th className="text-left px-4 py-3">Nepali</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Order</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">{c.nameEn}</td>
                <td className="px-4 py-3">{c.nameNp}</td>
                <td className="px-4 py-3 text-ink-faint font-label">{c.slug}</td>
                <td className="px-4 py-3 text-ink-muted">{c.order}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteCategoryButton id={c.id} name={c.nameEn} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
