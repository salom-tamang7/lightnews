"use server";

import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { isLoginLocked, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = { error?: string };

async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const ip = await getClientIp();

  if (await isLoginLocked(email, ip)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const rows = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  const user = rows[0];

  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  await recordLoginAttempt(email, ip, valid);

  if (!user || !valid) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
