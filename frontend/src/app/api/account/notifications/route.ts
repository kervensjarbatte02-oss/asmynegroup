import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export type NotificationSettings = {
  // Email
  emailNewFollower: boolean;
  emailMessages: boolean;
  emailTips: boolean;
  emailWeeklyDigest: boolean;
  // In-app / Push
  pushNewFollower: boolean;
  pushMessages: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushTags: boolean;
  pushMentions: boolean;
  pushTips: boolean;
  pushViewMilestones: boolean;
};

const DEFAULTS: NotificationSettings = {
  emailNewFollower: true,
  emailMessages: true,
  emailTips: true,
  emailWeeklyDigest: true,
  pushNewFollower: true,
  pushMessages: true,
  pushLikes: true,
  pushComments: true,
  pushTags: true,
  pushMentions: true,
  pushTips: true,
  pushViewMilestones: true,
};

const ALLOWED_KEYS = Object.keys(DEFAULTS) as Array<keyof NotificationSettings>;

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
  const rate = checkRateLimit(`account-notif-get:${clientIp}`, 60, 60_000);
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
    .findOne({ _id: new ObjectId(userId) }, { projection: { notificationSettings: 1 } });

  const settings: NotificationSettings = { ...DEFAULTS, ...(user?.notificationSettings ?? {}) };
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-notif-patch:${clientIp}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Partial<NotificationSettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const key of ALLOWED_KEYS) {
    if (body[key] !== undefined) {
      if (typeof body[key] !== "boolean") {
        return NextResponse.json({ error: `Invalid value for ${key}` }, { status: 400 });
      }
      update[`notificationSettings.${key}`] = body[key];
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const db = await getMongoDb();
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: update });

  return NextResponse.json({ ok: true });
}
