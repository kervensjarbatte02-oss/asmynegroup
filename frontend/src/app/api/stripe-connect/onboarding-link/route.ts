import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getStripe } from "@/lib/stripe";

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

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`stripe-connect-onboarding:${clientIp}`, 10, 60_000);
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
    // Créer un lien d'onboarding valide 60 minutes
    const loginLink = await stripe.accounts.createLoginLink(user.stripeConnectId);

    return NextResponse.json(
      { url: loginLink.url },
      { status: 200 },
    );
  } catch (error) {
    console.error("Stripe onboarding link error:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding link" },
      { status: 500 },
    );
  }
}
