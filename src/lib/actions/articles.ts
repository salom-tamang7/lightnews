"use server";

import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { z } from "zod";

const articleSchema = z.object({
  titleEn: z.string().min(3, "English title is required"),
  titleNp: z.string().min(3, "Nepali title is required"),
  excerptEn: z.string().optional(),
  excerptNp: z.string().optional(),
  contentEn: z.string().min(10, "English content is required"),
  contentNp: z.string().min(10, "Nepali content is required"),
  categoryId: z.coerce.number().int().positive(),
  status: z.enum(["draft", "published"]),
  coverImage: z.string().optional(),
});

export type ArticleFormState = { error?: string; success?: boolean };

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

async function uniqueSlug(base: string, excludeId?: number) {
  const baseSlug = slugify(base, { lower: true, strict: true }).slice(0, 80) || "article";
  let candidate = baseSlug;
  let n = 1;

  // Loop until we find a slug not used by another article
  while (true) {
    const existing = await db
      .select({ id: schema.articles.id })
      .from(schema.articles)
      .where(eq(schema.articles.slug, candidate))
      .limit(1);

    if (!existing[0] || existing[0].id === excludeId) return candidate;
    n += 1;
    candidate = `${baseSlug}-${n}`;
  }
}

export async function createArticle(
  _prev: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const session = await requireSession();

  const parsed = articleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }
  const data = parsed.data;

  const slug = await uniqueSlug(data.titleEn);

  const [inserted] = await db
    .insert(schema.articles)
    .values({
      slug,
      titleEn: data.titleEn,
      titleNp: data.titleNp,
      excerptEn: data.excerptEn || data.contentEn.slice(0, 160),
      excerptNp: data.excerptNp || data.contentNp.slice(0, 160),
      contentEn: data.contentEn,
      contentNp: data.contentNp,
      coverImage: data.coverImage || null,
      categoryId: data.categoryId,
      authorId: session.userId,
      status: data.status,
      publishedAt: data.status === "published" ? new Date() : null,
    })
    .returning({ id: schema.articles.id });

  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${inserted.id}/edit?created=1`);
}

export async function updateArticle(
  id: number,
  _prev: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireSession();

  const parsed = articleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }
  const data = parsed.data;

  const current = await db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.id, id))
    .limit(1);
  if (!current[0]) return { error: "Article not found." };

  const slug =
    data.titleEn === current[0].titleEn ? current[0].slug : await uniqueSlug(data.titleEn, id);

  const becomingPublished = data.status === "published" && current[0].status !== "published";

  await db
    .update(schema.articles)
    .set({
      slug,
      titleEn: data.titleEn,
      titleNp: data.titleNp,
      excerptEn: data.excerptEn || data.contentEn.slice(0, 160),
      excerptNp: data.excerptNp || data.contentNp.slice(0, 160),
      contentEn: data.contentEn,
      contentNp: data.contentNp,
      coverImage: data.coverImage || null,
      categoryId: data.categoryId,
      status: data.status,
      publishedAt: becomingPublished ? new Date() : current[0].publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(schema.articles.id, id));

  revalidatePath("/");
  revalidatePath("/admin/articles");
  revalidatePath(`/article/${slug}`);
  return { success: true };
}

export async function deleteArticle(id: number) {
  await requireSession();
  await db.delete(schema.articles).where(eq(schema.articles.id, id));
  revalidatePath("/admin/articles");
  revalidatePath("/");
}
