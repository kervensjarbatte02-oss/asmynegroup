import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";

export const runtime = "nodejs";

type Session = {
  sub: string;
  name: string;
};

type ThreadDoc = {
  _id?: ObjectId;
  participantIds: string[];
};

type ThreadMessageDoc = {
  _id?: ObjectId;
  threadId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachment?: {
    url: string;
    name: string;
    mimeType: string;
    size: number;
    kind: "image" | "video" | "audio" | "file";
    durationSec?: number;
  };
  replyToMessageId?: string | null;
  replyToText?: string;
  replyToSenderName?: string;
  createdAt: Date;
  deletedFor: string[];
  reportedBy: string[];
};

type MessageBlockDoc = {
  blockerId: string;
  blockedId: string;
};

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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

  return {
    sub: session.sub,
    name: session.name,
  };
}

async function getAuthorizedThread(threadId: string, userId: string) {
  if (!ObjectId.isValid(threadId)) {
    return null;
  }

  const db = await getMongoDb();
  const threads = db.collection<ThreadDoc>("message_threads");

  const thread = await threads.findOne({ _id: new ObjectId(threadId), participantIds: userId });
  return thread;
}

function sanitizeAttachment(input: unknown) {
  if (!input || typeof input !== "object") {
    return null;
  }

  const value = input as {
    url?: unknown;
    name?: unknown;
    mimeType?: unknown;
    size?: unknown;
    kind?: unknown;
    durationSec?: unknown;
  };

  const url = typeof value.url === "string" ? value.url.trim() : "";
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const mimeType = typeof value.mimeType === "string" ? value.mimeType.trim() : "application/octet-stream";
  const size = typeof value.size === "number" ? value.size : 0;
  const kind = value.kind;
  const durationSec = typeof value.durationSec === "number" ? Math.round(value.durationSec) : undefined;

  if (!url || !name || !["image", "video", "audio", "file"].includes(String(kind))) {
    return null;
  }

  if (!url.startsWith("/uploads/messages/")) {
    return null;
  }

  return {
    url,
    name,
    mimeType,
    size,
    kind: kind as "image" | "video" | "audio" | "file",
    durationSec:
      kind === "audio" && typeof durationSec === "number" && Number.isFinite(durationSec) && durationSec > 0
        ? durationSec
        : undefined,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { threadId } = await params;
    const thread = await getAuthorizedThread(threadId, session.sub);

    if (!thread) {
      return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
    }

    const db = await getMongoDb();
    const messages = db.collection<ThreadMessageDoc>("message_messages");

    const list = await messages
      .find({ threadId, deletedFor: { $ne: session.sub } })
      .sort({ createdAt: 1 })
      .limit(500)
      .toArray();

    return NextResponse.json(
      {
        messages: list.map((item) => {
          const createdAt = item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt);

          return {
            id: item._id?.toString() ?? "",
            text: item.text,
            attachment: item.attachment ?? null,
            time: formatClock(createdAt),
            createdAt,
            sender: item.senderId === session.sub ? "me" : "them",
            senderName: item.senderName,
            replyTo:
              item.replyToMessageId && item.replyToText
                ? {
                    messageId: item.replyToMessageId,
                    text: item.replyToText,
                    senderName: item.replyToSenderName ?? "",
                  }
                : null,
          };
        }),
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la lecture des messages.", detail },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { threadId } = await params;
    const thread = await getAuthorizedThread(threadId, session.sub);

    if (!thread) {
      return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
    }

    const body = (await request.json()) as {
      text?: string;
      replyToMessageId?: string | null;
      attachment?: {
        url: string;
        name: string;
        mimeType: string;
        size: number;
        kind: "image" | "video" | "audio" | "file";
        durationSec?: number;
      } | null;
    };
    const text = body.text?.trim() ?? "";
    const replyToMessageId = body.replyToMessageId?.trim() ?? "";
    const attachment = sanitizeAttachment(body.attachment ?? null);

    if (!text && !attachment) {
      return NextResponse.json({ error: "Message vide." }, { status: 400 });
    }

    if (text.length > 1000) {
      return NextResponse.json({ error: "Message trop long." }, { status: 400 });
    }

    const db = await getMongoDb();
    const messages = db.collection<ThreadMessageDoc>("message_messages");
    const threads = db.collection("message_threads");
    const blocks = db.collection<MessageBlockDoc>("message_blocks");

    const otherParticipantId = thread.participantIds.find((id) => id !== session.sub) ?? null;
    if (otherParticipantId) {
      const blockedLink = await blocks.findOne({
        $or: [
          { blockerId: session.sub, blockedId: otherParticipantId },
          { blockerId: otherParticipantId, blockedId: session.sub },
        ],
      });

      if (blockedLink) {
        return NextResponse.json(
          { error: "Impossible d'envoyer ce message: utilisateur bloque." },
          { status: 403 },
        );
      }
    }

    const now = new Date();

    let replyToText = "";
    let replyToSenderName = "";

    if (replyToMessageId) {
      if (!ObjectId.isValid(replyToMessageId)) {
        return NextResponse.json({ error: "Message de reponse invalide." }, { status: 400 });
      }

      const replyTarget = await messages.findOne({ _id: new ObjectId(replyToMessageId), threadId });
      if (!replyTarget) {
        return NextResponse.json({ error: "Message de reponse introuvable." }, { status: 404 });
      }

      replyToText = replyTarget.text;
      replyToSenderName = replyTarget.senderName;
    }

    const inserted = await messages.insertOne({
      threadId,
      senderId: session.sub,
      senderName: session.name,
      text,
      attachment: attachment ?? undefined,
      replyToMessageId: replyToMessageId || null,
      replyToText: replyToText || undefined,
      replyToSenderName: replyToSenderName || undefined,
      createdAt: now,
      deletedFor: [],
      reportedBy: [],
    });

    await threads.updateOne(
      { _id: new ObjectId(threadId), participantIds: session.sub },
      {
        $set: {
          lastMessageText: text || "[Piece jointe]",
          lastMessageAt: now,
          lastMessageSenderId: session.sub,
          updatedAt: now,
        },
      },
    );

    return NextResponse.json(
      {
        message: {
          id: inserted.insertedId.toString(),
          text,
          attachment: attachment ?? null,
          time: formatClock(now),
          createdAt: now,
          sender: "me",
          senderName: session.name,
          replyTo:
            replyToMessageId && replyToText
              ? {
                  messageId: replyToMessageId,
                  text: replyToText,
                  senderName: replyToSenderName,
                }
              : null,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant l'envoi du message.", detail },
      { status: 500 },
    );
  }
}
