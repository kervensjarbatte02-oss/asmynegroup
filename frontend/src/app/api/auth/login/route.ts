import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getMongoDb } from "@/lib/mongodb";
import { signAuthToken } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { logAnalyticsEvent } from "@/lib/eventLogger";

export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`login:${clientIp}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez plus tard." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  }

  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe sont obligatoires." },
      { status: 400 },
    );
  }

  try {
    const db = await getMongoDb();
    const users = db.collection("users");

    const user = await users.findOne<{
      _id: { toString: () => string };
      email: string;
      name: string;
      passwordHash?: string;
      password?: string;
      deactivatedAt?: Date;
    }>({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 },
      );
    }

    if (user.deactivatedAt) {
      return NextResponse.json(
        { error: "Ce compte est desactive." },
        { status: 403 },
      );
    }

    let passwordOk = false;

    if (typeof user.passwordHash === "string" && user.passwordHash.length > 0) {
      passwordOk = await bcrypt.compare(password, user.passwordHash);
    } else if (typeof user.password === "string" && user.password.length > 0) {
      passwordOk = password === user.password;

      // Migrate legacy plain-password records on successful login.
      if (passwordOk) {
        const migratedHash = await bcrypt.hash(password, 12);
        await users.updateOne(
          { _id: user._id },
          {
            $set: { passwordHash: migratedHash },
            $unset: { password: "" },
          },
        );
      }
    }

    if (!passwordOk) {
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 },
      );
    }

    await users.updateOne(
      { _id: user._id },
      ({
        $set: {
          lastActiveAt: new Date(),
          statusText: "En ligne maintenant",
        },
        $push: {
          loginHistory: {
            $each: [
              {
                ip: getClientIp(request.headers),
                userAgent: request.headers.get("user-agent") ?? "Unknown",
                timestamp: new Date().toISOString(),
              },
            ],
            $slice: -20,
          },
        },
      } as any),
    );

    try {
      await logAnalyticsEvent({
        type: "login",
        userId: user._id.toString(),
        email: user.email,
        ip: getClientIp(request.headers),
        userAgent: request.headers.get("user-agent") ?? "Unknown",
        metadata: { success: true },
      });
    } catch {
      // ignore logging failures
    }

    const token = signAuthToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        message: "Connexion reussie.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        token,
      },
      { status: 200 },
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
    return NextResponse.json(
      {
        error: "Erreur serveur pendant la connexion.",
        detail,
      },
      { status: 500 },
    );
  }
}
