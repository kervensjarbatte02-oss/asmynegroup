import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { signAuthToken } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

type VendorVerifyBody = {
  email?: string;
  otp?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`vendor-verify:${clientIp}`, 10, 60_000);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: VendorVerifyBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  const otp = (body.otp ?? "").trim();

  if (!email || !otp) {
    return NextResponse.json(
      { error: "Email et code OTP sont requis." },
      { status: 400 },
    );
  }

  try {
    const db = await getMongoDb();
    const otps = db.collection("vendor_otps");
    const users = db.collection("users");

    const otpRecord = await otps.findOne<{
      _id: ObjectId;
      email: string;
      nom: string;
      prenom: string;
      boutique: string;
      pays: string;
      passwordHash: string;
      code: string;
      expiresAt: Date;
    }>({ email, code: otp });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Code OTP invalide ou expiré." },
        { status: 400 },
      );
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 },
      );
    }

    const fullName = `${otpRecord.nom} ${otpRecord.prenom}`.trim();
    const inserted = await users.insertOne({
      email,
      passwordHash: otpRecord.passwordHash,
      name: fullName,
      firstName: otpRecord.prenom,
      lastName: otpRecord.nom,
      boutique: otpRecord.boutique,
      pays: otpRecord.pays,
      vendor: true,
      role: "vendor",
      createdAt: new Date(),
      lastActiveAt: new Date(),
      statusText: "Vendeur en attente",
    });

    await otps.deleteOne({ _id: otpRecord._id });

    const token = signAuthToken({
      sub: inserted.insertedId.toString(),
      email,
      name: fullName,
    });

    const response = NextResponse.json(
      {
        message: "Compte vendeur créé avec succès.",
        user: {
          id: inserted.insertedId.toString(),
          email,
          name: fullName,
        },
        token,
      },
      { status: 201 },
    );

    response.cookies.set("asmyne_auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: "Erreur serveur pendant la vérification OTP.", detail },
      { status: 500 },
    );
  }
}
