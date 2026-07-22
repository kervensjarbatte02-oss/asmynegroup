import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

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

// POST /api/account/security/revoke-sessions
// Signs the current user out of all devices by clearing the auth cookie.
// (Stateless JWT — true multi-device revocation would require a token blocklist;
//  this implementation signs out the current browser and notes the revocation time
//  so future tokens issued before that time can be rejected if a blocklist is added.)
export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-revoke:${clientIp}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Record revocation time — can be used to reject older tokens
  const db = await getMongoDb();
  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { sessionsRevokedAt: new Date() } });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("asmyne_auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
