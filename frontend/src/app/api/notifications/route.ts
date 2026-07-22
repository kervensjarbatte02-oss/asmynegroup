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

type UserDoc = {
  _id: ObjectId;
  name?: string;
  photoDataUrl?: string;
  email?: string;
};

type ReelDoc = {
  reelId: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  likedBy?: string[];
};

type ReelCommentDoc = {
  _id?: ObjectId;
  reelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
};

type NotificationItem = {
  id: string;
  kind: "follow" | "like" | "comment" | "activity";
  actorName: string;
  actorAvatar?: string;
  message: string;
  createdAt: string;
};

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

function safeIso(value: Date | string | undefined) {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const db = await getMongoDb();
    const follows = db.collection<FollowDoc>("user_follows");
    const users = db.collection<UserDoc>("users");
    const reels = db.collection<ReelDoc>("reels");
    const comments = db.collection<ReelCommentDoc>("reel_comments");

    const userId = session.sub;
    const ownerPrefix = `${userId}-`;
    const ownerRegex = new RegExp(`^${ownerPrefix.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`);

    const [followRows, commentRows, reelRows] = await Promise.all([
      follows.find({ followingId: userId }).sort({ createdAt: -1 }).limit(20).toArray(),
      comments.find({ reelId: { $regex: ownerRegex }, userId: { $ne: userId } }).sort({ createdAt: -1 }).limit(20).toArray(),
      reels.find({ reelId: { $regex: ownerRegex } }).limit(30).toArray(),
    ]);

    const actorIds = new Set<string>();
    for (const row of followRows) {
      actorIds.add(row.followerId);
    }
    for (const row of commentRows) {
      actorIds.add(row.userId);
    }
    for (const reel of reelRows) {
      for (const likedBy of reel.likedBy ?? []) {
        if (likedBy !== userId) {
          actorIds.add(likedBy);
        }
      }
    }

    const actorObjectIds = Array.from(actorIds).filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));

    const actorDocs = actorObjectIds.length > 0
      ? await users.find({ _id: { $in: actorObjectIds } }, { projection: { name: 1, photoDataUrl: 1, email: 1 } }).toArray()
      : [];

    const actorMap = new Map<string, { name: string; avatar?: string }>();
    for (const actor of actorDocs) {
      actorMap.set(actor._id.toString(), {
        name: actor.name?.trim() || actor.email?.trim() || "Utilisateur",
        avatar: actor.photoDataUrl,
      });
    }

    const notifications: NotificationItem[] = [];

    for (const row of followRows) {
      const actor = actorMap.get(row.followerId);
      notifications.push({
        id: `follow-${row._id?.toString() ?? row.followerId}`,
        kind: "follow",
        actorName: actor?.name || "Utilisateur",
        actorAvatar: actor?.avatar,
        message: "a commence a vous suivre",
        createdAt: safeIso(row.createdAt),
      });
    }

    for (const row of commentRows) {
      const actor = actorMap.get(row.userId);
      notifications.push({
        id: `comment-${row._id?.toString() ?? `${row.reelId}-${row.userId}`}`,
        kind: "comment",
        actorName: actor?.name || row.userName || "Utilisateur",
        actorAvatar: row.userAvatar || actor?.avatar,
        message: `a commente votre post: ${row.text.slice(0, 80)}`,
        createdAt: safeIso(row.createdAt),
      });
    }

    for (const reel of reelRows) {
      const likers = (reel.likedBy ?? []).filter((id) => id !== userId);
      if (likers.length > 0) {
        const actor = actorMap.get(likers[0]);
        notifications.push({
          id: `like-${reel.reelId}`,
          kind: "like",
          actorName: actor?.name || "Quelqu'un",
          actorAvatar: actor?.avatar,
          message:
            likers.length === 1
              ? "a aime votre post"
              : `et ${likers.length - 1} autre(s) ont aime votre post`,
          createdAt: new Date().toISOString(),
        });
      }

      const totalActivity = (reel.commentCount ?? 0) + (reel.shareCount ?? 0);
      if (totalActivity > 0) {
        notifications.push({
          id: `activity-${reel.reelId}`,
          kind: "activity",
          actorName: "Activite",
          message: `Votre post a ${reel.commentCount ?? 0} commentaire(s) et ${reel.shareCount ?? 0} partage(s)` ,
          createdAt: new Date().toISOString(),
        });
      }
    }

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ notifications: notifications.slice(0, 80) }, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant le chargement des notifications.", detail },
      { status: 500 },
    );
  }
}
