import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/jwt";

export const runtime = "nodejs";

type Session = {
  sub: string;
};

type UserDoc = {
  _id: ObjectId;
  name?: string;
  email?: string;
  photoDataUrl?: string;
  createdAt?: Date | string;
  lastActiveAt?: Date | string;
};

type FollowDoc = {
  _id?: ObjectId;
  followerId: string;
  followingId: string;
  createdAt: Date;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    return null;
  }

  const auth = verifyAuthToken(token);
  if (!auth) {
    return null;
  }

  return { sub: auth.sub };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().slice(0, 60);

    const db = await getMongoDb();
    const users = db.collection<UserDoc>("users");
    const follows = db.collection<FollowDoc>("user_follows");

    const selfFilter = ObjectId.isValid(session.sub) ? { _id: { $ne: new ObjectId(session.sub) } } : {};

    const regex = q ? new RegExp(escapeRegex(q), "i") : null;

    const filter = regex
      ? {
          ...selfFilter,
          $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }],
        }
      : selfFilter;

    const rows = await users
      .find(filter, { projection: { name: 1, email: 1, photoDataUrl: 1, createdAt: 1, lastActiveAt: 1 } })
      .sort({ lastActiveAt: -1, createdAt: -1 })
      .limit(q ? 40 : 20)
      .toArray();

    const profileIds = rows.map((row) => row._id.toString());
    const activeFollows = await follows
      .find({ followerId: session.sub, followingId: { $in: profileIds } }, { projection: { followingId: 1 } })
      .toArray();

    const followingSet = new Set(activeFollows.map((item) => item.followingId));

    return NextResponse.json(
      {
        profiles: rows.map((row) => {
          const name = row.name?.trim() || "Client";
          const email = row.email?.trim() || "email@inconnu.com";
          const id = row._id.toString();

          return {
            id,
            name,
            email,
            avatarUrl: row.photoDataUrl,
            avatarClassName: gradientFromName(name),
            isVerified: false,
            isFollowing: followingSet.has(id),
          };
        }),
      },
      { status: 200 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Erreur serveur pendant la recherche de profils.", detail },
      { status: 500 },
    );
  }
}
