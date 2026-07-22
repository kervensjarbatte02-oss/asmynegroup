import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import Stripe from "stripe";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });

type UserDoc = {
  _id: ObjectId;
  email?: string;
  name?: string;
  stripeConnectId?: string;
  verificationStatus?: string;
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
  const rate = checkRateLimit(`stripe-connect-create:${clientIp}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const db = await getMongoDb();
  const users = db.collection<UserDoc>("users");

  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Si compte Stripe Connect existe déjà, retourner l'ID
  if (user.stripeConnectId) {
    return NextResponse.json(
      { stripeConnectId: user.stripeConnectId },
      { status: 200 },
    );
  }

  try {
    // Créer un compte Stripe Connect (type express)
    const account = await stripe.accounts.create({
      type: "express",
      email: user.email || `user-${userId}@asmyne.local`,
      metadata: {
        userId: userId,
        userName: user.name || "Unknown",
      },
    });

    // Sauvegarder l'ID du compte Stripe Connect en BD
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          stripeConnectId: account.id,
          verificationStatus: "pending",
        },
      },
    );

    return NextResponse.json(
      { stripeConnectId: account.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Stripe account creation error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe account" },
      { status: 500 },
    );
  }
}
