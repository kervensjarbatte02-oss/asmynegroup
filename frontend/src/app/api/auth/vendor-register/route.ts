import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

type VendorRegisterBody = {
  nom?: string;
  prenom?: string;
  boutique?: string;
  pays?: string;
  email?: string;
  password?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`vendor-register:${clientIp}`, 5, 60_000);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: VendorRegisterBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const nom = body.nom?.trim() ?? "";
  const prenom = body.prenom?.trim() ?? "";
  const boutique = body.boutique?.trim() ?? "";
  const pays = body.pays?.trim() ?? "";
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";

  if (!nom || !prenom || !boutique || !pays || !email || !password) {
    return NextResponse.json(
      { error: "Tous les champs sont obligatoires." },
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
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otpCode = generateOtpCode();
    const otps = db.collection("vendor_otps");

    await otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await otps.deleteMany({ email });
    await otps.insertOne({
      email,
      nom,
      prenom,
      boutique,
      pays,
      passwordHash,
      code: otpCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const transporter = createTransporter();
    let emailSent = false;
    let smtpWarning: string | undefined;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "no-reply@asmyne.com",
          to: email,
          subject: "Votre code OTP Asmyne",
          text: `Bonjour ${prenom},\n\nVotre code de vérification pour la création de compte vendeur est : ${otpCode}.\nCe code est valide 15 minutes.\n\nMerci.`,
          html: `<p>Bonjour ${prenom},</p><p>Votre code de vérification pour la création de compte vendeur est : <strong>${otpCode}</strong>.</p><p>Ce code est valide 15 minutes.</p><p>Merci.</p>`,
        });
        emailSent = true;
      } catch (error) {
        smtpWarning =
          error instanceof Error ? error.message : "Impossible d'envoyer l'email OTP.";
      }
    }

    const responseBody: Record<string, unknown> = {
      message: "Code OTP généré.",
    };

    if (!emailSent) {
      responseBody.testCode = otpCode;
      responseBody.warning =
        "SMTP non configuré. Utilisez ce code en développement pour vérifier l'inscription vendeur.";
      if (smtpWarning) {
        responseBody.smtpWarning = smtpWarning;
      }
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    if (typeof detail === "string" && detail.includes("E11000")) {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Erreur serveur pendant l'envoi de l'OTP.", detail },
      { status: 500 },
    );
  }
}
