import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getUserById(id: number) {
  const rows = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
  return rows[0] ?? null;
}
