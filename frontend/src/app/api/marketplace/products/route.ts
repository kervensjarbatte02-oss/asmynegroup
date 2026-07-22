import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";
import { getClientIp } from "@/lib/rateLimit";
import { logAnalyticsEvent } from "@/lib/eventLogger";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const db = await getMongoDb();
    const products = await db
      .collection("products")
      .find({ published: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .toArray();

    const serializeProduct = (product: any) => ({
      ...product,
      _id: product._id?.toString?.() ?? null,
      createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
      updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
      publishedAt: product.publishedAt instanceof Date ? product.publishedAt.toISOString() : product.publishedAt,
    });

    try {
      await logAnalyticsEvent({
        type: "marketplace_product_list_view",
        ip: getClientIp(request.headers),
        userAgent: request.headers.get("user-agent") ?? "unknown",
        metadata: { count: products.length },
      });
    } catch {
      // ignore analytics failures
    }

    return NextResponse.json({ products: products.map(serializeProduct) });
  } catch (error) {
    console.error("Marketplace products GET error:", error);
    return NextResponse.json(
      { error: "Impossible de charger les produits du marketplace." },
      { status: 500 }
    );
  }
}
