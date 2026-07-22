import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomUUID } from "node:crypto";
import { verifyAuthToken } from "@/lib/jwt";

export const runtime = "nodejs";

type Session = {
  sub: string;
};

type AttachmentKind = "image" | "video" | "audio" | "file";

function detectAttachmentKind(mimeType: string): AttachmentKind {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  return "file";
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    return null;
  }

  const session = verifyAuthToken(token);
  if (!session) {
    return null;
  }

  return { sub: session.sub };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const durationValue = formData.get("durationSec");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
    }

    const maxSize = 15 * 1024 * 1024;
    if (file.size <= 0 || file.size > maxSize) {
      return NextResponse.json({ error: "Le fichier doit faire entre 1 octet et 15 MB." }, { status: 400 });
    }

    const safeName = sanitizeFileName(file.name);
    const extension = extname(safeName).toLowerCase();
    const mimeType = file.type || "application/octet-stream";
    const kind = detectAttachmentKind(mimeType);
    const durationSecRaw =
      typeof durationValue === "string" && durationValue.trim().length > 0
        ? Number(durationValue.trim())
        : null;
    const durationSec =
      kind === "audio" && typeof durationSecRaw === "number" && Number.isFinite(durationSecRaw) && durationSecRaw > 0
        ? Math.round(durationSecRaw)
        : undefined;
    const generatedName = `${Date.now()}-${randomUUID()}${extension}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "messages");
    const absolutePath = join(uploadDir, generatedName);

    await mkdir(uploadDir, { recursive: true });
    const arrayBuffer = await file.arrayBuffer();
    await writeFile(absolutePath, Buffer.from(arrayBuffer));

    return NextResponse.json(
      {
        attachment: {
          url: `/uploads/messages/${generatedName}`,
          name: safeName,
          mimeType,
          size: file.size,
          kind,
          durationSec,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant l'upload.", detail },
      { status: 500 },
    );
  }
}