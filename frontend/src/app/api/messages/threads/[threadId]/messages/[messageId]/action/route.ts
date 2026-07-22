import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";

export const runtime = "nodejs";

type Session = {
  sub: string;
};

type ThreadDoc = {
  _id?: ObjectId;
  participantIds: string[];
};

type MessageBlockDoc = {
  blockerId: string;
  blockedId: string;
  reason: string;
  createdAt: Date;
};

type MessageReportEntry = {
  userId: string;
  reason: string;
  createdAt: Date;
};

type ThreadMessageDoc = {
  _id?: ObjectId;
  threadId: string;
  senderId: string;
  text: string;
  deletedFor: string[];
  reportedBy: string[];
  reports?: MessageReportEntry[];
};

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string; messageId: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { threadId, messageId } = await params;

    if (!ObjectId.isValid(threadId) || !ObjectId.isValid(messageId)) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 400 });
    }

    const body = (await request.json()) as { action?: string; text?: string; reason?: string };
    const action = body.action?.trim();

    if (!action || !["report", "delete-for-me", "delete-for-all", "edit"].includes(action)) {
      return NextResponse.json({ error: "Action invalide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const threads = db.collection<ThreadDoc>("message_threads");
    const messages = db.collection<ThreadMessageDoc>("message_messages");
    const blocks = db.collection<MessageBlockDoc>("message_blocks");

    const thread = await threads.findOne({ _id: new ObjectId(threadId), participantIds: session.sub });
    if (!thread) {
      return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
    }

    const message = await messages.findOne({ _id: new ObjectId(messageId), threadId });
    if (!message) {
      return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
    }

    if (action === "edit") {
      if (message.senderId !== session.sub) {
        return NextResponse.json({ error: "Interdit." }, { status: 403 });
      }

      const text = body.text?.trim() ?? "";
      if (!text) {
        return NextResponse.json({ error: "Message vide." }, { status: 400 });
      }

      if (text.length > 1000) {
        return NextResponse.json({ error: "Message trop long." }, { status: 400 });
      }

      await messages.updateOne(
        { _id: new ObjectId(messageId), threadId, senderId: session.sub },
        { $set: { text } },
      );

      return NextResponse.json({ ok: true, action: "edit" }, { status: 200 });
    }

    if (action === "report") {
      const reason = body.reason?.trim() ?? "Autre";
      if (reason.length > 200) {
        return NextResponse.json({ error: "Motif trop long." }, { status: 400 });
      }

      const isSpamReason = /spam/i.test(reason);

      if ((message.reportedBy ?? []).includes(session.sub)) {
        return NextResponse.json(
          { ok: true, action: "report", alreadyReported: true, blocked: false },
          { status: 200 },
        );
      }

      await messages.updateOne(
        { _id: new ObjectId(messageId), threadId },
        {
          $addToSet: { reportedBy: session.sub },
          $push: {
            reports: {
              userId: session.sub,
              reason,
              createdAt: new Date(),
            },
          },
        },
      );

      let blocked = false;
      if (isSpamReason && message.senderId !== session.sub) {
        await blocks.createIndex({ blockerId: 1, blockedId: 1 }, { unique: true });
        await blocks.updateOne(
          { blockerId: session.sub, blockedId: message.senderId },
          {
            $setOnInsert: {
              blockerId: session.sub,
              blockedId: message.senderId,
              createdAt: new Date(),
            },
            $set: {
              reason,
            },
          },
          { upsert: true },
        );
        blocked = true;
      }

      return NextResponse.json({ ok: true, action: "report", blocked }, { status: 200 });
    }

    if (action === "delete-for-all") {
      if (message.senderId !== session.sub) {
        return NextResponse.json({ error: "Interdit." }, { status: 403 });
      }

      await messages.updateOne(
        { _id: new ObjectId(messageId), threadId, senderId: session.sub },
        { $set: { deletedFor: thread.participantIds } },
      );

      return NextResponse.json({ ok: true, action: "delete-for-all" }, { status: 200 });
    }

    await messages.updateOne(
      { _id: new ObjectId(messageId), threadId },
      { $addToSet: { deletedFor: session.sub } },
    );

    return NextResponse.json({ ok: true, action: "delete-for-me" }, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant l'action sur le message.", detail },
      { status: 500 },
    );
  }
}
