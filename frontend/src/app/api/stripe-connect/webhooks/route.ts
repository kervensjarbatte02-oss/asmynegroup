import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";

type UserDoc = {
  _id: ObjectId;
  stripeConnectId?: string;
  verificationStatus?: string;
  verifiedAt?: Date;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  rejectionReason?: string;
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  const stripe = getStripe();
  const webhookSecret = getStripeWebhookSecret();
  let event: import("stripe").Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const db = await getMongoDb();
  const users = db.collection<UserDoc>("users");

  try {
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object as import("stripe").Stripe.Account;

        // Trouver l'utilisateur avec ce compte Stripe Connect
        const user = await users.findOne({ stripeConnectId: account.id });
        if (!user) break;

        // Déterminer le statut de vérification
        let verificationStatus = "pending";
        if (account.charges_enabled && account.payouts_enabled) {
          verificationStatus = "verified";
        }

        // Mettre à jour le statut en BD
        const updateData: Partial<UserDoc> = {
          verificationStatus,
        };

        if (verificationStatus === "verified") {
          updateData.stripeConnectId = account.id;
        }

        await users.updateOne({ _id: user._id }, { $set: updateData });

        console.log(`Account ${account.id} updated. Status: ${verificationStatus}`);
        break;
      }

      case "payout.created": {
        const payout = event.data.object as import("stripe").Stripe.Payout;
        console.log(`Payout created: ${payout.id}, amount: ${payout.amount}`);
        break;
      }

      case "payout.paid": {
        const payout = event.data.object as import("stripe").Stripe.Payout;
        console.log(`Payout paid: ${payout.id}, amount: ${payout.amount}`);
        break;
      }

      case "payout.failed": {
        const payout = event.data.object as import("stripe").Stripe.Payout;
        console.error(`Payout failed: ${payout.id}, failure code: ${payout.failure_code}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
