"use server";

import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

const categorySchema = z.object({
  nameEn: z.string().min(2),
  nameNp: z.string().min(2),
  order: z.coerce.number().int().default(0),
});

export type CategoryFormState = { error?: string; success?: boolean };

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireSession();

  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input." };
  const data = parsed.data;

  const slug = slugify(data.nameEn, { lower: true, strict: true });
  const existing = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug))
    .limit(1);
  if (existing[0]) return { error: "A category with this name already exists." };

  await db.insert(schema.categories).values({ ...data, slug });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: number) {
  await requireSession();
  await db.delete(schema.categories).where(eq(schema.categories.id, id));
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
