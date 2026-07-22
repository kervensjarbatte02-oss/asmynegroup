import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { logAnalyticsEvent } from "@/lib/eventLogger";

export const runtime = "nodejs";

type MarketplaceOrderLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type UnknownRecord = Record<string, unknown>;

function normalizeOrderLines(items: unknown[]): MarketplaceOrderLine[] {
  return Array.isArray(items)
    ? items.map((item) => {
        const data = item as UnknownRecord;
        const price = Number(data.price ?? 0);
        const quantity = Number(data.quantity ?? 0);
        const total = Number(data.total ?? price * quantity);

        return {
          productId: String(data.productId ?? ""),
          name: String(data.name ?? data.title ?? "Produit marketplace"),
          price: Number.isNaN(price) ? 0 : price,
          quantity: Number.isNaN(quantity) ? 0 : quantity,
          total: Number.isNaN(total) ? 0 : total,
        };
      })
    : [];
}

function buildOrderSummary(order: unknown) {
  const data = order as UnknownRecord;
  const lines = normalizeOrderLines((data.items as unknown[]) ?? []);
  const grandTotal =
    typeof data.grandTotal === "number"
      ? data.grandTotal
      : lines.reduce((sum, line) => sum + line.total, 0);
  const itemsCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    id: (data._id as { toString?: () => string })?.toString?.() ?? String(data.id ?? ""),
    createdAt: (data.createdAt as { toISOString?: () => string })?.toISOString?.() ?? data.createdAt ?? null,
    status: String(data.status ?? "created"),
    paymentStatus: String(data.paymentStatus ?? "pending"),
    fulfillmentStatus: String(data.fulfillmentStatus ?? "pending"),
    channel: String(data.channel ?? "marketplace"),
    itemsCount,
    grandTotal,
    buyerEmail: String(data.buyerEmail ?? ""),
  };
}

export async function GET() {
  try {
    const db = await getMongoDb();
    const orders = await db
      .collection("marketplace_orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      orders: orders.map((order) => buildOrderSummary(order)),
    });
  } catch (error) {
    console.error("Marketplace orders GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: {
    buyerEmail?: string;
    items?: Array<{
      productId?: string;
      name?: string;
      price?: number;
      quantity?: number;
      total?: number;
    }>;
    paymentIntentId?: string;
    paymentStatus?: string;
    channel?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const buyerEmail = body.buyerEmail?.toLowerCase().trim();
  const lines = normalizeOrderLines(body.items ?? []);

  if (!buyerEmail || lines.length === 0) {
    return NextResponse.json({ error: "buyerEmail et items sont requis." }, { status: 400 });
  }

  const grandTotal = lines.reduce((sum, item) => sum + item.total, 0);
  const paymentStatus = body.paymentStatus ?? (body.paymentIntentId ? "paid" : "pending");
  const status = paymentStatus === "paid" ? "confirmed" : "created";

  try {
    const db = await getMongoDb();
    const result = await db.collection("marketplace_orders").insertOne({
      buyerEmail,
      items: lines,
      grandTotal,
      paymentStatus,
      paymentIntentId: body.paymentIntentId || null,
      channel: body.channel || "marketplace",
      status,
      fulfillmentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await logAnalyticsEvent({
        type: "marketplace_order_created",
        orderId: result.insertedId.toString(),
        email: buyerEmail,
        metadata: {
          items: lines,
          grandTotal,
          salesChannel: "marketplace",
        },
      });
    } catch {
      // ignore logging errors
    }

    return NextResponse.json({ orderId: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Marketplace orders POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande." },
      { status: 500 }
    );
  }
}
