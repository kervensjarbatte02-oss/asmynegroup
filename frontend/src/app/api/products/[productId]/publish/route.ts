import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> | { productId: string } }
) {
  const { productId } = await context.params;
  let productObjectId: ObjectId;

  try {
    productObjectId = new ObjectId(productId);
  } catch (error) {
    return NextResponse.json(
      { error: "Identifiant de produit invalide." },
      { status: 400 }
    );
  }

  try {
    const db = await getMongoDb();
    const result = await db.collection("products").findOneAndUpdate(
      { _id: productObjectId },
      {
        $set: {
          published: true,
          publishedAt: new Date(),
          updatedAt: new Date(),
          status: "Active",
        },
      },
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ productId: productId, published: true });
  } catch (error) {
    console.error("Publish product error:", error);
    return NextResponse.json(
      { error: "Impossible de publier le produit." },
      { status: 500 }
    );
  }
}
