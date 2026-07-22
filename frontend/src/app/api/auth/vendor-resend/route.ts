import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getMongoDb } from "@/lib/mongodb";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

type VendorResendBody = {
  email?: string;
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
    auth: { user, pass },
  });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request.headers);
  const rate = checkRateLimit(`vendor-resend:${clientIp}`, 5, 60_000);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: VendorResendBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const email = normalizeEmail(body.email ?? "");
  if (!email) {
    return NextResponse.json({ error: "Email est requis." }, { status: 400 });
  }

  try {
    const db = await getMongoDb();
    const otps = db.collection("vendor_otps");
    const existing = await otps.findOne({ email });

    if (!existing) {
      return NextResponse.json({ error: "Aucun code OTP en attente pour cet email." }, { status: 404 });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await otps.updateOne(
      { email },
      {
        $set: {
          code: otpCode,
          createdAt: new Date(),
          expiresAt,
        },
      },
    );

    const transporter = createTransporter();
    let emailSent = false;
    let smtpWarning: string | undefined;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "no-reply@asmyne.com",
          to: email,
          subject: "Nouveau code OTP Asmyne",
          text: `Votre nouveau code de vérification est : ${otpCode}. Il est valide 15 minutes.`,
          html: `<p>Votre nouveau code de vérification est : <strong>${otpCode}</strong>.</p><p>Il est valide 15 minutes.</p>`,
        });
        emailSent = true;
      } catch (error) {
        smtpWarning = error instanceof Error ? error.message : "Impossible d'envoyer l'email OTP.";
      }
    }

    const responseBody: Record<string, unknown> = {
      message: "Nouveau code OTP généré.",
    };

    if (!emailSent) {
      responseBody.testCode = otpCode;
      responseBody.warning = "SMTP non configuré. Utilisez ce code en développement.";
      if (smtpWarning) responseBody.smtpWarning = smtpWarning;
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: "Erreur serveur pendant le renvoi OTP.", detail },
      { status: 500 },
    );
  }
}
