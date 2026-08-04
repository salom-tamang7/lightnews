import { jwtVerify } from "jose";

// Lightweight verifier usable inside middleware (edge runtime).
// Does not import next/headers or server-only so it stays edge-safe.
export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as unknown as {
      userId: number;
      email: string;
      role: "admin" | "editor";
      name: string;
    };
  } catch {
    return null;
  }
}
