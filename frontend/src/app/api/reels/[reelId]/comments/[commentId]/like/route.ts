import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";

export const runtime = "nodejs";

type ReelCommentDoc = {
  _id: ObjectId;
  reelId: string;
  likeCount?: number;
  likedBy?: string[];
};

async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    return null;
  }

  const session = verifyAuthToken(token);
  return session?.sub ?? null;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ reelId: string; commentId: string }> },
) {
  try {
    const { reelId, commentId } = await params;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    if (!reelId || !commentId || !ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 400 });
    }

    const db = await getMongoDb();
    const comments = db.collection<ReelCommentDoc>("reel_comments");

    await comments.updateOne(
      { _id: new ObjectId(commentId), reelId, likedBy: { $ne: userId } },
      {
        $inc: { likeCount: 1 },
        $addToSet: { likedBy: userId },
      },
    );

    const updated = await comments.findOne({ _id: new ObjectId(commentId), reelId });

    return NextResponse.json(
      {
        commentId,
        likeCount: updated?.likeCount ?? 0,
        liked: true,
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant le like du commentaire.", detail },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ reelId: string; commentId: string }> },
) {
  try {
    const { reelId, commentId } = await params;
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    if (!reelId || !commentId || !ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Identifiants invalides." }, { status: 400 });
    }

    const db = await getMongoDb();
    const comments = db.collection<ReelCommentDoc>("reel_comments");

    await comments.updateOne(
      { _id: new ObjectId(commentId), reelId, likedBy: userId, likeCount: { $gt: 0 } },
      {
        $inc: { likeCount: -1 },
        $pull: { likedBy: userId },
      },
    );

    const updated = await comments.findOne({ _id: new ObjectId(commentId), reelId });

    return NextResponse.json(
      {
        commentId,
        likeCount: updated?.likeCount ?? 0,
        liked: (updated?.likedBy ?? []).includes(userId),
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant le unlike du commentaire.", detail },
      { status: 500 },
    );
  }
}
