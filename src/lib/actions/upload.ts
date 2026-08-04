"use server";

import { getSession } from "@/lib/auth/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided." };

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return { error: "Only JPEG, PNG, or WEBP images are allowed." };
  if (file.size > MAX_SIZE_BYTES) return { error: "Image must be under 5MB." };

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return { url: `/uploads/${filename}` };
}
