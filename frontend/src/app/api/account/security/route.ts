import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export type LoginEntry = {
  ip: string;
  userAgent: string;
  timestamp: string; // ISO string
};

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;
  if (!token) return null;
  const decoded = verifyAuthToken(token);
  if (!decoded || typeof decoded === "string" || !decoded.sub || !ObjectId.isValid(decoded.sub)) {
    return null;
  }
  return decoded.sub;
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-security-get:${clientIp}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = await getMongoDb();
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { twoFactorEnabled: 1, loginHistory: 1 } },
  );

  return NextResponse.json({
    twoFactorEnabled: user?.twoFactorEnabled ?? false,
    loginHistory: (user?.loginHistory ?? []).slice(-15).reverse() as LoginEntry[],
  });
}

export async function PATCH(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-security-patch:${clientIp}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { twoFactorEnabled?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.twoFactorEnabled !== "boolean") {
    return NextResponse.json({ error: "twoFactorEnabled must be a boolean" }, { status: 400 });
  }

  const db = await getMongoDb();
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { twoFactorEnabled: body.twoFactorEnabled } });

  return NextResponse.json({ ok: true });
}
