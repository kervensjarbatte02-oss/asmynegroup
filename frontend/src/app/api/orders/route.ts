import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { logAnalyticsEvent } from "@/lib/eventLogger";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const db = await getMongoDb();
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      orders: orders.map((order) => ({
        ...order,
        id: order._id.toString(),
        _id: undefined,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des commandes." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: { items?: Array<{ id?: string; name?: string; price?: number; quantity?: number }>; stripePaymentIntentId?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Items sont requis." }, { status: 400 });
  }

  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
  const decoded = token ? verifyAuthToken(token) : null;

  try {
    const db = await getMongoDb();
    const order = {
      items,
      stripePaymentIntentId: body.stripePaymentIntentId || null,
      status: "paid",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: decoded ? { id: decoded.sub, email: decoded.email, name: decoded.name } : null,
    };

    const result = await db.collection("orders").insertOne(order);

    try {
      await logAnalyticsEvent({
        type: "order_created",
        orderId: result.insertedId.toString(),
        email: decoded?.email,
        metadata: {
          items,
          stripePaymentIntentId: body.stripePaymentIntentId,
        },
      });
    } catch {
      // ignore logging errors
    }

    return NextResponse.json({ orderId: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de la commande." }, { status: 500 });
  }
}
