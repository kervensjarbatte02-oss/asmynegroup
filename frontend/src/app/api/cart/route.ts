export async function DELETE(request: NextRequest) {
  const email = await getAuthenticatedEmail();
  if (!email) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  const db = await getMongoDb();
  await db.collection("carts").deleteOne({ buyerEmail: email });
  return NextResponse.json({ ok: true }, { status: 200 });
}
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

async function getAuthenticatedEmail() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;
  if (!token) return null;
  const decoded = verifyAuthToken(token as string);
  if (!decoded || typeof decoded === "string") return null;
  return decoded.email?.toLowerCase() ?? null;
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`cart-get:${clientIp}`, 60, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const email = await getAuthenticatedEmail();
  if (!email) {
    // Utilisateur non connecté : retourner un panier vide (jamais 401)
    return NextResponse.json({ cart: [] }, { status: 200 });
  }

  const db = await getMongoDb();
  const cartDoc = await db.collection("carts").findOne({ buyerEmail: email });
  const items = cartDoc?.items ?? [];
  return NextResponse.json({ cart: items }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`cart-put:${clientIp}`, 60, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const email = await getAuthenticatedEmail();
  if (!email) {
    // Utilisateur non connecté : ignorer la sauvegarde serveur, retourner ok
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let body: { cart?: any[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const items = Array.isArray(body?.cart) ? body.cart : [];
  const db = await getMongoDb();
  try {
    await db.collection("carts").updateOne({ buyerEmail: email }, { $set: { items, updatedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    // Si le panier est trop volumineux ou autre erreur MongoDB, on retourne ok pour ne jamais bloquer l'utilisateur
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
