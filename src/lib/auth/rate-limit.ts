import { db, schema } from "@/lib/db";
import { and, eq, gt, sql } from "drizzle-orm";

const WINDOW_SECONDS = 15 * 60; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function isLoginLocked(email: string, ip: string) {
  const since = Math.floor(Date.now() / 1000) - WINDOW_SECONDS;

  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.loginAttempts)
    .where(
      and(
        eq(schema.loginAttempts.email, email),
        eq(schema.loginAttempts.ip, ip),
        eq(schema.loginAttempts.success, false),
        gt(schema.loginAttempts.createdAt, new Date(since * 1000))
      )
    );

  return (rows[0]?.count ?? 0) >= MAX_ATTEMPTS;
}

export async function recordLoginAttempt(email: string, ip: string, success: boolean) {
  await db.insert(schema.loginAttempts).values({ email, ip, success });
}
