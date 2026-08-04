import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// Admin / journalist accounts
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "editor"] })
    .notNull()
    .default("editor"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Categories (bilingual labels), matches the nav: News/Sports/Tech/Agriculture/Opinion/Entertainment/Editorial
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameNp: text("name_np").notNull(),
  order: integer("order").notNull().default(0),
});

// Articles, bilingual content stored side by side
export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),

  titleEn: text("title_en").notNull(),
  titleNp: text("title_np").notNull(),

  excerptEn: text("excerpt_en"),
  excerptNp: text("excerpt_np"),

  contentEn: text("content_en").notNull(),
  contentNp: text("content_np").notNull(),

  coverImage: text("cover_image"),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),

  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),

  views: integer("views").notNull().default(0),

  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
}));

// Login attempt tracking, cheap brute-force protection
export const loginAttempts = sqliteTable("login_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  ip: text("ip").notNull(),
  success: integer("success", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
