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
  avatarClassName: string;
};

type ThreadDoc = {
  _id?: ObjectId;
  participantIds: string[];
  participants: ThreadParticipant[];
};

type CallStatus = "ringing" | "accepted" | "declined" | "ended" | "missed";

type MessageCallDoc = {
  _id?: ObjectId;
  threadId: string;
  callerId: string;
  calleeId: string;
  mode: "audio" | "video";
  roomName: string;
  status: CallStatus;
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
};

type MessageBlockDoc = {
  blockerId: string;
  blockedId: string;
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

  return {
    sub: session.sub,
    name: session.name,
  };
}

function roomNameFromThreadId(threadId: string) {
  return `asmyne-${threadId.replace(/[^a-zA-Z0-9]/g, "")}`;
}

function buildCallPayload(call: MessageCallDoc, thread: ThreadDoc | null, sessionUserId: string) {
  const caller = thread?.participants.find((participant) => participant.userId === call.callerId);
  const callee = thread?.participants.find((participant) => participant.userId === call.calleeId);

  return {
    id: call._id?.toString() ?? "",
    threadId: call.threadId,
    mode: call.mode,
    status: call.status,
    roomName: call.roomName,
    callerId: call.callerId,
    calleeId: call.calleeId,
    callerName: caller?.name ?? "Caller",
    calleeName: callee?.name ?? "Callee",
    callerAvatarClassName: caller?.avatarClassName ?? "from-[#3f2653] to-[#9067aa]",
    calleeAvatarClassName: callee?.avatarClassName ?? "from-[#3f2653] to-[#9067aa]",
    isIncoming: call.calleeId === sessionUserId,
    createdAt: call.createdAt,
    updatedAt: call.updatedAt,
  };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId")?.trim() ?? "";

    const db = await getMongoDb();
    const calls = db.collection<MessageCallDoc>("message_calls");
    const threads = db.collection<ThreadDoc>("message_threads");

    await calls.createIndex({ callerId: 1, calleeId: 1, status: 1, updatedAt: -1 });
    await calls.createIndex({ threadId: 1, status: 1, updatedAt: -1 });

    const threadFilter = threadId ? { threadId } : {};

    const [incomingRaw, outgoingRaw, activeRaw, missedRaw] = await Promise.all([
      calls.findOne(
        {
          ...threadFilter,
          calleeId: session.sub,
          status: "ringing",
        },
        { sort: { updatedAt: -1 } },
      ),
      calls.findOne(
        {
          ...threadFilter,
          callerId: session.sub,
          status: "ringing",
        },
        { sort: { updatedAt: -1 } },
      ),
      calls.findOne(
        {
          ...threadFilter,
          $or: [{ callerId: session.sub }, { calleeId: session.sub }],
          status: "accepted",
        },
        { sort: { updatedAt: -1 } },
      ),
      calls
        .find(
          {
            ...threadFilter,
            calleeId: session.sub,
            status: { $in: ["missed", "declined"] },
          },
          { sort: { updatedAt: -1 } },
        )
        .limit(5)
        .toArray(),
    ]);

    const ids = [incomingRaw?.threadId, outgoingRaw?.threadId, activeRaw?.threadId, ...missedRaw.map((item) => item.threadId)]
      .filter((item): item is string => Boolean(item));

    const uniqueThreadIds = Array.from(new Set(ids));
    const threadRows = uniqueThreadIds.length
      ? await threads
          .find({ _id: { $in: uniqueThreadIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } })
          .toArray()
      : [];

    const threadById = new Map(threadRows.map((item) => [item._id?.toString() ?? "", item]));

    return NextResponse.json(
      {
        incoming: incomingRaw ? buildCallPayload(incomingRaw, threadById.get(incomingRaw.threadId) ?? null, session.sub) : null,
        outgoing: outgoingRaw ? buildCallPayload(outgoingRaw, threadById.get(outgoingRaw.threadId) ?? null, session.sub) : null,
        active: activeRaw ? buildCallPayload(activeRaw, threadById.get(activeRaw.threadId) ?? null, session.sub) : null,
        missed: missedRaw.map((item) => buildCallPayload(item, threadById.get(item.threadId) ?? null, session.sub)),
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la lecture des appels.", detail },
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
      action?: string;
      threadId?: string;
      mode?: "audio" | "video";
      callId?: string;
    };

    const action = body.action?.trim();
    if (!action || !["initiate", "accept", "decline", "end"].includes(action)) {
      return NextResponse.json({ error: "Action invalide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const calls = db.collection<MessageCallDoc>("message_calls");
    const threads = db.collection<ThreadDoc>("message_threads");
    const blocks = db.collection<MessageBlockDoc>("message_blocks");

    if (action === "initiate") {
      const threadId = body.threadId?.trim() ?? "";
      const mode = body.mode === "video" ? "video" : "audio";

      if (!ObjectId.isValid(threadId)) {
        return NextResponse.json({ error: "Conversation invalide." }, { status: 400 });
      }

      const thread = await threads.findOne({ _id: new ObjectId(threadId), participantIds: session.sub });
      if (!thread) {
        return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
      }

      const calleeId = thread.participantIds.find((id) => id !== session.sub) ?? "";
      if (!calleeId) {
        return NextResponse.json({ error: "Destinataire introuvable." }, { status: 400 });
      }

      const blocked = await blocks.findOne({
        $or: [
          { blockerId: session.sub, blockedId: calleeId },
          { blockerId: calleeId, blockedId: session.sub },
        ],
      });
      if (blocked) {
        return NextResponse.json({ error: "Appel impossible: utilisateur bloque." }, { status: 403 });
      }

      const now = new Date();
      const inserted = await calls.insertOne({
        threadId,
        callerId: session.sub,
        calleeId,
        mode,
        roomName: roomNameFromThreadId(threadId),
        status: "ringing",
        createdAt: now,
        updatedAt: now,
      });

      const created = await calls.findOne({ _id: inserted.insertedId });
      return NextResponse.json(
        {
          call: created ? buildCallPayload(created, thread, session.sub) : null,
        },
        { status: 201 },
      );
    }

    const callId = body.callId?.trim() ?? "";
    if (!ObjectId.isValid(callId)) {
      return NextResponse.json({ error: "Appel invalide." }, { status: 400 });
    }

    const call = await calls.findOne({ _id: new ObjectId(callId) });
    if (!call) {
      return NextResponse.json({ error: "Appel introuvable." }, { status: 404 });
    }

    if (call.callerId !== session.sub && call.calleeId !== session.sub) {
      return NextResponse.json({ error: "Interdit." }, { status: 403 });
    }

    const now = new Date();

    if (action === "accept") {
      if (call.calleeId !== session.sub || call.status !== "ringing") {
        return NextResponse.json({ error: "Acceptation impossible." }, { status: 400 });
      }

      await calls.updateOne(
        { _id: new ObjectId(callId), status: "ringing" },
        { $set: { status: "accepted", updatedAt: now } },
      );
    }

    if (action === "decline") {
      if (call.status !== "ringing") {
        return NextResponse.json({ error: "Refus impossible." }, { status: 400 });
      }

      await calls.updateOne(
        { _id: new ObjectId(callId), status: "ringing" },
        { $set: { status: "declined", updatedAt: now, endedAt: now } },
      );
    }

    if (action === "end") {
      if (call.status === "ringing" && call.callerId === session.sub) {
        await calls.updateOne(
          { _id: new ObjectId(callId), status: "ringing" },
          { $set: { status: "missed", updatedAt: now, endedAt: now } },
        );
      } else if (call.status === "ringing" && call.calleeId === session.sub) {
        await calls.updateOne(
          { _id: new ObjectId(callId), status: "ringing" },
          { $set: { status: "declined", updatedAt: now, endedAt: now } },
        );
      } else if (call.status === "accepted") {
        await calls.updateOne(
          { _id: new ObjectId(callId), status: "accepted" },
          { $set: { status: "ended", updatedAt: now, endedAt: now } },
        );
      }
    }

    const updated = await calls.findOne({ _id: new ObjectId(callId) });
    const thread = ObjectId.isValid(call.threadId)
      ? await threads.findOne({ _id: new ObjectId(call.threadId) })
      : null;

    return NextResponse.json(
      {
        call: updated ? buildCallPayload(updated, thread, session.sub) : null,
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la gestion d'appel.", detail },
      { status: 500 },
    );
  }
}
