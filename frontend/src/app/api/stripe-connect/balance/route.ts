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
  const rate = checkRateLimit(`stripe-connect-balance:${clientIp}`, 30, 60_000);
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
  if (!user || !user.stripeConnectId) {
    return NextResponse.json(
      { error: "No Stripe Connect account found" },
      { status: 404 },
    );
  }

  try {
    // Récupérer les virements récents du compte connecté
    const payouts = await stripe.payouts.list(
      { limit: 10 },
      { stripeAccount: user.stripeConnectId } as any,
    );

    return NextResponse.json(
      {
        available: [],
        pending: [],
        payouts: payouts.data.map((payout) => ({
          id: payout.id,
          amount: payout.amount,
          currency: payout.currency,
          status: payout.status,
          arrivalDate: payout.arrival_date,
          created: payout.created,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Stripe balance error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve balance" },
      { status: 500 },
    );
  }
}
