import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import EspaceClientShell from "./EspaceClientShell";

type FeedPost = {
  reelId: string;
  userName: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  trackTitle: string;
  caption: string;
  userAvatar?: string;
};

type UserDoc = {
  _id: { toString: () => string };
  name?: string;
  photoDataUrl?: string;
  createdAt?: Date | string;
  lastActiveAt?: Date | string;
};

const MEDIA_POOL: Array<Omit<FeedPost, "reelId" | "userName" | "userAvatar"> & { key: string }> = [
  {
    key: "video1",
    mediaType: "video",
    mediaSrc: "/videos/video1.mp4",
    trackTitle: "YoungBoy Never Broke Again - Wine & Dine",
    caption: "Give me all your love",
  },
  {
    key: "image-pool",
    mediaType: "image",
    mediaSrc: "/destinations/pool.jpg",
    trackTitle: "Beach Session - Sunset Vibes",
    caption: "Miami days and ocean nights",
  },
  {
    key: "video2",
    mediaType: "video",
    mediaSrc: "/videos/video2.mp4",
    trackTitle: "Trap Mood - Midnight Ride",
    caption: "No stress, just energy",
  },
  {
    key: "image-blog",
    mediaType: "image",
    mediaSrc: "/images/blog-hero.jpeg",
    trackTitle: "Studio Stories - Episode 3",
    caption: "Who is ready for the next drop?",
  },
  {
    key: "video3",
    mediaType: "video",
    mediaSrc: "/videos/video3.mp4",
    trackTitle: "Nightwalk - Deep Bass",
    caption: "Tonight we fly higher",
  },
  {
    key: "image-asmyne4",
    mediaType: "image",
    mediaSrc: "/destinations/Asmyne4.png",
    trackTitle: "Realest 1 - WASSUP",
    caption: "Keep calm and stay iconic",
  },
  {
    key: "video4",
    mediaType: "video",
    mediaSrc: "/videos/video4.mp4",
    trackTitle: "No Signal - Club Mix",
    caption: "Weekend replay mode ON",
  },
];

function buildFallbackFeed(sessionName: string): FeedPost[] {
  return MEDIA_POOL.map((media, index) => ({
    reelId: `fallback-${media.key}-${index}`,
    userName: index === 0 ? sessionName : `Membre ${index + 1}`,
    mediaType: media.mediaType,
    mediaSrc: media.mediaSrc,
    trackTitle: media.trackTitle,
    caption: media.caption,
  }));
}

async function buildFeedPostsFromUsers(sessionName: string, sessionUserId: string): Promise<FeedPost[]> {
  try {
    const db = await getMongoDb();
    const users = db.collection<UserDoc>("users");

    const rows = await users
      .find({}, { projection: { name: 1, photoDataUrl: 1, createdAt: 1, lastActiveAt: 1 } })
      .sort({ lastActiveAt: -1, createdAt: -1 })
      .limit(24)
      .toArray();

    if (rows.length === 0) {
      return buildFallbackFeed(sessionName);
    }

    const orderedUsers = [...rows];
    const sessionIndex = orderedUsers.findIndex((item) => String((item as { _id?: unknown })._id ?? "") === sessionUserId);

    if (sessionIndex > 0) {
      const [self] = orderedUsers.splice(sessionIndex, 1);
      if (self) {
        orderedUsers.unshift(self);
      }
    }

    const sourceUsers = orderedUsers.slice(0, Math.max(orderedUsers.length, 7));

    const feed = sourceUsers.map((item, index) => {
      const media = MEDIA_POOL[index % MEDIA_POOL.length];
      const userId = String((item as { _id?: unknown })._id ?? "");
      const userName = item.name?.trim() || (userId === sessionUserId ? sessionName : "Utilisateur");

      return {
        reelId: `${userId}-${media.key}`,
        userName,
        mediaType: media.mediaType,
        mediaSrc: media.mediaSrc,
        trackTitle: media.trackTitle,
        caption: media.caption,
        userAvatar: item.photoDataUrl,
      } as FeedPost;
    });

    return feed.length > 0 ? feed : buildFallbackFeed(sessionName);
  } catch {
    return buildFallbackFeed(sessionName);
  }
}

export default async function EspaceClientPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    redirect("/connexion");
  }

  const session = verifyAuthToken(token);

  if (!session) {
    redirect("/connexion");
  }

  const feedPosts = await buildFeedPostsFromUsers(session.name, session.sub);

  return <EspaceClientShell userName={session.name} feedPosts={feedPosts} />;
}
