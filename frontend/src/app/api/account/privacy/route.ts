import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export type PrivacySettings = {
  isPrivateAccount: boolean;
  whoCanMessage: "everyone" | "followers" | "nobody";
  whoCanSeeReels: "everyone" | "followers";
  whoCanTagMe: "everyone" | "followers" | "nobody";
  whoCanMentionMe: "everyone" | "followers" | "nobody";
  showActivityStatus: boolean;
  allowDataSharing: boolean;
};

const DEFAULTS: PrivacySettings = {
  isPrivateAccount: false,
  whoCanMessage: "everyone",
  whoCanSeeReels: "everyone",
  whoCanTagMe: "everyone",
  whoCanMentionMe: "everyone",
  showActivityStatus: true,
  allowDataSharing: true,
};

const WHO_VALUES = ["everyone", "followers", "nobody"] as const;
const WHO_REELS_VALUES = ["everyone", "followers"] as const;

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
  const rate = checkRateLimit(`account-privacy-get:${clientIp}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = await getMongoDb();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { privacySettings: 1 } });

  const settings: PrivacySettings = { ...DEFAULTS, ...(user?.privacySettings ?? {}) };

  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-privacy-patch:${clientIp}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Partial<PrivacySettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate enum fields
  if (body.whoCanMessage !== undefined && !WHO_VALUES.includes(body.whoCanMessage)) {
    return NextResponse.json({ error: "Invalid value for whoCanMessage" }, { status: 400 });
  }
  if (body.whoCanSeeReels !== undefined && !WHO_REELS_VALUES.includes(body.whoCanSeeReels)) {
    return NextResponse.json({ error: "Invalid value for whoCanSeeReels" }, { status: 400 });
  }
  if (body.whoCanTagMe !== undefined && !WHO_VALUES.includes(body.whoCanTagMe)) {
    return NextResponse.json({ error: "Invalid value for whoCanTagMe" }, { status: 400 });
  }
  if (body.whoCanMentionMe !== undefined && !WHO_VALUES.includes(body.whoCanMentionMe)) {
    return NextResponse.json({ error: "Invalid value for whoCanMentionMe" }, { status: 400 });
  }

  // Only allow known boolean fields
  const booleanFields = ["isPrivateAccount", "showActivityStatus", "allowDataSharing"] as const;
  for (const field of booleanFields) {
    if (body[field] !== undefined && typeof body[field] !== "boolean") {
      return NextResponse.json({ error: `Invalid value for ${field}` }, { status: 400 });
    }
  }

  const update: Record<string, unknown> = {};
  const allowed: Array<keyof PrivacySettings> = [
    "isPrivateAccount",
    "whoCanMessage",
    "whoCanSeeReels",
    "whoCanTagMe",
    "whoCanMentionMe",
    "showActivityStatus",
    "allowDataSharing",
  ];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      update[`privacySettings.${key}`] = body[key];
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const db = await getMongoDb();
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: update });

  return NextResponse.json({ ok: true });
}
