import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export type AccessibilitySettings = {
  theme: "dark" | "light" | "system";
  reduceMotion: boolean;
  largerText: boolean;
  highContrast: boolean;
  language: "en" | "fr" | "es" | "de" | "pt";
  fontSize: "sm" | "base" | "lg" | "xl";
};

const DEFAULTS: AccessibilitySettings = {
  theme: "dark",
  reduceMotion: false,
  largerText: false,
  highContrast: false,
  language: "en",
  fontSize: "base",
};

const THEME_VALUES = ["dark", "light", "system"] as const;
const LANGUAGE_VALUES = ["en", "fr", "es", "de", "pt"] as const;
const FONTSIZE_VALUES = ["sm", "base", "lg", "xl"] as const;

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
  const rate = checkRateLimit(`account-access-get:${clientIp}`, 60, 60_000);
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
    .findOne({ _id: new ObjectId(userId) }, { projection: { accessibilitySettings: 1 } });

  const settings: AccessibilitySettings = { ...DEFAULTS, ...(user?.accessibilitySettings ?? {}) };
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-access-patch:${clientIp}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Partial<AccessibilitySettings>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate enum fields
  if (body.theme !== undefined && !THEME_VALUES.includes(body.theme)) {
    return NextResponse.json({ error: "Invalid value for theme" }, { status: 400 });
  }
  if (body.language !== undefined && !LANGUAGE_VALUES.includes(body.language)) {
    return NextResponse.json({ error: "Invalid value for language" }, { status: 400 });
  }
  if (body.fontSize !== undefined && !FONTSIZE_VALUES.includes(body.fontSize)) {
    return NextResponse.json({ error: "Invalid value for fontSize" }, { status: 400 });
  }

  // Validate boolean fields
  const booleanFields = ["reduceMotion", "largerText", "highContrast"] as const;
  for (const field of booleanFields) {
    if (body[field] !== undefined && typeof body[field] !== "boolean") {
      return NextResponse.json({ error: `Invalid value for ${field}` }, { status: 400 });
    }
  }

  const update: Record<string, unknown> = {};
  const allowed: Array<keyof AccessibilitySettings> = [
    "theme",
    "reduceMotion",
    "largerText",
    "highContrast",
    "language",
    "fontSize",
  ];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      update[`accessibilitySettings.${key}`] = body[key];
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const db = await getMongoDb();
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: update });

  return NextResponse.json({ ok: true });
}
