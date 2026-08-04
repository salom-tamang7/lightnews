import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../src/lib/db/schema";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "lightnews.db");
const sqlite = new Database(dbPath);
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@lightnews.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error(
      "Set SEED_ADMIN_PASSWORD in your .env file before seeding (this becomes your first admin login)."
    );
    process.exit(1);
  }

  const existingUser = db.select().from(schema.users).all();
  if (existingUser.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    db.insert(schema.users)
      .values({
        name: "Editor",
        email: adminEmail,
        passwordHash,
        role: "admin",
      })
      .run();
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log("Users already exist, skipping admin creation.");
  }

  const existingCategories = db.select().from(schema.categories).all();
  if (existingCategories.length === 0) {
    const categories = [
      { slug: "news", nameEn: "News", nameNp: "समाचार", order: 1 },
      { slug: "sports", nameEn: "Sports", nameNp: "खेलकुद", order: 2 },
      { slug: "tech", nameEn: "Technology", nameNp: "सुचना प्रविधि", order: 3 },
      { slug: "agriculture", nameEn: "Agriculture", nameNp: "कृषि", order: 4 },
      { slug: "opinion", nameEn: "Opinion", nameNp: "विचार", order: 5 },
      { slug: "entertainment", nameEn: "Entertainment", nameNp: "मनोरञ्जन", order: 6 },
      { slug: "editorial", nameEn: "Editorial", nameNp: "सम्पादकीय", order: 7 },
    ];
    db.insert(schema.categories).values(categories).run();
    console.log(`Created ${categories.length} categories.`);
  } else {
    console.log("Categories already exist, skipping.");
  }

  console.log("Seed complete.");
}

main();
