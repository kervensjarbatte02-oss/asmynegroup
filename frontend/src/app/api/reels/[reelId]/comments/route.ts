import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";

export const runtime = "nodejs";

type ReelDoc = {
  reelId: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  likedBy: string[];
};

type ReelCommentDoc = {
  _id?: ObjectId;
  reelId: string;
  parentCommentId?: string | null;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
  likeCount?: number;
  likedBy?: string[];
};

type UserDoc = {
  _id: ObjectId;
  photoDataUrl?: string;
};

const DEFAULT_LIKES = 1900;
const DEFAULT_COMMENTS = 82;
const DEFAULT_SHARES = 23;

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    return null;
  }

  const session = verifyAuthToken(token);
  return session;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reelId: string }> },
) {
  try {
    const { reelId } = await params;
    const session = await getSession();
    const sessionUserId = session?.sub ?? null;

    if (!reelId) {
      return NextResponse.json({ error: "reelId manquant." }, { status: 400 });
    }

    const db = await getMongoDb();
    const comments = db.collection<ReelCommentDoc>("reel_comments");

    const list = await comments
      .find({ reelId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(
      {
        reelId,
        comments: list.map((item) => ({
          id: item._id?.toString() ?? "",
          parentCommentId: item.parentCommentId ?? null,
          userName: item.userName,
          userAvatar: item.userAvatar ?? "",
          text: item.text,
          createdAt: item.createdAt,
          likeCount: item.likeCount ?? 0,
          liked: sessionUserId ? (item.likedBy ?? []).includes(sessionUserId) : false,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la lecture des commentaires.", detail },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reelId: string }> },
) {
  try {
    const { reelId } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    if (!reelId) {
      return NextResponse.json({ error: "reelId manquant." }, { status: 400 });
    }

    const body = (await request.json()) as { text?: string; parentCommentId?: string | null };
    const text = body.text?.trim() ?? "";
    const parentCommentId = body.parentCommentId?.trim() ?? "";

    if (!text) {
      return NextResponse.json({ error: "Commentaire vide." }, { status: 400 });
    }

    if (text.length > 500) {
      return NextResponse.json({ error: "Commentaire trop long." }, { status: 400 });
    }

    if (parentCommentId && !ObjectId.isValid(parentCommentId)) {
      return NextResponse.json({ error: "parentCommentId invalide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const comments = db.collection<ReelCommentDoc>("reel_comments");
    const reels = db.collection<ReelDoc>("reels");
    const users = db.collection<UserDoc>("users");

    if (parentCommentId) {
      const parent = await comments.findOne({ _id: new ObjectId(parentCommentId), reelId });
      if (!parent) {
        return NextResponse.json({ error: "Commentaire parent introuvable." }, { status: 404 });
      }
    }

    await reels.createIndex({ reelId: 1 }, { unique: true });

    const now = new Date();
    const userObjectId = ObjectId.isValid(session.sub) ? new ObjectId(session.sub) : null;
    const user = userObjectId ? await users.findOne({ _id: userObjectId }) : null;
    const userAvatar = user?.photoDataUrl ?? "";

    const insertResult = await comments.insertOne({
      reelId,
      parentCommentId: parentCommentId || null,
      userId: session.sub,
      userName: session.name,
      userAvatar,
      text,
      createdAt: now,
      likeCount: 0,
      likedBy: [],
    });

    await reels.updateOne(
      { reelId },
      {
        $setOnInsert: {
          reelId,
          likeCount: DEFAULT_LIKES,
          commentCount: DEFAULT_COMMENTS,
          shareCount: DEFAULT_SHARES,
          likedBy: [],
        },
      },
      { upsert: true },
    );

    await reels.updateOne(
      { reelId },
      {
        $inc: { commentCount: 1 },
      },
    );

    const reel = await reels.findOne({ reelId });

    return NextResponse.json(
      {
        reelId,
        comment: {
          id: insertResult.insertedId.toString(),
          parentCommentId: parentCommentId || null,
          userName: session.name,
          userAvatar,
          text,
          createdAt: now,
          likeCount: 0,
          liked: false,
        },
        commentCount: reel?.commentCount ?? DEFAULT_COMMENTS,
      },
      { status: 201 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant l'ajout du commentaire.", detail },
      { status: 500 },
    );
  }
}
