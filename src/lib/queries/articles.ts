import { db, schema } from "@/lib/db";
import { and, desc, eq, like, or, sql } from "drizzle-orm";

const publishedFilter = eq(schema.articles.status, "published");

export async function getLatestArticles(limit = 12) {
  return db.query.articles.findMany({
    where: publishedFilter,
    orderBy: [desc(schema.articles.publishedAt)],
    limit,
    with: { category: true, author: true },
  });
}

export async function getFeaturedArticle() {
  const rows = await db.query.articles.findMany({
    where: publishedFilter,
    orderBy: [desc(schema.articles.publishedAt)],
    limit: 1,
    with: { category: true, author: true },
  });
  return rows[0] ?? null;
}

export async function getArticlesByCategory(categoryId: number, limit = 20, offset = 0) {
  return db.query.articles.findMany({
    where: and(publishedFilter, eq(schema.articles.categoryId, categoryId)),
    orderBy: [desc(schema.articles.publishedAt)],
    limit,
    offset,
    with: { category: true, author: true },
  });
}

export async function getArticleBySlug(slug: string) {
  const row = await db.query.articles.findFirst({
    where: and(eq(schema.articles.slug, slug), publishedFilter),
    with: { category: true, author: true },
  });
  return row ?? null;
}

export async function incrementViews(articleId: number) {
  await db
    .update(schema.articles)
    .set({ views: sql`${schema.articles.views} + 1` })
    .where(eq(schema.articles.id, articleId));
}

export async function searchArticles(term: string, limit = 20) {
  const pattern = `%${term}%`;
  return db.query.articles.findMany({
    where: and(
      publishedFilter,
      or(
        like(schema.articles.titleEn, pattern),
        like(schema.articles.titleNp, pattern),
        like(schema.articles.contentEn, pattern),
        like(schema.articles.contentNp, pattern)
      )
    ),
    orderBy: [desc(schema.articles.publishedAt)],
    limit,
    with: { category: true, author: true },
  });
}

export async function getArticlesByAuthor(authorId: number, limit = 30) {
  return db.query.articles.findMany({
    where: and(publishedFilter, eq(schema.articles.authorId, authorId)),
    orderBy: [desc(schema.articles.publishedAt)],
    limit,
    with: { category: true, author: true },
  });
}

// --- Admin (includes drafts) ---

export async function getAllArticlesForAdmin(limit = 100) {
  return db.query.articles.findMany({
    orderBy: [desc(schema.articles.createdAt)],
    limit,
    with: { category: true, author: true },
  });
}

export async function getArticleByIdForAdmin(id: number) {
  const row = await db.query.articles.findFirst({
    where: eq(schema.articles.id, id),
    with: { category: true, author: true },
  });
  return row ?? null;
}
