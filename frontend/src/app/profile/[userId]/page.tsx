import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ObjectId } from "mongodb";
import { FiArrowLeft, FiCalendar, FiSearch, FiUser } from "react-icons/fi";
import { verifyAuthToken } from "@/lib/jwt";
import { getMongoDb } from "@/lib/mongodb";
import ProfileFollowButton from "../ProfileFollowButton";
import ProfileSidebar from "../ProfileSidebar";
import ProfileEditButton from "../ProfileEditButton";

type ProfileTab = "posts" | "replies" | "highlights" | "articles" | "media" | "likes";

const PROFILE_TABS: Array<{ key: ProfileTab; label: string }> = [
  { key: "posts", label: "Posts" },
  { key: "replies", label: "Replies" },
  { key: "highlights", label: "Highlights" },
  { key: "articles", label: "Articles" },
  { key: "media", label: "Media" },
  { key: "likes", label: "Likes" },
];

type UserDoc = {
  _id: ObjectId;
  name?: string;
  email?: string;
  photoDataUrl?: string;
  coverImageUrl?: string;
  statusText?: string;
  searchLocation?: string;
  createdAt?: Date | string;
  lastActiveAt?: Date | string;
};

type FollowDoc = {
  _id?: ObjectId;
  followerId: string;
  followingId: string;
  createdAt: Date;
};

type ReelDoc = {
  reelId: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
};

type ProfilePost = {
  reelId: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  caption: string;
  createdLabel: string;
};

type Suggestion = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar?: string;
  followsYou: boolean;
  isFollowing: boolean;
};

const MEDIA_POOL = [
  {
    key: "video1",
    mediaType: "video" as const,
    mediaSrc: "/videos/video1.mp4",
    caption: "haitian today hatian for ever",
  },
  {
    key: "image-pool",
    mediaType: "image" as const,
    mediaSrc: "/destinations/pool.jpg",
    caption: "Kindness costs nothing and will not affect your personality, be humble.",
  },
  {
    key: "video2",
    mediaType: "video" as const,
    mediaSrc: "/videos/video2.mp4",
    caption: "Just me",
  },
  {
    key: "image-blog",
    mediaType: "image" as const,
    mediaSrc: "/images/blog-hero.jpeg",
    caption: "Building my lane and staying focused.",
  },
  {
    key: "video3",
    mediaType: "video" as const,
    mediaSrc: "/videos/video3.mp4",
    caption: "Keep moving forward.",
  },
  {
    key: "image-asmyne4",
    mediaType: "image" as const,
    mediaSrc: "/destinations/Asmyne4.png",
    caption: "A new chapter starts here.",
  },
  {
    key: "video4",
    mediaType: "video" as const,
    mediaSrc: "/videos/video4.mp4",
    caption: "Weekend replay mode on.",
  },
] as const;

function normalizeHandleInput(value: string) {
  return value.trim().toLowerCase().replace(/^@/, "");
}

function handleFromUser(name: string, email?: string) {
  const nameBase = name.trim().toLowerCase().replace(/\s+/g, "");
  if (nameBase) {
    return `@${nameBase}`;
  }

  if (email && email.includes("@")) {
    return `@${email.split("@")[0]?.toLowerCase() ?? "user"}`;
  }

  return "@user";
}

function handleMatchesParam(name: string, email: string | undefined, param: string) {
  const handle = handleFromUser(name, email).replace(/^@/, "");
  return handle === param;
}

function formatJoinDate(value: Date | string | undefined) {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "Joined recently";
  }

  return `Joined ${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`;
}

function formatPostDate(value: Date | string | undefined) {
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "now";
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "CL";
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

async function resolveViewer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("asmyne_auth")?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

async function findProfileUser(userIdParam: string) {
  const db = await getMongoDb();
  const users = db.collection<UserDoc>("users");

  const normalized = normalizeHandleInput(userIdParam);

  if (ObjectId.isValid(normalized)) {
    const byId = await users.findOne({ _id: new ObjectId(normalized) });
    if (byId) {
      return byId;
    }
  }

  const candidates = await users
    .find(
      {
        $or: [
          { name: { $regex: normalized, $options: "i" } },
          { email: { $regex: normalized, $options: "i" } },
        ],
      },
      { projection: { name: 1, email: 1, photoDataUrl: 1, coverImageUrl: 1, statusText: 1, searchLocation: 1, createdAt: 1, lastActiveAt: 1 } },
    )
    .limit(25)
    .toArray();

  const exact = candidates.find((item) => handleMatchesParam(item.name?.trim() || "", item.email, normalized));
  if (exact) {
    return exact;
  }

  return candidates[0] ?? null;
}

async function getProfilePosts(ownerId: string): Promise<ProfilePost[]> {
  if (!ObjectId.isValid(ownerId)) {
    const fallback = MEDIA_POOL[1];
    return [
      {
        reelId: `virtual-${ownerId}-${fallback.key}`,
        mediaType: fallback.mediaType,
        mediaSrc: fallback.mediaSrc,
        caption: fallback.caption,
        createdLabel: "Mar 23",
      },
    ];
  }

  const db = await getMongoDb();
  const reels = db.collection<ReelDoc>("reels");

  const prefix = `${ownerId}-`;
  const regex = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}`);

  const rows = await reels.find({ reelId: { $regex: regex } }).limit(30).toArray();

  if (rows.length === 0) {
    const fallback = MEDIA_POOL[1];
    return [
      {
        reelId: `${ownerId}-${fallback.key}`,
        mediaType: fallback.mediaType,
        mediaSrc: fallback.mediaSrc,
        caption: fallback.caption,
        createdLabel: "Mar 23",
      },
    ];
  }

  return rows.map((row, index) => {
    const key = row.reelId.replace(prefix, "");
    const media = MEDIA_POOL.find((item) => item.key === key) ?? MEDIA_POOL[index % MEDIA_POOL.length];

    return {
      reelId: row.reelId,
      mediaType: media.mediaType,
      mediaSrc: media.mediaSrc,
      caption: media.caption,
      createdLabel: "Mar 23",
    };
  });
}

async function getFollowMeta(profileUserId: string, viewerId: string | null) {
  if (!ObjectId.isValid(profileUserId)) {
    return {
      followingCount: 0,
      followersCount: 0,
      viewerFollowing: false,
    };
  }

  const db = await getMongoDb();
  const follows = db.collection<FollowDoc>("user_follows");

  const [followingCount, followersCount, viewerFollowingDoc] = await Promise.all([
    follows.countDocuments({ followerId: profileUserId }),
    follows.countDocuments({ followingId: profileUserId }),
    viewerId ? follows.findOne({ followerId: viewerId, followingId: profileUserId }) : Promise.resolve(null),
  ]);

  return {
    followingCount,
    followersCount,
    viewerFollowing: Boolean(viewerFollowingDoc),
  };
}

async function getSuggestions(profileUserId: string, viewerId: string | null): Promise<Suggestion[]> {
  const db = await getMongoDb();
  const users = db.collection<UserDoc>("users");
  const follows = db.collection<FollowDoc>("user_follows");

  const profileObjectId = ObjectId.isValid(profileUserId) ? new ObjectId(profileUserId) : null;
  const rows = await users
    .find(
      profileObjectId ? { _id: { $ne: profileObjectId } } : {},
      { projection: { name: 1, email: 1, photoDataUrl: 1, statusText: 1, searchLocation: 1 } },
    )
    .limit(12)
    .toArray();

  const targetIds = rows.map((item) => item._id.toString());

  const [viewerFollowingRows, followsYouRows] = await Promise.all([
    viewerId
      ? follows.find({ followerId: viewerId, followingId: { $in: targetIds } }, { projection: { followingId: 1 } }).toArray()
      : Promise.resolve([]),
    viewerId
      ? follows.find({ followerId: { $in: targetIds }, followingId: viewerId }, { projection: { followerId: 1 } }).toArray()
      : Promise.resolve([]),
  ]);

  const followingSet = new Set(viewerFollowingRows.map((item) => item.followingId));
  const followsYouSet = new Set(followsYouRows.map((item) => item.followerId));

  return rows.slice(0, 8).map((item) => {
    const name = item.name?.trim() || "Utilisateur";
    const handle = handleFromUser(name, item.email);

    return {
      id: item._id.toString(),
      name,
      handle,
      bio: item.statusText?.trim() || item.searchLocation?.trim() || "Building and growing every day",
      avatar: item.photoDataUrl,
      followsYou: followsYouSet.has(item._id.toString()),
      isFollowing: followingSet.has(item._id.toString()),
    };
  });
}

function normalizeTab(value: string | undefined): ProfileTab {
  const tab = (value ?? "posts").toLowerCase();
  if (tab === "posts" || tab === "replies" || tab === "highlights" || tab === "articles" || tab === "media" || tab === "likes") {
    return tab;
  }
  return "posts";
}

export default async function ProfileUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ tab?: string; more?: string }>;
}) {
  const { userId } = await params;
  const query = await searchParams;
  const viewer = await resolveViewer();

  if (!viewer) {
    redirect("/login");
  }

  const profileUser = await findProfileUser(userId);

  const normalizedFallbackHandle = normalizeHandleInput(userId) || "user";
  const fallbackName = normalizedFallbackHandle
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "Utilisateur";

  const profileUserId = profileUser?._id?.toString() ?? `virtual-${normalizedFallbackHandle}`;
  const profileName = profileUser?.name?.trim() || fallbackName;
  const profileEmail = profileUser?.email;
  const profileStatusText = profileUser?.statusText?.trim() || "Just me";
  const profileCreatedAt = profileUser?.createdAt;
  const avatar = profileUser?.photoDataUrl;
  const coverImage = profileUser?.coverImageUrl;
  const isOwnProfile = profileUserId === viewer.sub;

  const [posts, followMeta, suggestions] = await Promise.all([
    getProfilePosts(profileUserId),
    getFollowMeta(profileUserId, viewer.sub),
    getSuggestions(profileUserId, viewer.sub),
  ]);

  const activeTab = normalizeTab(query.tab);
  const showAllSuggestions = query.more === "1";
  const visibleSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 3);

  const profileHandle = handleFromUser(profileName, profileEmail);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#13081b] via-[#1a0f24] to-[#120816] text-[#f3e9f9]">
      <ProfileSidebar userInitials={initials(viewer.name || profileName)} />

      <div className="pl-16 md:pl-20">
        <div className="w-full border-x border-[#58326d]/45 bg-[#170a21]/80">
        <header className="sticky top-0 z-10 border-b border-[#58326d]/45 bg-[#14081d]/90 backdrop-blur">
          <div className="flex items-center justify-between px-2 py-2 sm:px-3">
            <Link href="/espace-client" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f3e9f9] hover:bg-[#34194a]" title="Retour">
              <FiArrowLeft size={18} />
            </Link>

            <div className="min-w-0 flex-1 px-2 sm:px-2.5">
              <p className="truncate text-lg font-bold leading-none text-[#fff8ff] sm:text-xl">{profileName}</p>
              <p className="text-xs text-[#bc9acb]">{posts.length} post{posts.length > 1 ? "s" : ""}</p>
            </div>

            <Link href="/espace-client" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f3e9f9] hover:bg-[#34194a]" title="Search">
              <FiSearch size={18} />
            </Link>
          </div>
        </header>

        <section>
          <div className="relative h-[175px] bg-gradient-to-r from-[#2b0f41] via-[#5e2f7a] to-[#9f74b9] sm:h-[220px]">
            <img
              src={coverImage || "/images/blog-hero.jpeg"}
              alt="cover"
              className="h-full w-full object-cover object-center opacity-100"
            />
          </div>

          <div className="relative px-2 pb-3 sm:px-3 sm:pb-4">
            <div className="absolute -top-[50px] left-3 h-[96px] w-[96px] overflow-hidden rounded-full border-4 border-[#1a0f24] bg-[#281635] sm:-top-[64px] sm:left-4 sm:h-[128px] sm:w-[128px]">
              {avatar ? (
                <img src={avatar} alt={profileName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[#ead5f4] sm:text-3xl">
                  {profileName.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 sm:pt-3">
              {isOwnProfile ? (
                <ProfileEditButton
                  profileUserId={profileUserId}
                  profileName={profileName}
                  profileStatusText={profileStatusText}
                  profileSearchLocation={profileUser?.searchLocation}
                  profilePhotoUrl={profileUser?.photoDataUrl}
                  profileCoverImageUrl={profileUser?.coverImageUrl}
                  isOwnProfile={isOwnProfile}
                />
              ) : (
                <ProfileFollowButton userId={profileUserId} initialFollowing={followMeta.viewerFollowing} className="rounded-full border border-[#7a4a96] px-3 py-1 text-xs font-semibold text-[#f7e8ff] transition hover:bg-[#34194a]" />
              )}
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold leading-none text-[#fff8ff] sm:text-[28px]">{profileName}</h1>
                <Link href="/services/dating" className="rounded-full border border-[#8c57ab] px-2 py-0.5 text-[10px] font-semibold text-[#f7e8ff] sm:text-[11px]">
                  Get verified
                </Link>
              </div>

              <p className="mt-1 text-xs text-[#bc9acb] sm:text-sm">{profileHandle}</p>
              <p className="mt-1.5 text-sm text-[#f8eefc] sm:text-base">{profileStatusText}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#bc9acb] sm:text-sm">
                <span className="inline-flex items-center gap-1"><FiUser size={14} /> Community</span>
                <span className="inline-flex items-center gap-1"><FiCalendar size={14} /> {formatJoinDate(profileCreatedAt)}</span>
              </div>

              <div className="mt-2 flex items-center gap-3 text-sm sm:text-sm">
                <p><span className="font-semibold text-[#fff8ff]">{followMeta.followingCount}</span> <span className="text-[#bc9acb]">Following</span></p>
                <p><span className="font-semibold text-[#fff8ff]">{followMeta.followersCount}</span> <span className="text-[#bc9acb]">Followers</span></p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-6 border-b border-[#58326d]/45 text-[10px] text-[#bc9acb] sm:text-xs">
            {PROFILE_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={`/profile/${encodeURIComponent(userId)}?tab=${tab.key}${showAllSuggestions ? "&more=1" : ""}`}
                  className={`relative px-1 py-1.5 text-center sm:px-1.5 sm:py-2 ${isActive ? "font-semibold text-[#fff8ff]" : ""}`}
                >
                  {tab.label}
                  {isActive ? <span className="absolute bottom-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-[#b87bda]" /> : null}
                </Link>
              );
            })}
          </div>

          <div>
            {(activeTab === "posts" || activeTab === "media") ? posts.map((post) => (
              <article key={post.reelId} className="border-b border-[#58326d]/45 px-2 py-2 sm:px-2.5">
                <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-2.5">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-[#2a1736] sm:h-9 sm:w-9">
                    {avatar ? (
                      <img src={avatar} alt={profileName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#d9e1f1]">{profileName.slice(0, 1).toUpperCase()}</div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs leading-none sm:text-sm"><span className="font-bold text-[#fff8ff]">{profileName}</span> <span className="text-[#bc9acb]">{profileHandle} · {post.createdLabel}</span></p>
                    <p className="mt-0.5 text-xs text-[#f8eefc] sm:text-sm">{post.caption}</p>

                    <div className="mt-1.5 overflow-hidden rounded-xl bg-[#241033] p-1 sm:p-1.5">
                      {post.mediaType === "video" ? (
                        <video src={post.mediaSrc} controls className="w-full rounded-xl" />
                      ) : (
                        <img src={post.mediaSrc} alt={post.caption} className="w-full rounded-xl object-cover" />
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <div className="px-3 py-6 text-center text-sm text-[#bc9acb]">
                {activeTab === "replies" ? "Aucune reponse pour le moment." : null}
                {activeTab === "highlights" ? "Aucun highlight pour le moment." : null}
                {activeTab === "articles" ? "Aucun article pour le moment." : null}
                {activeTab === "likes" ? "Aucun like pour le moment." : null}
              </div>
            )}
          </div>
        </section>

        <section className="px-2 py-3.5 sm:px-3 sm:py-4">
          <h2 className="text-lg font-extrabold text-[#fff8ff] sm:text-xl">Who to follow</h2>

          <div className="mt-2.5 space-y-2.5">
            {visibleSuggestions.map((item) => (
              <article key={item.id} className="rounded-xl bg-[#21102d] px-2 py-1.5">
                {item.followsYou ? <p className="ml-11 text-xs text-[#bc9acb]">follows you</p> : null}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 sm:gap-3">
                  <div className="h-9 w-9 overflow-hidden rounded-full bg-[#2a1736] sm:h-10 sm:w-10">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#ead5f4]">{item.name.slice(0, 1).toUpperCase()}</div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#fff8ff]">{item.name}</p>
                    <p className="truncate text-xs text-[#bc9acb]">{item.handle}</p>
                    <p className="truncate text-xs text-[#f8eefc] sm:text-sm">{item.bio}</p>
                  </div>

                  <ProfileFollowButton userId={item.id} initialFollowing={item.isFollowing} className="rounded-full border border-[#7a4a96] px-2.5 py-1 text-xs font-semibold text-[#f7e8ff] transition hover:bg-[#34194a]" />
                </div>
              </article>
            ))}
          </div>

          {suggestions.length > 3 ? (
            <Link
              href={`/profile/${encodeURIComponent(userId)}?tab=${activeTab}${showAllSuggestions ? "" : "&more=1"}`}
              className="mt-2.5 inline-block text-sm text-[#cf90ef]"
            >
              {showAllSuggestions ? "Show less" : "Show more"}
            </Link>
          ) : null}
        </section>
      </div>
      </div>
    </main>
  );
}
