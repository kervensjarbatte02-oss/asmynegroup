import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { getClientIp } from "@/lib/rateLimit";
import { logAnalyticsEvent } from "@/lib/eventLogger";
import { persistImageIfNeeded } from "@/lib/imageStorage";

// Correction : expose une API REST pour /api/products

export async function GET(request: NextRequest) {
  try {
    const db = await getMongoDb();
    const publishedOnly = request.nextUrl.searchParams.get("published") === "true";
    const slug = request.nextUrl.searchParams.get("slug")?.trim();
    const query: Record<string, unknown> = {};

    if (publishedOnly) {
      query.published = true;
    }
    if (slug) {
      query.slug = slug;
    }

    const serializeProduct = (product: any) => ({
      ...product,
      _id: product._id?.toString?.() ?? null,
      createdAt: product.createdAt instanceof Date ? product.createdAt.toISOString() : product.createdAt,
      updatedAt: product.updatedAt instanceof Date ? product.updatedAt.toISOString() : product.updatedAt,
      publishedAt: product.publishedAt instanceof Date ? product.publishedAt.toISOString() : product.publishedAt,
    });

    if (slug) {
      const product = await db.collection("products").findOne(query);
      if (!product) {
        return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
      }

      try {
        await logAnalyticsEvent({
          type: "product_detail_view",
          ip: getClientIp(request.headers),
          userAgent: request.headers.get("user-agent") ?? "unknown",
          metadata: { slug, publishedOnly },
        });
      } catch {
        // ignore logging failures
      }

      return NextResponse.json({ product: serializeProduct(product) });
    }

    const products = await db
      .collection("products")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    try {
      await logAnalyticsEvent({
        type: "product_list_view",
        ip: getClientIp(request.headers),
        userAgent: request.headers.get("user-agent") ?? "unknown",
        metadata: { count: products.length, publishedOnly },
      });
    } catch {
      // ignore logging failures
    }

    return NextResponse.json({ products: products.map(serializeProduct) });
  } catch (e) {
    console.error("Products route error:", e);
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getMongoDb();
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const price = Number(body.price) || 0;
    const published = body.published === true || String(body.status || "").toLowerCase() === "active";

    if (!name || price <= 0) {
      return NextResponse.json(
        { error: "Le nom et le prix sont obligatoires." },
        { status: 400 }
      );
    }

    const images = Array.isArray(body.images)
      ? await Promise.all(
          (body.images as any[])
            .filter((img: any) => typeof img === "string" && img.length > 0)
            .map(async (img: any) =>
              await persistImageIfNeeded(String(img), "products", { maxBytes: 5_000_000 })
            )
        )
      : [];

    const persistedImageUrl =
      typeof body.imageUrl === "string" && body.imageUrl.length > 0
        ? await persistImageIfNeeded(String(body.imageUrl), "products", { maxBytes: 5_000_000 })
        : "";

    const product = {
      name,
      description: typeof body.description === "string" ? body.description.trim() : "",
      category: typeof body.category === "string" ? body.category : "",
      price,
      imageUrl:
        persistedImageUrl ||
        (images.length > 0 ? images[0] : typeof body.media === "string" ? body.media : ""),
      images,
      stock: Number(body.stock) || 0,
      storeName: typeof body.storeName === "string" ? body.storeName : "Espace vendeur",
      slug:
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim()
          : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      published,
      status: typeof body.status === "string" ? body.status : published ? "Active" : "Draft",
      publishedAt: published ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);

    if (product.category) {
      await db.collection("collections").updateOne(
        { title: product.category },
        {
          $setOnInsert: {
            title: product.category,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    try {
      await logAnalyticsEvent({
        type: "product_created",
        productId: result.insertedId.toString(),
        ip: getClientIp(request.headers),
        userAgent: request.headers.get("user-agent") ?? "unknown",
        metadata: {
          name,
          price,
          storeName: product.storeName,
          published,
        },
      });
    } catch {
      // ignore logging failures
    }

    return NextResponse.json({ insertedId: result.insertedId.toString() });
  } catch (e) {
    console.error("Products POST error:", e);
    return NextResponse.json({ error: "Erreur lors de l'ajout du produit" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const ids = Array.isArray(body?.ids) ? body.ids : [];

    if (!ids.length) {
      return NextResponse.json({ error: "Aucun identifiant de produit fourni." }, { status: 400 });
    }

    const objectIds: ObjectId[] = [];
    for (const id of ids) {
      try {
        objectIds.push(new ObjectId(id));
      } catch {
        // ignore invalid ids
      }
    }

    if (!objectIds.length) {
      return NextResponse.json({ error: "Aucun identifiant de produit valide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const result = await db.collection("products").deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json({ deletedCount: result.deletedCount });
  } catch (e) {
    console.error("Products DELETE error:", e);
    return NextResponse.json({ error: "Erreur lors de la suppression des produits." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
