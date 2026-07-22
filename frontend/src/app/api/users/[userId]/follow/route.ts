import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";

export const runtime = "nodejs";

type FollowDoc = {
  _id?: ObjectId;
  followerId: string;
  followingId: string;
  createdAt: Date;
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { userId } = await params;
    if (!userId || userId === sessionUserId) {
      return NextResponse.json({ following: false }, { status: 200 });
    }

    const db = await getMongoDb();
    const follows = db.collection<FollowDoc>("user_follows");

    const existing = await follows.findOne({ followerId: sessionUserId, followingId: userId });

    return NextResponse.json({ following: Boolean(existing) }, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Erreur serveur.", detail }, { status: 500 });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "userId manquant." }, { status: 400 });
    }

    if (userId === sessionUserId) {
      return NextResponse.json({ error: "Action invalide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const follows = db.collection<FollowDoc>("user_follows");

    await follows.createIndex({ followerId: 1, followingId: 1 }, { unique: true });
    await follows.createIndex({ followingId: 1, createdAt: -1 });

    await follows.updateOne(
      { followerId: sessionUserId, followingId: userId },
      {
        $setOnInsert: {
          followerId: sessionUserId,
          followingId: userId,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ following: true }, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Erreur serveur.", detail }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "userId manquant." }, { status: 400 });
    }

    if (userId === sessionUserId) {
      return NextResponse.json({ error: "Action invalide." }, { status: 400 });
    }

    const db = await getMongoDb();
    const follows = db.collection<FollowDoc>("user_follows");

    await follows.deleteOne({ followerId: sessionUserId, followingId: userId });

    return NextResponse.json({ following: false }, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Erreur serveur.", detail }, { status: 500 });
  }
}
