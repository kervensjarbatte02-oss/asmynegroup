import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getMongoDb } from "@/lib/mongodb";
import { signAuthToken } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { persistImageIfNeeded, validateImageReference } from "@/lib/imageStorage";
import { logAnalyticsEvent } from "@/lib/eventLogger";

export const runtime = "nodejs";

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  sex?: string;
  age?: number;
  houseNumber?: string;
  streetAddress?: string;
  zipCode?: string;
  country?: string;
  city?: string;
  phone?: string;
  confirmEmail?: string;
  photoDataUrl?: string;
  lookingFor?: string;
  searchLocation?: string;
  email?: string;
  password?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`register:${clientIp}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez plus tard." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  let body: RegisterBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  if (!firstName || !lastName || !phone || !email || !password) {
    return NextResponse.json(
      { error: "Tous les champs sont obligatoires pour verifier le client." },
      { status: 400 },
    );
  }



  if (!email.includes("@")) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères." },
      { status: 400 },
    );
  }

  try {
    const db = await getMongoDb();
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne<{ _id: unknown }>({ email });

    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const inserted = await users.insertOne({
      name: fullName,
      firstName,
      lastName,
      phone,
      email,
      passwordHash,
      createdAt: new Date(),
      statusText: "Nouveau membre",
      lastActiveAt: new Date(),
    });

    const user = {
      id: inserted.insertedId.toString(),
      name: fullName,
      email,
    };

    try {
      await logAnalyticsEvent({
        type: "signup",
        userId: user.id,
        email,
        ip: clientIp,
        userAgent: request.headers.get("user-agent") ?? "unknown",
        metadata: {
          firstName,
          lastName,
          phone,
        },
      });
    } catch {
      // ignore logging failures
    }

    const token = signAuthToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        message: "Registro completado.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
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
    const detail = error instanceof Error ? error.message : "Unknown error";
    if (detail.includes("E11000")) {
      return NextResponse.json(
        { error: "Este correo ya esta registrado." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Error del servidor durante el registro.",
        detail,
      },
      { status: 500 },
    );
  }
}
