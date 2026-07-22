import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;
  if (!token) {
    return null;
  }

  const decoded = verifyAuthToken(token);
  if (!decoded || typeof decoded === "string" || !decoded.sub || !ObjectId.isValid(decoded.sub)) {
    return null;
  }

  return decoded.sub;
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-export:${clientIp}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = await getMongoDb();
  const objectId = new ObjectId(userId);

  const [user, reels, followsAsFollower, followsAsFollowing, statuses] = await Promise.all([
    db.collection("users").findOne(
      { _id: objectId },
      {
        projection: {
          passwordHash: 0,
          password: 0,
        },
      },
    ),
    db.collection("reels").find({ reelId: { $regex: `^${userId}-` } }).toArray(),
    db.collection("user_follows").find({ followerId: userId }).toArray(),
    db.collection("user_follows").find({ followingId: userId }).toArray(),
    db.collection("statuses").find({ ownerId: userId }).toArray(),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    user,
    reels,
    follows: {
      asFollower: followsAsFollower,
      asFollowing: followsAsFollowing,
    },
    statuses,
  };

  const filename = `asmyne-archive-${userId}-${Date.now()}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      "Cache-Control": "no-store",
    },
  });
}
