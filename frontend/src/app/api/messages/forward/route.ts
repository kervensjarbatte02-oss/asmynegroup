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

type UserDoc = {
  _id: ObjectId;
  name?: string;
  email?: string;
  createdAt?: Date | string;
  lastActiveAt?: Date | string;
};

type ThreadParticipant = {
  userId: string;
  name: string;
  handle: string;
  joinedAt: string;
  avatarClassName: string;
  isVerified?: boolean;
};

type ThreadDoc = {
  _id?: ObjectId;
  participantIds: string[];
  participants: ThreadParticipant[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageText: string;
  lastMessageAt: Date;
  lastMessageSenderId: string;
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
  createdAt: Date;
  deletedFor: string[];
  reportedBy: string[];
};

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

const AVATAR_GRADIENTS = [
  "from-[#5f6c8a] to-[#d4a6b2]",
  "from-[#4d6288] to-[#db97b6]",
  "from-[#3f2653] to-[#9067aa]",
  "from-[#326b7a] to-[#8fb6d3]",
  "from-[#5d3b74] to-[#be8de0]",
];

function gradientFromName(name: string) {
  const seed = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[seed % AVATAR_GRADIENTS.length] ?? AVATAR_GRADIENTS[0];
}

function dateLabel(value: Date | string | undefined) {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "Joined recently";
  }

  const month = date.toLocaleString("en-US", { month: "long" });
  return `Joined ${month} ${date.getFullYear()}`;
}

function handleFromName(name: string, email?: string) {
  const base = name.trim().toLowerCase().replace(/\s+/g, "");
  if (base) {
    return `@${base}`;
  }

  if (email && email.includes("@")) {
    return `@${email.split("@")[0]}`;
  }

  return "@user";
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

  return { sub: session.sub, name: session.name };
}

async function getOrCreateThread(
  db: Awaited<ReturnType<typeof getMongoDb>>,
  session: Session,
  recipient: UserDoc,
) {
  const threads = db.collection<ThreadDoc>("message_threads");
  const recipientId = recipient._id.toString();

  const candidates = await threads
    .find({ participantIds: { $all: [session.sub, recipientId] } })
    .limit(10)
    .toArray();

  const existing = candidates.find((thread) => {
    if (thread.participantIds.length !== 2) {
      return false;
    }

    return thread.participantIds.includes(session.sub) && thread.participantIds.includes(recipientId);
  });

  if (existing?._id) {
    return existing._id.toString();
  }

  const now = new Date();
  const recipientName = recipient.name?.trim() || "Client";

  const participants: ThreadParticipant[] = [
    {
      userId: session.sub,
      name: session.name,
      handle: handleFromName(session.name),
      joinedAt: "",
      avatarClassName: gradientFromName(session.name),
    },
    {
      userId: recipientId,
      name: recipientName,
      handle: handleFromName(recipientName, recipient.email),
      joinedAt: dateLabel(recipient.createdAt),
      avatarClassName: gradientFromName(recipientName),
    },
  ];

  const created = await threads.insertOne({
    participantIds: [session.sub, recipientId],
    participants,
    createdAt: now,
    updatedAt: now,
    lastMessageText: "",
    lastMessageAt: now,
    lastMessageSenderId: session.sub,
  });

  return created.insertedId.toString();
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const targetId = searchParams.get("id")?.trim() ?? "";

    const db = await getMongoDb();
    const users = db.collection<UserDoc>("users");

    const selfFilter = ObjectId.isValid(session.sub) ? { _id: { $ne: new ObjectId(session.sub) } } : {};
    const filter = targetId && ObjectId.isValid(targetId)
      ? { ...selfFilter, _id: new ObjectId(targetId) }
      : q
      ? {
          ...selfFilter,
          name: { $regex: q, $options: "i" },
        }
      : selfFilter;

    const rows = await users
      .find(filter, { projection: { name: 1, email: 1, createdAt: 1, lastActiveAt: 1 } })
      .sort({ lastActiveAt: -1, createdAt: -1 })
      .limit(60)
      .toArray();

    return NextResponse.json(
      {
        targets: rows.map((row) => {
          const name = row.name?.trim() || "Client";
          return {
            id: row._id.toString(),
            name,
            handle: handleFromName(name, row.email),
            avatarClassName: gradientFromName(name),
            isVerified: false,
          };
        }),
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la recherche des utilisateurs.", detail },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const body = (await request.json()) as {
      messageText?: string;
      recipientIds?: string[];
      attachment?: {
        url: string;
        name: string;
        mimeType: string;
        size: number;
        kind: "image" | "video" | "audio" | "file";
        durationSec?: number;
      } | null;
    };
    const messageText = body.messageText?.trim() ?? "";
    const attachment = sanitizeAttachment(body.attachment ?? null);
    const recipientIds = Array.isArray(body.recipientIds) ? body.recipientIds : [];

    if (!messageText && !attachment) {
      return NextResponse.json({ error: "Message vide." }, { status: 400 });
    }

    if (messageText.length > 1000) {
      return NextResponse.json({ error: "Message trop long." }, { status: 400 });
    }

    const uniqueRecipientIds = Array.from(
      new Set(
        recipientIds
          .map((id) => id.trim())
          .filter((id) => id && id !== session.sub && ObjectId.isValid(id)),
      ),
    );

    if (uniqueRecipientIds.length === 0) {
      return NextResponse.json({ error: "Aucun destinataire valide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const users = db.collection<UserDoc>("users");
    const messages = db.collection<ThreadMessageDoc>("message_messages");
    const threads = db.collection<ThreadDoc>("message_threads");

    const recipientObjectIds = uniqueRecipientIds.map((id) => new ObjectId(id));
    const recipients = await users.find({ _id: { $in: recipientObjectIds } }).toArray();

    const now = new Date();
    let delivered = 0;
    const threadIds: string[] = [];

    for (const recipient of recipients) {
      const threadId = await getOrCreateThread(db, session, recipient);
      threadIds.push(threadId);

      await messages.insertOne({
        threadId,
        senderId: session.sub,
        senderName: session.name,
        text: messageText,
        attachment: attachment ?? undefined,
        createdAt: now,
        deletedFor: [],
        reportedBy: [],
      });

      await threads.updateOne(
        { _id: new ObjectId(threadId), participantIds: session.sub },
        {
          $set: {
            lastMessageText: messageText || "[Piece jointe]",
            lastMessageAt: now,
            lastMessageSenderId: session.sub,
            updatedAt: now,
          },
        },
      );

      delivered += 1;
    }

    return NextResponse.json(
      {
        ok: true,
        delivered,
        requested: uniqueRecipientIds.length,
        threadIds,
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant le transfert du message.", detail },
      { status: 500 },
    );
  }
}
