import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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

const DEFAULT_LIKES = 1900;
const DEFAULT_COMMENTS = 82;
const DEFAULT_SHARES = 23;

async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    return null;
  }

  const session = verifyAuthToken(token);
  return session?.sub ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reelId: string }> },
) {
  try {
    const { reelId } = await params;
    const userId = await getSessionUserId();

    if (!reelId) {
      return NextResponse.json({ error: "reelId manquant." }, { status: 400 });
    }

    const db = await getMongoDb();
    const reels = db.collection<ReelDoc>("reels");

    const reel = await reels.findOne({ reelId });

    const likeCount = reel?.likeCount ?? DEFAULT_LIKES;
    const commentCount = reel?.commentCount ?? DEFAULT_COMMENTS;
    const shareCount = reel?.shareCount ?? DEFAULT_SHARES;
    const liked = userId ? (reel?.likedBy ?? []).includes(userId) : false;

    return NextResponse.json(
      { reelId, likeCount, commentCount, shareCount, liked },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la lecture des likes.", detail },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ reelId: string }> },
) {
  try {
    const { reelId } = await params;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    if (!reelId) {
      return NextResponse.json({ error: "reelId manquant." }, { status: 400 });
    }

    const db = await getMongoDb();
    const reels = db.collection<ReelDoc>("reels");

    await reels.createIndex({ reelId: 1 }, { unique: true });

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

    const updateResult = await reels.updateOne(
      { reelId, likedBy: { $ne: userId } },
      {
        $inc: { likeCount: 1 },
        $addToSet: { likedBy: userId },
      },
    );

    const reel = await reels.findOne({ reelId });
    const likeCount = reel?.likeCount ?? DEFAULT_LIKES;
    const commentCount = reel?.commentCount ?? DEFAULT_COMMENTS;
    const shareCount = reel?.shareCount ?? DEFAULT_SHARES;

    const alreadyLiked = updateResult.modifiedCount === 0 && updateResult.upsertedCount === 0;

    return NextResponse.json(
      {
        reelId,
        likeCount,
        commentCount,
        shareCount,
        liked: true,
        alreadyLiked,
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant l'ajout du like.", detail },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ reelId: string }> },
) {
  try {
    const { reelId } = await params;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    if (!reelId) {
      return NextResponse.json({ error: "reelId manquant." }, { status: 400 });
    }

    const db = await getMongoDb();
    const reels = db.collection<ReelDoc>("reels");

    await reels.updateOne(
      { reelId, likedBy: userId, likeCount: { $gt: 0 } },
      {
        $inc: { likeCount: -1 },
        $pull: { likedBy: userId },
      },
    );

    const reel = await reels.findOne({ reelId });
    const likeCount = reel?.likeCount ?? DEFAULT_LIKES;
    const commentCount = reel?.commentCount ?? DEFAULT_COMMENTS;
    const shareCount = reel?.shareCount ?? DEFAULT_SHARES;
    const liked = (reel?.likedBy ?? []).includes(userId);

    return NextResponse.json(
      { reelId, likeCount, commentCount, shareCount, liked },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant le retrait du like.", detail },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reelId: string }> },
) {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { reelId } = await params;

    if (!reelId) {
      return NextResponse.json({ error: "reelId manquant." }, { status: 400 });
    }

    const body = (await request.json()) as { kind?: "comment" | "share" };
    if (!body.kind || (body.kind !== "comment" && body.kind !== "share")) {
      return NextResponse.json({ error: "kind invalide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const reels = db.collection<ReelDoc>("reels");

    await reels.createIndex({ reelId: 1 }, { unique: true });

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
        $inc: body.kind === "comment" ? { commentCount: 1 } : { shareCount: 1 },
      },
    );

    const reel = await reels.findOne({ reelId });

    return NextResponse.json(
      {
        reelId,
        likeCount: reel?.likeCount ?? DEFAULT_LIKES,
        commentCount: reel?.commentCount ?? DEFAULT_COMMENTS,
        shareCount: reel?.shareCount ?? DEFAULT_SHARES,
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la mise a jour des interactions.", detail },
      { status: 500 },
    );
  }
}
