import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

type UserDoc = {
  _id: ObjectId;
  passwordHash?: string;
  password?: string;
  deactivatedAt?: Date;
};

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

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-deactivate:${clientIp}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { password?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password ?? "";
  const reason = (body.reason ?? "").trim().slice(0, 300);

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const db = await getMongoDb();
  const users = db.collection<UserDoc>("users");

  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let passwordMatches = false;
  if (typeof user.passwordHash === "string" && user.passwordHash.length > 0) {
    passwordMatches = await bcrypt.compare(password, user.passwordHash);
  } else if (typeof user.password === "string" && user.password.length > 0) {
    passwordMatches = user.password === password;
  }

  if (!passwordMatches) {
    return NextResponse.json({ error: "Password is incorrect" }, { status: 401 });
  }

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        deactivatedAt: new Date(),
        deactivationReason: reason,
        statusText: "Account deactivated",
      },
      $unset: {
        asmyne_auth: "",
      },
    },
  );

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("asmyne_auth", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
