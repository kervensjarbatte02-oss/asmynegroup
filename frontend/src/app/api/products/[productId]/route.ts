import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { persistImageIfNeeded } from "@/lib/imageStorage";

export const runtime = "nodejs";

export async function GET(
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
    const product = await db.collection("products").findOne({ _id: productObjectId });

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product GET error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le produit." },
      { status: 500 }
    );
  }
}

export async function PUT(
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

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.name === "string") updates.name = body.name.trim();
  if (typeof body.description === "string") updates.description = body.description.trim();
  if (typeof body.category === "string") updates.category = body.category;
  if (typeof body.imageUrl === "string") {
    updates.imageUrl = await persistImageIfNeeded(String(body.imageUrl), "products", { maxBytes: 5_000_000 });
  }
  if (typeof body.slug === "string") updates.slug = body.slug;
  if (typeof body.storeName === "string") updates.storeName = body.storeName;
  if (typeof body.status === "string") updates.status = body.status;
  if (typeof body.published === "boolean") {
    updates.published = body.published;
    if (body.published) {
      updates.publishedAt = new Date();
    }
  }

  if (typeof body.price === "number" || typeof body.price === "string") {
    updates.price = Number(body.price) || 0;
  }

  if (typeof body.stock === "number" || typeof body.stock === "string") {
    updates.stock = Number(body.stock) || 0;
  }

  if (Array.isArray(body.images)) {
    updates.images = await Promise.all(
      (body.images as any[])
        .filter((img: any) => typeof img === "string" && img.length > 0)
        .map(async (img: any) =>
          await persistImageIfNeeded(String(img), "products", { maxBytes: 5_000_000 })
        )
    );
  }

  if (Array.isArray(body.variants)) {
    updates.variants = body.variants;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Aucune donnée valide pour mettre à jour." },
      { status: 400 }
    );
  }

  updates.updatedAt = new Date();

  try {
    const db = await getMongoDb();
    const result = await db.collection("products").updateOne(
      { _id: productObjectId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }

    return NextResponse.json({ updatedId: productId });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le produit." },
      { status: 500 }
    );
  }
}
