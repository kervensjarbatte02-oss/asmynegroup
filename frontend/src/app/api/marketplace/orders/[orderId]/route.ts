import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> | { orderId: string } }
) {
  const { orderId } = await context.params;

  if (!ObjectId.isValid(orderId)) {
    return NextResponse.json({ error: "OrderId invalide." }, { status: 400 });
  }

  try {
    const db = await getMongoDb();
    const order = await db.collection("marketplace_orders").findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    }

    const orderData = order as Record<string, unknown>;
    const lineItems = Array.isArray(orderData.items) ? orderData.items : [];

    return NextResponse.json({
      order: {
        id: (orderData._id as { toString?: () => string })?.toString?.() ?? String(orderData.id ?? ""),
        buyerEmail: String(orderData.buyerEmail ?? ""),
        createdAt: (orderData.createdAt as { toISOString?: () => string })?.toISOString?.() ?? null,
        status: String(orderData.status ?? "created"),
        paymentStatus: String(orderData.paymentStatus ?? "pending"),
        fulfillmentStatus: String(orderData.fulfillmentStatus ?? "pending"),
        channel: String(orderData.channel ?? "marketplace"),
        grandTotal:
          typeof orderData.grandTotal === "number"
            ? orderData.grandTotal
            : lineItems.reduce((sum, item) => {
                const line = item as Record<string, unknown>;
                return sum + Number(line.total ?? 0);
              }, 0),
        lines: lineItems.map((item) => {
          const line = item as Record<string, unknown>;
          return {
            productId: String(line.productId ?? ""),
            name: String(line.name ?? ""),
            price: Number(line.price ?? 0),
            quantity: Number(line.quantity ?? 0),
            total: Number(line.total ?? 0),
          };
        }),
      },
    });
  } catch (err) {
    console.error("Marketplace order GET error:", err);
    return NextResponse.json({ error: "Erreur lors de la récupération de la commande." }, { status: 500 });
  }
}
