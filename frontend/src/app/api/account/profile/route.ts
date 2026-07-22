import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

type UserDoc = {
  _id: ObjectId;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  searchLocation?: string;
  statusText?: string;
  paymentEmail?: string;
  notifyOrders?: boolean;
  notifyMessages?: boolean;
  accountVisible?: boolean;
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

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-profile-get:${clientIp}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = await getMongoDb();
  const users = db.collection<UserDoc>("users");

  const user = await users.findOne(
    { _id: new ObjectId(userId) },
    {
      projection: {
        name: 1,
        email: 1,
        phone: 1,
        city: 1,
        country: 1,
        searchLocation: 1,
        statusText: 1,
        paymentEmail: 1,
        notifyOrders: 1,
        notifyMessages: 1,
        accountVisible: 1,
        deactivatedAt: 1,
      },
    },
  );

  if (!user || user.deactivatedAt) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      profile: {
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        city: user.city ?? "",
        country: user.country ?? "",
        location: user.searchLocation ?? "",
        bio: user.statusText ?? "",
        paymentEmail: user.paymentEmail ?? "",
        notifyOrders: user.notifyOrders ?? true,
        notifyMessages: user.notifyMessages ?? true,
        accountVisible: user.accountVisible ?? true,
      },
    },
    { status: 200 },
  );
}

export async function PATCH(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`account-profile-patch:${clientIp}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    location?: string;
    bio?: string;
    paymentEmail?: string;
    notifyOrders?: boolean;
    notifyMessages?: boolean;
    accountVisible?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim();
  const city = body.city?.trim();
  const country = body.country?.trim();
  const location = body.location?.trim();
  const bio = body.bio?.trim();
  const paymentEmail = body.paymentEmail?.trim().toLowerCase();
  const notifyOrders = body.notifyOrders;
  const notifyMessages = body.notifyMessages;
  const accountVisible = body.accountVisible;

  if (name !== undefined && (name.length < 2 || name.length > 80)) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  if (email !== undefined && (!email.includes("@") || email.length > 160)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (phone !== undefined && phone.length > 32) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  if (city !== undefined && city.length > 80) {
    return NextResponse.json({ error: "Invalid city" }, { status: 400 });
  }

  if (country !== undefined && country.length > 80) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }

  if (location !== undefined && location.length > 100) {
    return NextResponse.json({ error: "Invalid location" }, { status: 400 });
  }

  if (paymentEmail !== undefined && paymentEmail.length > 320) {
    return NextResponse.json({ error: "Invalid payment email" }, { status: 400 });
  }

  if (paymentEmail !== undefined && paymentEmail.length > 0 && !paymentEmail.includes("@")) {
    return NextResponse.json({ error: "Invalid payment email" }, { status: 400 });
  }

  if (bio !== undefined && bio.length > 160) {
    return NextResponse.json({ error: "Invalid bio" }, { status: 400 });
  }

  if (notifyOrders !== undefined && typeof notifyOrders !== "boolean") {
    return NextResponse.json({ error: "Invalid notifyOrders" }, { status: 400 });
  }
  if (notifyMessages !== undefined && typeof notifyMessages !== "boolean") {
    return NextResponse.json({ error: "Invalid notifyMessages" }, { status: 400 });
  }
  if (accountVisible !== undefined && typeof accountVisible !== "boolean") {
    return NextResponse.json({ error: "Invalid accountVisible" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (city !== undefined) updateData.city = city;
  if (country !== undefined) updateData.country = country;
  if (location !== undefined) updateData.searchLocation = location;
  if (bio !== undefined) updateData.statusText = bio;
  if (paymentEmail !== undefined) updateData.paymentEmail = paymentEmail;
  if (notifyOrders !== undefined) updateData.notifyOrders = notifyOrders;
  if (notifyMessages !== undefined) updateData.notifyMessages = notifyMessages;
  if (accountVisible !== undefined) updateData.accountVisible = accountVisible;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const db = await getMongoDb();
  const users = db.collection<UserDoc>("users");

  if (email !== undefined) {
    const duplicate = await users.findOne({
      email,
      _id: { $ne: new ObjectId(userId) },
    });

    if (duplicate) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

  if (!result.matchedCount) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
