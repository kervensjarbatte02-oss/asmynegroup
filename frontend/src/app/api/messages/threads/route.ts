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

const SEED_CONTACTS: Omit<ThreadParticipant, "userId">[] = [
  {
    name: "elena babe",
    handle: "@elena2sexy0",
    joinedAt: "Joined April 2025",
    avatarClassName: "from-[#5f6c8a] to-[#d4a6b2]",
  },
  {
    name: "2ClitFreak",
    handle: "@2clitfreak",
    joinedAt: "Joined March 2025",
    avatarClassName: "from-[#4d6288] to-[#db97b6]",
    isVerified: true,
  },
];

function toRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diffMs < minute) {
    return "now";
  }

  if (diffMs < hour) {
    return `${Math.max(1, Math.floor(diffMs / minute))}m`;
  }

  if (diffMs < day) {
    return `${Math.max(1, Math.floor(diffMs / hour))}h`;
  }

  if (diffMs < week) {
    return `${Math.max(1, Math.floor(diffMs / day))}d`;
  }

  return `${Math.max(1, Math.floor(diffMs / week))}w`;
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

async function ensureSeedThreads(session: Session) {
  const db = await getMongoDb();
  const threads = db.collection<ThreadDoc>("message_threads");
  const messages = db.collection<ThreadMessageDoc>("message_messages");

  await threads.createIndex({ participantIds: 1 });
  await messages.createIndex({ threadId: 1, createdAt: 1 });

  const existingCount = await threads.countDocuments({ participantIds: session.sub });
  if (existingCount > 0) {
    return;
  }

  const now = new Date();

  for (const [index, contact] of SEED_CONTACTS.entries()) {
    const contactId = `seed-contact-${index + 1}`;
    const participants: ThreadParticipant[] = [
      {
        userId: session.sub,
        name: session.name,
        handle: "@you",
        joinedAt: "",
        avatarClassName: "from-[#3f2653] to-[#9067aa]",
      },
      {
        userId: contactId,
        ...contact,
      },
    ];

    const threadInsert = await threads.insertOne({
      participantIds: [session.sub, contactId],
      participants,
      createdAt: now,
      updatedAt: now,
      lastMessageText: index === 0 ? "hruuu?" : "ahh ok",
      lastMessageAt: now,
      lastMessageSenderId: index === 0 ? contactId : session.sub,
    });

    const threadId = threadInsert.insertedId.toString();

    await messages.insertOne({
      threadId,
      senderId: index === 0 ? contactId : session.sub,
      senderName: index === 0 ? contact.name : session.name,
      text: index === 0 ? "hruuu?" : "ahh ok",
      createdAt: now,
      deletedFor: [],
      reportedBy: [],
    });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    await ensureSeedThreads(session);

    const db = await getMongoDb();
    const threads = db.collection<ThreadDoc>("message_threads");
    const messages = db.collection<ThreadMessageDoc>("message_messages");

    const list = await threads
      .find({ participantIds: session.sub })
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .toArray();

    const threadIds = list
      .map((thread) => thread._id?.toString() ?? "")
      .filter((id) => id.length > 0);

    const latestVisibleRows = threadIds.length
      ? await messages
          .aggregate<{
            _id: string;
            latest: {
              senderId: string;
              text: string;
              createdAt: Date | string;
              attachment?: { kind: "image" | "video" | "audio" | "file" };
            };
          }>([
            {
              $match: {
                threadId: { $in: threadIds },
                deletedFor: { $ne: session.sub },
              },
            },
            { $sort: { createdAt: -1 } },
            {
              $group: {
                _id: "$threadId",
                latest: {
                  $first: {
                    senderId: "$senderId",
                    text: "$text",
                    createdAt: "$createdAt",
                    attachment: "$attachment",
                  },
                },
              },
            },
          ])
          .toArray()
      : [];

    const latestByThreadId = new Map(latestVisibleRows.map((row) => [row._id, row.latest]));

    const payload = list
      .map((thread) => {
      const threadId = thread._id?.toString() ?? "";
      const latestVisible = latestByThreadId.get(threadId);
      if (!latestVisible) {
        return null;
      }

      const contact = thread.participants.find((participant) => participant.userId !== session.sub);

      const latestDateRaw = latestVisible.createdAt;
      const latestDate = latestDateRaw instanceof Date ? latestDateRaw : new Date(latestDateRaw);
      const safeDate = Number.isNaN(latestDate.getTime()) ? new Date() : latestDate;

      const previewSourceText = latestVisible.text || (latestVisible.attachment ? "[Piece jointe]" : "");
      const previewSourceSenderId = latestVisible.senderId;
      const preview = previewSourceSenderId === session.sub ? `You: ${previewSourceText}` : previewSourceText;

      return {
        id: threadId,
        name: contact?.name ?? "Conversation",
        handle: contact?.handle ?? "",
        joinedAt: contact?.joinedAt ?? "",
        avatarClassName: contact?.avatarClassName ?? "from-[#3f2653] to-[#9067aa]",
        isVerified: contact?.isVerified ?? false,
        preview,
        time: toRelativeTime(safeDate),
        sortTs: safeDate.getTime(),
      };
      })
      .filter((item): item is { id: string; name: string; handle: string; joinedAt: string; avatarClassName: string; isVerified: boolean; preview: string; time: string; sortTs: number } => item !== null);

    payload.sort((a, b) => b.sortTs - a.sortTs);

    return NextResponse.json(
      {
        threads: payload.map(({ sortTs, ...thread }) => thread),
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant le chargement des conversations.", detail },
      { status: 500 },
    );
  }
}
