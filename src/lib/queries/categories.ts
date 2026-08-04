import { db, schema } from "@/lib/db";
import { asc, eq } from "drizzle-orm";

export async function getAllCategories() {
  return db.select().from(schema.categories).orderBy(asc(schema.categories.order));
}

export async function getCategoryBySlug(slug: string) {
  const rows = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}
