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
  stripeConnectId?: string;
  verificationStatus?: string;
  verifiedAt?: Date;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  rejectionReason?: string;
  bankAccountLast4?: string;
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
  const rate = checkRateLimit(`stripe-connect-status:${clientIp}`, 30, 60_000);
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

  if (!user.stripeConnectId) {
    return NextResponse.json(
      {
        status: "not_connected",
        verificationStatus: null,
        chargesEnabled: false,
        payoutsEnabled: false,
      },
      { status: 200 },
    );
  }

  try {
    // Récupérer les détails du compte Stripe
    const account = await stripe.accounts.retrieve(user.stripeConnectId);

    let verificationStatus = "pending";
    if (account.charges_enabled && account.payouts_enabled) {
      verificationStatus = "verified";
    }

    // Mettre à jour la BD avec le statut actuel
    const updateData: Partial<UserDoc> = {
      verificationStatus,
      chargesEnabled: account.charges_enabled || false,
      payoutsEnabled: account.payouts_enabled || false,
    };

    if (verificationStatus === "verified" && !user.verifiedAt) {
      updateData.verifiedAt = new Date();
    }

    if (account.requirements?.eventually_due) {
      updateData.rejectionReason = account.requirements.eventually_due.join(", ");
    }

    await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

    return NextResponse.json(
      {
        status: "connected",
        verificationStatus,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        currentlyDue: account.requirements?.currently_due || [],
        eventuallyDue: account.requirements?.eventually_due || [],
        email: account.email,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Stripe account status error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve account status" },
      { status: 500 },
    );
  }
}
