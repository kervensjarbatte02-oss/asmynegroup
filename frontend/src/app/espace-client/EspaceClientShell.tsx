
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  FiAtSign,
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiEdit2,
  FiGlobe,
  FiInfo,
  FiImage,
  FiMessageCircle,
  FiMic,
  FiMoreHorizontal,
  FiPause,
  FiPaperclip,
  FiPlay,
  FiPhone,
  FiPhoneOff,
  FiPlus,
  FiSearch,
  FiSend,
  FiSettings,
  FiSmile,
  FiTrash2,
  FiUsers,
  FiVideo,
  FiX,
} from "react-icons/fi";
import EspaceClientSidebar, { type EspaceClientView } from "./EspaceClientSidebar";
import InteractiveReelCard from "./InteractiveReelCard";
import StatusNavbar from "./StatusNavbar";

type FeedPost = {
  reelId: string;
  userName: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  trackTitle: string;
  caption: string;
  userAvatar?: string;
};

type EspaceClientShellProps = {
  userName: string;
  feedPosts: FeedPost[];
};

type ViewContent = {
  title: string;
  subtitle: string;
};

type SearchProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarClassName: string;
  isVerified?: boolean;
  isFollowing?: boolean;
};

type GeneralNotification = {
  id: string;
  kind: "follow" | "like" | "comment" | "activity";
  actorName: string;
  actorAvatar?: string;
  message: string;
  createdAt: string;
};

type MessageThread = {
  id: string;
  name: string;
  handle: string;
  joinedAt: string;
  preview: string;
  time: string;
  avatarClassName: string;
  isVerified?: boolean;
};

type ChatMessage = {
  id: string;
  text: string;
  attachment?: MessageAttachment | null;
  time: string;
  sender: "me" | "them";
  senderName?: string;
  createdAt?: string;
  replyTo?: {
    messageId: string;
    text: string;
    senderName: string;
  } | null;
};

type MessageAttachment = {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  kind: "image" | "video" | "audio" | "file";
  durationSec?: number;
};

type ForwardTarget = {
  id: string;
  name: string;
  handle: string;
  avatarClassName: string;
  isVerified?: boolean;
};

type CallSignal = {
  id: string;
  threadId: string;
  mode: "audio" | "video";
  status: "ringing" | "accepted" | "declined" | "ended" | "missed";
  roomName: string;
  callerId: string;
  calleeId: string;
  callerName: string;
  calleeName: string;
  callerAvatarClassName: string;
  calleeAvatarClassName: string;
  isIncoming: boolean;
  createdAt: string;
  updatedAt: string;
};

const REPORT_REASONS = [
  "C'est du spam",
  "Contenu trompeur",
  "Harcèlement ou abus",
  "Contenu inapproprié",
] as const;

const viewContent: Record<Exclude<EspaceClientView, "home">, ViewContent> = {
  messages: {
    title: "Messages",
    subtitle: "Discute ici sans quitter la page, comme un onglet Instagram.",
  },
  search: {
    title: "Recherche",
    subtitle: "Trouve des profils, hashtags et publications dans cet espace.",
  },
  notifications: {
    title: "Notifications",
    subtitle: "Retrouve tes activites recentes en temps reel.",
  },
  create: {
    title: "Creer",
    subtitle: "Prepare et publie du contenu depuis cette vue interne.",
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Suis les performances de ton compte et de tes posts.",
  },
  profile: {
    title: "Mon compte",
    subtitle: "Consulte ton profil et tes informations personnelles.",
  },
  settings: {
    title: "Parametres",
    subtitle: "Ajuste tes preferences sans changer de page.",
  },
};

function InternalViewPanel({ title, subtitle }: ViewContent) {
  return (
    <section className="mx-auto mt-6 h-[calc(100vh-112px)] w-full max-w-6xl overflow-y-auto pb-10 pr-1">
      <div className="rounded-3xl border border-[#5f3273] bg-[#2a1234]/80 p-6 text-white shadow-[0_18px_45px_rgba(18,4,29,0.45)] sm:p-8">
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-[#f2d7ff] sm:text-base">{subtitle}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[#6f3e84] bg-[#341445]/70 p-4">
            <h3 className="text-base font-semibold">Vue interne active</h3>
            <p className="mt-1 text-sm text-[#f2d7ff]">
              Cette section s&apos;affiche dans la meme page, sans ouvrir une autre route.
            </p>
          </article>
          <article className="rounded-2xl border border-[#6f3e84] bg-[#341445]/70 p-4">
            <h3 className="text-base font-semibold">Comportement style Instagram</h3>
            <p className="mt-1 text-sm text-[#f2d7ff]">
              Le sidebar change simplement la vue locale de l&apos;interface.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function SearchProfilesPanel({ feedPosts, onOpenReelFeed }: { feedPosts: FeedPost[]; onOpenReelFeed: (reelId?: string) => void }) {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState<"for-you" | "trending" | "news" | "sports" | "entertainment">("for-you");
  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingFollowIds, setUpdatingFollowIds] = useState<string[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const delay = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchValue)}`, {
          cache: "no-store",
          signal: abortController.signal,
        });

        const data = (await response.json()) as { error?: string; profiles?: SearchProfile[] };

        if (!response.ok) {
          throw new Error(data.error ?? "Impossible de charger les profils.");
        }

        setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === "AbortError") {
          return;
        }

        const detail = requestError instanceof Error ? requestError.message : "Erreur inconnue";
        setError(detail);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      abortController.abort();
      window.clearTimeout(delay);
    };
  }, [searchValue]);

  const visibleProfiles = useMemo(() => {
    if (activeTab !== "for-you") {
      return [];
    }

    return profiles;
  }, [activeTab, profiles]);

  const hasQuery = searchValue.trim().length > 0;
  const reelResults = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return feedPosts.slice(0, 4);
    }

    return feedPosts.filter((post) => {
      return (
        post.userName.toLowerCase().includes(query) ||
        post.trackTitle.toLowerCase().includes(query) ||
        post.caption.toLowerCase().includes(query)
      );
    });
  }, [feedPosts, searchValue]);

  async function toggleFollow(profile: SearchProfile) {
    if (updatingFollowIds.includes(profile.id)) {
      return;
    }

    setUpdatingFollowIds((current) => [...current, profile.id]);

    try {
      const method = profile.isFollowing ? "DELETE" : "POST";
      const response = await fetch(`/api/users/${encodeURIComponent(profile.id)}/follow`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as { error?: string; following?: boolean };
      if (!response.ok) {
        throw new Error(data.error ?? "Operation impossible.");
      }

      setProfiles((current) =>
        current.map((item) =>
          item.id === profile.id
            ? {
                ...item,
                isFollowing: Boolean(data.following),
              }
            : item,
        ),
      );
    } catch (requestError) {
      const detail = requestError instanceof Error ? requestError.message : "Erreur inconnue";
      setError(detail);
    } finally {
      setUpdatingFollowIds((current) => current.filter((id) => id !== profile.id));
    }
  }

  return (
    <section className="mx-auto mt-2 h-[calc(100vh-88px)] w-full max-w-6xl overflow-y-auto pb-6 pr-1 text-white">
      <div>
        <div className="border-b border-[#6f3e84]/70 px-4 py-3 sm:px-5 sm:py-4">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#c39ed8]" size={17} />
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search"
              className="h-11 w-full rounded-full border border-[#6a3f7d] bg-gradient-to-r from-[#2d1438]/85 to-[#3a1c49]/75 pl-10 pr-12 text-sm text-[#f2e1ff] outline-none placeholder:text-[#d5b2e7] focus:border-[#9968b2]"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#f0d4ff] transition hover:bg-[#4a245f]/50"
              title="Parametres de recherche"
            >
              <FiSettings size={16} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4 overflow-x-auto border-b border-[#6f3e84]/70 pb-0.5 text-base font-semibold text-[#bea0cf]">
            <button
              type="button"
              onClick={() => setActiveTab("for-you")}
              className={`relative pb-2 transition ${activeTab === "for-you" ? "text-[#fff4ff]" : "hover:text-[#e9cefb]"}`}
            >
              For You
              {activeTab === "for-you" ? <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#d48df8]" /> : null}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trending")}
              className={`pb-2 transition ${activeTab === "trending" ? "text-[#fff4ff]" : "hover:text-[#e9cefb]"}`}
            >
              Trending
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("news")}
              className={`pb-2 transition ${activeTab === "news" ? "text-[#fff4ff]" : "hover:text-[#e9cefb]"}`}
            >
              News
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sports")}
              className={`pb-2 transition ${activeTab === "sports" ? "text-[#fff4ff]" : "hover:text-[#e9cefb]"}`}
            >
              Sports
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("entertainment")}
              className={`pb-2 transition ${activeTab === "entertainment" ? "text-[#fff4ff]" : "hover:text-[#e9cefb]"}`}
            >
              Entertainment
            </button>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          {activeTab !== "for-you" ? (
            <p className="text-sm text-[#d5b2e7]">Cette categorie sera disponible prochainement.</p>
          ) : null}

          {activeTab === "for-you" ? <h3 className="text-xl font-semibold leading-none text-[#fff4ff]">Who to follow</h3> : null}

          {error ? <p className="mt-3 text-sm text-[#ff9db2]">{error}</p> : null}
          {loading ? <p className="mt-3 text-sm text-[#d5b2e7]">Chargement des profils...</p> : null}

          {!loading && activeTab === "for-you" && visibleProfiles.length === 0 ? (
            <p className="mt-3 text-sm text-[#d5b2e7]">
              {hasQuery ? "Aucun profil trouve pour cette recherche." : "Aucun profil a proposer pour le moment."}
            </p>
          ) : null}

          <div className="mt-2 space-y-2">
            {activeTab === "for-you"
              ? visibleProfiles.map((profile) => {
                  const isFollowed = Boolean(profile.isFollowing);
                  const isUpdating = updatingFollowIds.includes(profile.id);

                  return (
                    <article key={profile.id} className="rounded-xl px-1 py-1 transition hover:bg-[#2d1438]/35">
                      <div className="mt-1 grid grid-cols-[auto_1fr_auto] items-center gap-2">
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <AvatarBadge name={profile.name} className={profile.avatarClassName} size="h-9 w-9" />
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1 text-lg font-semibold leading-none text-white">
                            <span className="truncate">{profile.name}</span>
                            {profile.isVerified ? <span className="text-xs text-[#3bc3ff]">●</span> : null}
                          </div>
                          <p className="truncate text-sm leading-none text-[#d5bee4]">{profile.email}</p>
                        </div>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => void toggleFollow(profile)}
                          className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                            isFollowed
                              ? "border border-[#8c5ca3] bg-transparent text-[#f2e1ff] hover:bg-[#341445]/60"
                              : "bg-white text-[#1d0930] hover:bg-[#efe8f7]"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {isUpdating ? "..." : isFollowed ? "Following" : "Follow"}
                        </button>
                      </div>
                    </article>
                  );
                })
              : null}
          </div>

          <div className="mt-6 border-t border-[#6f3e84]/60 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-[#fff4ff]">Reels</h4>
              <button
                type="button"
                onClick={() => onOpenReelFeed()}
                className="rounded-full border border-[#8c5ca3] px-3 py-1 text-xs font-semibold text-[#f2e1ff] transition hover:bg-[#341445]/60"
              >
                Ouvrir le feed
              </button>
            </div>

            {reelResults.length === 0 ? (
              <p className="mt-2 text-sm text-[#d5b2e7]">Aucun reel trouve pour cette recherche.</p>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {reelResults.slice(0, 8).map((reel) => (
                  <article key={reel.reelId} className="overflow-hidden rounded-xl border border-[#6f3e84]/50 bg-[#200f2b]/70 p-2">
                    <div className="overflow-hidden rounded-lg bg-black/35">
                      {reel.mediaType === "image" ? (
                        <img src={reel.mediaSrc} alt={reel.caption} className="h-36 w-full object-cover" />
                      ) : (
                        <video src={reel.mediaSrc} className="h-36 w-full object-cover" muted playsInline />
                      )}
                    </div>

                    <div className="mt-2 min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{reel.userName}</p>
                      <p className="truncate text-xs text-[#d5bee4]">{reel.trackTitle}</p>
                      <p className="truncate text-xs text-[#f6edff]">{reel.caption}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenReelFeed(reel.reelId)}
                      className="mt-2 w-full rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1d0930] transition hover:bg-[#efe8f7]"
                    >
                      Voir ce reel
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          {activeTab === "for-you" && visibleProfiles.length > 0 ? (
            <button type="button" className="mt-3 text-base text-[#c99ce3] transition hover:text-[#f2d7ff]">
              Show more
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function NotificationsPanel() {
  const [activeTab, setActiveTab] = useState<"all" | "mentions">("all");
  const [notifications, setNotifications] = useState<GeneralNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/notifications", { cache: "no-store" });
        const data = (await response.json()) as { error?: string; notifications?: GeneralNotification[] };

        if (!response.ok) {
          throw new Error(data.error ?? "Impossible de charger les notifications.");
        }

        if (!mounted) {
          return;
        }

        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } catch (requestError) {
        if (!mounted) {
          return;
        }

        const detail = requestError instanceof Error ? requestError.message : "Erreur inconnue";
        setError(detail);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleNotifications = useMemo(() => {
    if (activeTab === "mentions") {
      return notifications.filter((item) => item.kind === "comment");
    }

    return notifications;
  }, [activeTab, notifications]);

  function kindLabel(kind: GeneralNotification["kind"]) {
    if (kind === "follow") {
      return "Follow";
    }

    if (kind === "like") {
      return "Like";
    }

    if (kind === "comment") {
      return "Comment";
    }

    return "Activity";
  }

  function timeLabel(value: string) {
    const timestamp = new Date(value).getTime();
    if (Number.isNaN(timestamp)) {
      return "Maintenant";
    }

    const diffSec = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
    if (diffSec < 60) {
      return `${diffSec}s`;
    }

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin}m`;
    }

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      return `${diffHours}h`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}j`;
  }

  return (
    <section className="mx-auto mt-2 h-[calc(100vh-88px)] w-full max-w-6xl overflow-y-auto pb-6 pr-1 text-white">
      <div className="border-b border-[#6f3e84]/70 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#fff4ff]">Notifications</h2>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f0d4ff] transition hover:bg-[#4a245f]/50"
            title="Parametres"
          >
            <FiSettings size={16} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-6 border-b border-[#6f3e84]/70 pb-0.5 text-base font-semibold text-[#bea0cf]">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`relative pb-2 transition ${activeTab === "all" ? "text-[#fff4ff]" : "hover:text-[#e9cefb]"}`}
          >
            All
            {activeTab === "all" ? <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#d48df8]" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mentions")}
            className={`relative pb-2 transition ${activeTab === "mentions" ? "text-[#fff4ff]" : "hover:text-[#e9cefb]"}`}
          >
            Mentions
            {activeTab === "mentions" ? <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#d48df8]" /> : null}
          </button>
        </div>
      </div>

      <div className="px-4 py-2 sm:px-5">
        {error ? <p className="py-3 text-sm text-[#ff9db2]">{error}</p> : null}
        {loading ? <p className="py-3 text-sm text-[#d5b2e7]">Chargement des notifications...</p> : null}

        {!loading && visibleNotifications.length === 0 ? (
          <p className="py-3 text-sm text-[#d5b2e7]">Aucune notification pour le moment.</p>
        ) : null}

        <div>
          {visibleNotifications.map((item) => (
            <article key={item.id} className="grid grid-cols-[auto_1fr] items-start gap-3 border-b border-[#6f3e84]/45 py-3">
              {item.actorAvatar ? (
                <img src={item.actorAvatar} alt={item.actorName} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <AvatarBadge name={item.actorName} className="from-[#5d3b74] to-[#be8de0]" size="h-10 w-10" />
              )}

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#c79ee0]">{kindLabel(item.kind)}</p>
                <p className="mt-0.5 text-base leading-tight text-[#fff4ff]">
                  <span className="font-semibold">{item.actorName}</span> {item.message}
                  <span className="text-[#d2b9e2]"> · {timeLabel(item.createdAt)}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CreatePostPanel({ userName, onClose }: { userName: string; onClose: () => void }) {
  type CreateMediaItem = {
    id: string;
    type: "image" | "video";
    url: string;
    fileName: string;
  };

  type ReplyAudience = "everyone" | "following" | "mentions" | "verified";

  const [postText, setPostText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [mediaItems, setMediaItems] = useState<CreateMediaItem[]>([]);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const [mediaOverlayText, setMediaOverlayText] = useState("");
  const [replyAudience, setReplyAudience] = useState<ReplyAudience>("everyone");
  const [replyMenuOpen, setReplyMenuOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const replyMenuRef = useRef<HTMLDivElement | null>(null);
  const emojiMenuRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const canPost = postText.trim().length > 0 || mediaItems.length > 0;

  useEffect(() => {
    return () => {
      mediaItems.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, [mediaItems]);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (replyMenuRef.current && !replyMenuRef.current.contains(event.target as Node)) {
        setReplyMenuOpen(false);
      }

      if (emojiMenuRef.current && !emojiMenuRef.current.contains(event.target as Node)) {
        setEmojiPickerOpen(false);
      }
    }

    if (replyMenuOpen || emojiPickerOpen) {
      document.addEventListener("mousedown", onDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [replyMenuOpen, emojiPickerOpen]);

  const activeMedia = useMemo(() => {
    if (mediaItems.length === 0) {
      return null;
    }

    if (!activeMediaId) {
      return mediaItems[0] ?? null;
    }

    return mediaItems.find((item) => item.id === activeMediaId) ?? mediaItems[0] ?? null;
  }, [activeMediaId, mediaItems]);

  const audienceLabel = useMemo(() => {
    if (replyAudience === "everyone") {
      return "Everyone";
    }

    if (replyAudience === "following") {
      return "Accounts you follow";
    }

    if (replyAudience === "mentions") {
      return "Only accounts you mention";
    }

    return "Verified accounts";
  }, [replyAudience]);

  function openMediaPicker() {
    mediaInputRef.current?.click();
  }

  function handleEmojiInsert(emoji: string) {
    const element = composerRef.current;
    if (!element) {
      setPostText((current) => `${current}${emoji}`);
      setEmojiPickerOpen(false);
      return;
    }

    const start = element.selectionStart ?? postText.length;
    const end = element.selectionEnd ?? postText.length;
    const next = `${postText.slice(0, start)}${emoji}${postText.slice(end)}`;

    setPostText(next);
    setEmojiPickerOpen(false);

    requestAnimationFrame(() => {
      element.focus();
      const position = start + emoji.length;
      element.setSelectionRange(position, position);
    });
  }

  function handleMediaSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) {
      return;
    }

    setMediaItems((current) => {
      const allowed = selectedFiles
        .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
        .slice(0, Math.max(0, 4 - current.length))
        .map((file) => {
          const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const type = file.type.startsWith("video/") ? "video" : "image";
          const url = URL.createObjectURL(file);

          return {
            id,
            type,
            url,
            fileName: file.name,
          } as CreateMediaItem;
        });

      const next = [...current, ...allowed];
      if (!activeMediaId && next.length > 0) {
        setActiveMediaId(next[0].id);
      }

      return next;
    });

    event.target.value = "";
  }

  function handleRemoveMedia(id: string) {
    setMediaItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }

      const next = current.filter((item) => item.id !== id);
      if (activeMediaId === id) {
        setActiveMediaId(next[0]?.id ?? null);
      }

      return next;
    });
  }

  function handleSaveDraft() {
    setFeedback("Brouillon enregistre.");
  }

  function handlePost() {
    if (!canPost) {
      return;
    }

    setFeedback("Publication envoyee.");
    setPostText("");
    setMediaOverlayText("");
    mediaItems.forEach((item) => URL.revokeObjectURL(item.url));
    setMediaItems([]);
    setActiveMediaId(null);
  }

  return (
    <section
      className="fixed inset-0 z-50 flex items-start justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(120,48,154,0.24),transparent_45%),rgba(6,3,10,0.72)] pt-6 sm:pl-24"
      onClick={onClose}
    >
      <div
        className="mx-4 flex max-h-[calc(100vh-48px)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#6f3e84] bg-gradient-to-b from-[#22112d]/95 via-[#180d23]/95 to-[#120918]/95 text-white shadow-[0_24px_70px_rgba(10,3,16,0.62)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#f2e6ff] transition hover:bg-[#4a245f]/45"
            title="Fermer"
          >
            <FiX size={20} />
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-full px-3 py-1 text-xs font-semibold text-[#d8a8f2] transition hover:bg-[#4a245f]/45"
          >
            Drafts
          </button>
        </div>

        <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-1">
          <div className="grid grid-cols-[auto_1fr] items-start gap-3">
            <AvatarBadge name={userName} className="from-[#5d3b74] to-[#be8de0]" size="h-12 w-12" />
            <div>
              <textarea
                ref={composerRef}
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder="What's happening?"
                className="min-h-[120px] w-full resize-none bg-transparent text-2xl leading-tight text-[#f7ecff] outline-none placeholder:text-[#9f8cab]"
              />
            </div>
          </div>

          {activeMedia ? (
            <div className="mt-3 rounded-2xl border border-[#6f3e84]/60 bg-[#120918]/70 p-2">
              <div className="relative overflow-hidden rounded-xl bg-black/35">
                {activeMedia.type === "video" ? (
                  <video src={activeMedia.url} controls className="max-h-[340px] w-full rounded-xl object-contain" />
                ) : (
                  <img src={activeMedia.url} alt={activeMedia.fileName} className="max-h-[340px] w-full rounded-xl object-contain" />
                )}

                <button
                  type="button"
                  className="absolute left-2 top-2 rounded-lg bg-black/60 px-3 py-1 text-sm font-semibold text-white transition hover:bg-black/80"
                  title="Editer le media"
                >
                  Edit
                </button>

                {mediaOverlayText.trim() ? (
                  <p className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/70 px-2 py-1 text-sm font-semibold text-white">
                    {mediaOverlayText}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={() => handleRemoveMedia(activeMedia.id)}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                  title="Retirer ce media"
                >
                  <FiX size={14} />
                </button>
              </div>

              <input
                type="text"
                value={mediaOverlayText}
                onChange={(event) => setMediaOverlayText(event.target.value)}
                placeholder="Ajouter du texte sur le media"
                className="mt-2 h-9 w-full rounded-lg border border-[#6f3e84]/60 bg-[#1b1026]/80 px-3 text-sm text-[#f7ecff] outline-none placeholder:text-[#9f8cab] focus:border-[#b27fce]"
              />

              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {mediaItems.map((item) => {
                  const active = item.id === activeMedia.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveMediaId(item.id)}
                      className={`relative overflow-hidden rounded-lg border ${active ? "border-[#d8a8f2]" : "border-[#6f3e84]/50"}`}
                    >
                      {item.type === "video" ? (
                        <video src={item.url} className="h-14 w-14 object-cover" muted />
                      ) : (
                        <img src={item.url} alt={item.fileName} className="h-14 w-14 object-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {feedback ? <p className="mt-2 text-xs text-[#d8a8f2]">{feedback}</p> : null}
        </div>

        <div className="shrink-0 border-t border-[#6f3e84]/50 px-4 py-3">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#b7a7c2]">
            <div ref={replyMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setReplyMenuOpen((current) => !current)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-[#d8a8f2] transition hover:bg-[#4a245f]/45"
                title="Who can reply"
              >
                <FiGlobe size={15} />
                <span>Who can reply</span>
              </button>

              {replyMenuOpen ? (
                <div className="absolute bottom-[calc(100%+10px)] left-0 z-20 w-[260px] rounded-2xl border border-[#6f3e84] bg-[#120918]/95 p-2 shadow-[0_16px_38px_rgba(7,2,11,0.65)]">
                  <p className="px-2 py-1 text-sm font-semibold text-[#f7ecff]">Who can reply?</p>

                  {[
                    { key: "everyone", label: "Everyone", icon: <FiGlobe size={16} /> },
                    { key: "following", label: "Accounts you follow", icon: <FiUsers size={16} /> },
                    { key: "mentions", label: "Only accounts you mention", icon: <FiAtSign size={16} /> },
                    { key: "verified", label: "Verified accounts", icon: <FiCheck size={16} /> },
                  ].map((option) => {
                    const selected = replyAudience === option.key;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setReplyAudience(option.key as ReplyAudience);
                          setReplyMenuOpen(false);
                        }}
                        className={`mt-1 flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition ${
                          selected ? "bg-[#3c1f4f]/70 text-white" : "text-[#dfc8ef] hover:bg-[#281536]"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {option.icon}
                          {option.label}
                        </span>
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected ? "border-[#d8a8f2] bg-[#d8a8f2] text-[#1a0d24]" : "border-[#9f8cab]"
                          }`}
                        >
                          {selected ? <FiCheck size={12} /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <button type="button" onClick={openMediaPicker} className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#4a245f]/45" title="Image">
              <FiImage size={18} />
            </button>
            <button type="button" onClick={openMediaPicker} className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#4a245f]/45" title="GIF">
              <FiSearch size={18} />
            </button>
            <div ref={emojiMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setEmojiPickerOpen((current) => !current)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#4a245f]/45"
                title="Emoji"
              >
                <FiSmile size={18} />
              </button>

              {emojiPickerOpen ? (
                <div className="absolute bottom-[calc(100%+10px)] left-0 z-20 w-[220px] rounded-2xl border border-[#6f3e84] bg-[#120918]/95 p-2 shadow-[0_16px_38px_rgba(7,2,11,0.65)]">
                  <p className="px-1 pb-1 text-xs font-semibold text-[#f7ecff]">Emojis</p>
                  <div className="grid grid-cols-7 gap-1">
                    {[
                      "😀", "😁", "😂", "🤣", "😊", "😍", "😘",
                      "😎", "🤩", "😢", "😭", "😡", "🔥", "✨",
                      "🎉", "🎵", "💯", "❤️", "🩷", "👍", "🙏",
                    ].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiInsert(emoji)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-base transition hover:bg-[#3c1f4f]/70"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <button type="button" onClick={openMediaPicker} className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#4a245f]/45" title="Video">
              <FiVideo size={18} />
            </button>
            <button
              type="button"
              onClick={openMediaPicker}
              disabled={mediaItems.length >= 4}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d8a8f2]/50 text-[#d8a8f2] transition hover:bg-[#4a245f]/45 disabled:cursor-not-allowed disabled:opacity-40"
              title="Ajouter plus de media"
            >
              <FiPlus size={16} />
            </button>
          </div>

          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleMediaSelection}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#c7b5d3]">{audienceLabel}</span>
            <button
              type="button"
              disabled={!canPost}
              onClick={handlePost}
              className="rounded-full bg-[#d8a8f2] px-5 py-2 text-sm font-semibold text-[#1a0d24] transition hover:bg-[#e6c0fa] disabled:cursor-not-allowed disabled:bg-[#51485a] disabled:text-[#a9adb5]"
            >
              Post
            </button>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AvatarBadge({ name, className, size = "h-12 w-12" }: { name: string; className: string; size?: string }) {
  return (
    <span
      className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${className}`}
    >
      {name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk[0]?.toUpperCase())
        .join("")}
    </span>
  );
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

function formatAudioDuration(durationSec: number) {
  const total = Math.max(0, Math.round(durationSec));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function VoiceMessagePlayer({
  url,
  initialDurationSec,
  sender,
}: {
  url: string;
  initialDurationSec?: number;
  sender: "me" | "them";
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(initialDurationSec ?? 0);
  const [currentTime, setCurrentTime] = useState(0);

  const bars = useMemo(() => [4, 8, 11, 7, 13, 9, 6, 14, 10, 5, 12, 8, 6, 13, 9, 7, 12, 8, 6, 11], []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    function onLoadedMetadata() {
      const currentAudio = audioRef.current;
      if (!currentAudio) return;
      if (Number.isFinite(currentAudio.duration) && currentAudio.duration > 0) {
        setDuration(Math.round(currentAudio.duration));
      }
    }

    function onTimeUpdate() {
      const currentAudio = audioRef.current;
      if (!currentAudio) return;
      setCurrentTime(currentAudio.currentTime);
    }

    function onEnded() {
      const currentAudio = audioRef.current;
      if (!currentAudio) return;
      setPlaying(false);
      setCurrentTime(0);
      currentAudio.currentTime = 0;
    }

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function handleTogglePlay() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    void audio.play();
    setPlaying(true);
  }

  const totalDuration = duration > 0 ? duration : initialDurationSec ?? 0;
  const safeDuration = totalDuration > 0 ? totalDuration : 1;
  const progress = Math.min(1, Math.max(0, currentTime / safeDuration));

  return (
    <div
      className={`w-[300px] rounded-2xl px-3 py-2 ${
        sender === "me" ? "bg-[#1198e6] text-white" : "bg-[#1b1f27] text-[#e5edf9]"
      }`}
    >
      <audio ref={audioRef} src={url} preload="metadata" className="hidden" />

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
            sender === "me" ? "bg-white/85 text-[#0b4f79]" : "bg-[#2b3240] text-white"
          }`}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <FiPause size={15} /> : <FiPlay size={15} className="ml-0.5" />}
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-0.5">
            {bars.map((height, index) => {
              const active = index / bars.length <= progress;
              return (
                <span
                  key={`${height}-${index}`}
                  className={`inline-block w-1 rounded-full ${
                    active
                      ? sender === "me"
                        ? "bg-white"
                        : "bg-[#5ac8ff]"
                      : sender === "me"
                        ? "bg-white/35"
                        : "bg-[#7d879b]/45"
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
          <div className={`mt-1 flex items-center justify-between text-[11px] ${sender === "me" ? "text-[#d9f1ff]" : "text-[#b7c4d8]"}`}>
            <span>{formatAudioDuration(Math.round(currentTime))}</span>
            <span>{formatAudioDuration(totalDuration)}</span>
          </div>
        </div>

        <button
          type="button"
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
            sender === "me" ? "bg-white/85 text-[#0b4f79]" : "bg-[#2b3240] text-white"
          }`}
          title="Options"
        >
          <FiMoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
}

async function getAudioDurationSeconds(file: Blob): Promise<number | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const audioUrl = URL.createObjectURL(file);

  try {
    const duration = await new Promise<number>((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.onloadedmetadata = () => resolve(audio.duration);
      audio.onerror = () => reject(new Error("Impossible de lire la duree audio."));
      audio.src = audioUrl;
    });

    if (!Number.isFinite(duration) || duration <= 0) {
      return null;
    }

    return Math.max(1, Math.round(duration));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(audioUrl);
  }
}

function MessagesPanel() {
  const composerRef = useRef<HTMLInputElement | null>(null);
  const attachInputRef = useRef<HTMLInputElement | null>(null);
  const plusMenuRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaRecorderStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderChunksRef = useRef<BlobPart[]>([]);
  const ringtoneContextRef = useRef<AudioContext | null>(null);
  const ringtoneTimerRef = useRef<number | null>(null);
  const ringtonePlayingRef = useRef(false);
  const [searchValue, setSearchValue] = useState("");
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [actionMessageId, setActionMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [composerValue, setComposerValue] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [uploadIntent, setUploadIntent] = useState<"any" | "gif">("any");
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [forwardMessage, setForwardMessage] = useState<ChatMessage | null>(null);
  const [forwardSearch, setForwardSearch] = useState("");
  const [forwardTargets, setForwardTargets] = useState<ForwardTarget[]>([]);
  const [forwardLoading, setForwardLoading] = useState(false);
  const [forwardSending, setForwardSending] = useState(false);
  const [selectedForwardIds, setSelectedForwardIds] = useState<string[]>([]);
  const [copyToastOpen, setCopyToastOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<ChatMessage | null>(null);
  const [reportMessage, setReportMessage] = useState<ChatMessage | null>(null);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0]);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallSignal | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<CallSignal | null>(null);
  const [activeCall, setActiveCall] = useState<CallSignal | null>(null);
  const [callRoomUrl, setCallRoomUrl] = useState<string | null>(null);
  const seenMissedCallRef = useRef<string>("");

  const selectedThread =
    selectedThreadId !== null ? threads.find((thread) => thread.id === selectedThreadId) ?? null : null;

  const loadThreads = useCallback(async (silent = false) => {
    if (!silent) {
      setThreadsLoading(true);
    }

    try {
      const response = await fetch("/api/messages/threads", { cache: "no-store" });
      const data = (await response.json()) as { threads?: MessageThread[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Impossible de charger les conversations.");
      }

      const nextThreads = data.threads ?? [];
      setThreads(nextThreads);
      setSelectedThreadId((current) => {
        if (current && !nextThreads.some((thread) => thread.id === current)) {
          return null;
        }

        return current;
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    } finally {
      if (!silent) {
        setThreadsLoading(false);
      }
    }
  }, []);

  const loadMessages = useCallback(async (threadId: string, silent = false) => {
    if (!silent) {
      setMessagesLoading(true);
    }

    try {
      const response = await fetch(`/api/messages/threads/${threadId}/messages`, { cache: "no-store" });
      const data = (await response.json()) as { messages?: ChatMessage[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Impossible de charger les messages.");
      }

      setSelectedMessages(data.messages ?? []);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    } finally {
      if (!silent) {
        setMessagesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!selectedThreadId) {
      setSelectedMessages([]);
      return;
    }

    void loadMessages(selectedThreadId);
    setActionMessageId(null);
  }, [loadMessages, selectedThreadId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadThreads(true);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [loadThreads]);

  useEffect(() => {
    if (!selectedThreadId) {
      return;
    }

    const interval = window.setInterval(() => {
      void loadMessages(selectedThreadId, true);
    }, 2500);

    return () => window.clearInterval(interval);
  }, [loadMessages, selectedThreadId]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => setFeedback(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    if (!copyToastOpen) {
      return;
    }

    const timeout = window.setTimeout(() => setCopyToastOpen(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [copyToastOpen]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      if (mediaRecorderStreamRef.current) {
        mediaRecorderStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!plusMenuRef.current) {
        return;
      }

      if (!plusMenuRef.current.contains(event.target as Node)) {
        setPlusMenuOpen(false);
      }
    }

    if (plusMenuOpen) {
      document.addEventListener("mousedown", onDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, [plusMenuOpen]);

  useEffect(() => {
    if (!forwardModalOpen) {
      return;
    }

    let cancelled = false;

    async function loadForwardTargets() {
      setForwardLoading(true);

      try {
        const response = await fetch(`/api/messages/forward?q=${encodeURIComponent(forwardSearch)}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as { targets?: ForwardTarget[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Impossible de charger les utilisateurs.");
        }

        if (!cancelled) {
          setForwardTargets(data.targets ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          const detail = error instanceof Error ? error.message : "Erreur inconnue";
          setFeedback(detail);
        }
      } finally {
        if (!cancelled) {
          setForwardLoading(false);
        }
      }
    }

    void loadForwardTargets();

    return () => {
      cancelled = true;
    };
  }, [forwardModalOpen, forwardSearch]);

  function buildCallRoomUrl(call: CallSignal) {
    const hash =
      call.mode === "audio"
        ? "#config.prejoinPageEnabled=false&config.startWithVideoMuted=true&config.startWithAudioMuted=false"
        : "#config.prejoinPageEnabled=false&config.startWithVideoMuted=false&config.startWithAudioMuted=false";
    return `https://meet.jit.si/${call.roomName}${hash}`;
  }

  const syncCalls = useCallback(async () => {
    try {
      const query = selectedThreadId ? `?threadId=${encodeURIComponent(selectedThreadId)}` : "";
      const response = await fetch(`/api/messages/calls${query}`, { cache: "no-store" });
      const data = (await response.json()) as {
        incoming?: CallSignal | null;
        outgoing?: CallSignal | null;
        active?: CallSignal | null;
        missed?: CallSignal[];
      };

      if (!response.ok) {
        return;
      }

      const incoming = data.incoming ?? null;
      const outgoing = data.outgoing ?? null;
      const active = data.active ?? null;

      setIncomingCall(incoming);
      setOutgoingCall(outgoing);
      setActiveCall(active);

      if (active) {
        setCallRoomUrl(buildCallRoomUrl(active));
      } else {
        setCallRoomUrl(null);
      }

      const missed = data.missed ?? [];
      if (missed.length > 0) {
        const latest = missed[0];
        if (latest && latest.id && seenMissedCallRef.current !== latest.id) {
          seenMissedCallRef.current = latest.id;
          setFeedback(`Appel manque de ${latest.callerName}.`);
        }
      }
    } catch {
      // Keep UI responsive even if call sync fails temporarily.
    }
  }, [selectedThreadId]);

  useEffect(() => {
    void syncCalls();
    const interval = window.setInterval(() => {
      void syncCalls();
    }, 2500);

    return () => window.clearInterval(interval);
  }, [syncCalls]);

  function stopRingtone() {
    if (ringtoneTimerRef.current !== null) {
      window.clearInterval(ringtoneTimerRef.current);
      ringtoneTimerRef.current = null;
    }

    if (ringtoneContextRef.current) {
      void ringtoneContextRef.current.close();
      ringtoneContextRef.current = null;
    }

    ringtonePlayingRef.current = false;
  }

  function playRingtonePattern() {
    if (!ringtoneContextRef.current) {
      return;
    }

    const context = ringtoneContextRef.current;
    const now = context.currentTime;

    const beep1 = context.createOscillator();
    const gain1 = context.createGain();
    beep1.type = "sine";
    beep1.frequency.setValueAtTime(830, now);
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.1, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    beep1.connect(gain1);
    gain1.connect(context.destination);
    beep1.start(now);
    beep1.stop(now + 0.24);

    const beep2 = context.createOscillator();
    const gain2 = context.createGain();
    beep2.type = "sine";
    beep2.frequency.setValueAtTime(660, now + 0.28);
    gain2.gain.setValueAtTime(0.0001, now + 0.28);
    gain2.gain.exponentialRampToValueAtTime(0.1, now + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
    beep2.connect(gain2);
    gain2.connect(context.destination);
    beep2.start(now + 0.28);
    beep2.stop(now + 0.54);
  }

  function startRingtone() {
    if (ringtonePlayingRef.current) {
      return;
    }

    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    ringtoneContextRef.current = new AudioCtx();
    ringtonePlayingRef.current = true;

    playRingtonePattern();
    ringtoneTimerRef.current = window.setInterval(() => {
      playRingtonePattern();
    }, 1800);
  }

  const shouldPlayRingtone = Boolean((incomingCall || outgoingCall) && !activeCall);

  useEffect(() => {
    if (shouldPlayRingtone) {
      startRingtone();
      return;
    }

    stopRingtone();
  }, [shouldPlayRingtone]);

  useEffect(() => {
    return () => {
      stopRingtone();
    };
  }, []);

  const visibleThreads = threads.filter((thread) => {
    const value = searchValue.trim().toLowerCase();
    if (!value) {
      return true;
    }

    return thread.name.toLowerCase().includes(value) || thread.preview.toLowerCase().includes(value);
  });

  const showThreadList = !selectedThread;

  async function handleSendMessage() {
    const text = composerValue.trim();
    if ((!text && !pendingAttachment) || !selectedThreadId || isSending) {
      return;
    }

    setIsSending(true);

    try {
      if (editingMessageId) {
        const response = await fetch(
          `/api/messages/threads/${selectedThreadId}/messages/${editingMessageId}/action`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "edit", text }),
          },
        );

        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(data.error ?? "Modification impossible.");
        }

        setSelectedMessages((current) =>
          current.map((item) => (item.id === editingMessageId ? { ...item, text } : item)),
        );
        setComposerValue("");
        setEditingMessageId(null);
        setFeedback("Message modifie.");
        await loadThreads();
        composerRef.current?.focus();
        return;
      }

      const response = await fetch(`/api/messages/threads/${selectedThreadId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          replyToMessageId: replyingTo?.id ?? null,
          attachment: pendingAttachment,
        }),
      });

      const data = (await response.json()) as { message?: ChatMessage; error?: string };
      if (!response.ok || !data.message) {
        throw new Error(data.error ?? "Envoi impossible.");
      }

      setComposerValue("");
      setPendingAttachment(null);
      setReplyingTo(null);
      setSelectedMessages((current) => [...current, data.message!]);
      await loadThreads();
      composerRef.current?.focus();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    } finally {
      setIsSending(false);
    }
  }

  async function handleMessageAction(
    action:
      | "reply"
      | "forward"
      | "edit"
      | "copy"
      | "info"
      | "report"
      | "delete-for-me"
      | "delete-for-all",
    message: ChatMessage,
  ) {
    if (!selectedThreadId) {
      return;
    }

    if (action === "reply") {
      setReplyingTo(message);
      composerRef.current?.focus();
      setActionMessageId(null);
      return;
    }

    if (action === "forward") {
      setForwardMessage(message);
      setForwardModalOpen(true);
      setForwardSearch("");
      setSelectedForwardIds([]);
      setActionMessageId(null);
      return;
    }

    if (action === "edit") {
      if (!message.text.trim()) {
        setFeedback("Impossible d'editer un message sans texte.");
        setActionMessageId(null);
        return;
      }

      setComposerValue(message.text);
      setEditingMessageId(message.id);
      composerRef.current?.focus();
      setActionMessageId(null);
      return;
    }

    if (action === "copy") {
      const textToCopy = message.text || message.attachment?.url || "";
      const copied = textToCopy ? await copyText(textToCopy) : false;
      if (copied) {
        setCopyToastOpen(true);
      } else {
        setFeedback("Copie impossible sur ce navigateur.");
      }
      setActionMessageId(null);
      return;
    }

    if (action === "info") {
      setInfoMessage(message);
      setActionMessageId(null);
      return;
    }

    if (action === "report") {
      setReportMessage(message);
      setReportReason(REPORT_REASONS[0]);
      setActionMessageId(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/messages/threads/${selectedThreadId}/messages/${message.id}/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Action impossible.");
      }

      if (action === "delete-for-me" || action === "delete-for-all") {
        setSelectedMessages((current) => current.filter((item) => item.id !== message.id));
        if (replyingTo?.id === message.id) {
          setReplyingTo(null);
        }
      }

      if (action === "delete-for-all") {
        setFeedback("Message supprime pour nous 2.");
      } else {
        setFeedback("Message supprime pour toi seulement.");
      }
      setActionMessageId(null);
      await loadThreads();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    }
  }

  function appendComposerText(value: string) {
    setComposerValue((current) => `${current}${value}`.trimStart());
    composerRef.current?.focus();
  }

  function formatInfoDateTime(message: ChatMessage) {
    if (!message.createdAt) {
      return message.time;
    }

    const date = new Date(message.createdAt);
    if (Number.isNaN(date.getTime())) {
      return message.time;
    }

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const clock = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${month} ${day} at ${clock}`;
  }

  function handleEmojiInsert() {
    appendComposerText(" 😊");
    setPlusMenuOpen(false);
  }

  function handleGifInsert() {
    setUploadIntent("gif");
    attachInputRef.current?.click();
    setPlusMenuOpen(false);
  }

  function handleUploadButtonClick() {
    setUploadIntent("any");
    attachInputRef.current?.click();
  }

  async function uploadAttachmentFile(file: File, durationSec?: number) {
    const formData = new FormData();
    formData.append("file", file);
    if (typeof durationSec === "number" && Number.isFinite(durationSec) && durationSec > 0) {
      formData.append("durationSec", String(Math.round(durationSec)));
    }

    setAttachmentUploading(true);

    try {
      const response = await fetch("/api/messages/uploads", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        attachment?: MessageAttachment;
        error?: string;
      };

      if (!response.ok || !data.attachment) {
        throw new Error(data.error ?? "Upload impossible.");
      }

      setPendingAttachment(data.attachment);
      setFeedback(`${data.attachment.name} ajoute.`);
      composerRef.current?.focus();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    } finally {
      setAttachmentUploading(false);
      setUploadIntent("any");
    }
  }

  async function startAudioRecording() {
    if (attachmentUploading || isSending) {
      return;
    }

    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setFeedback("Enregistrement audio non supporte sur cet appareil.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
      const supportedMimeType = preferredMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = supportedMimeType ? new MediaRecorder(stream, { mimeType: supportedMimeType }) : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      mediaRecorderStreamRef.current = stream;
      mediaRecorderChunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          mediaRecorderChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const extension = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "m4a" : "webm";
        const blob = new Blob(mediaRecorderChunksRef.current, { type: mimeType });

        mediaRecorderStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;
        mediaRecorderStreamRef.current = null;
        mediaRecorderChunksRef.current = [];
        setIsRecording(false);

        if (blob.size <= 0) {
          setFeedback("Aucun son enregistre.");
          return;
        }

        const file = new File([blob], `voice-note-${Date.now()}.${extension}`, { type: mimeType });
        void (async () => {
          const durationSec = await getAudioDurationSeconds(blob);
          await uploadAttachmentFile(file, durationSec ?? undefined);
        })();
      };

      recorder.onerror = () => {
        setFeedback("Erreur pendant l'enregistrement audio.");
      };

      recorder.start();
      setIsRecording(true);
      setFeedback("Enregistrement en cours...");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(`Micro indisponible: ${detail}`);
      setIsRecording(false);
    }
  }

  function stopAudioRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      return;
    }

    if (recorder.state !== "inactive") {
      recorder.stop();
      setFeedback("Traitement du vocal...");
    }
  }

  async function handleComposerPrimaryAction() {
    if (composerValue.trim() || pendingAttachment) {
      await handleSendMessage();
      return;
    }

    if (isRecording) {
      stopAudioRecording();
      return;
    }

    await startAudioRecording();
  }

  async function handleAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const isGif = file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
    if (uploadIntent === "gif" && !isGif) {
      setFeedback("Choisis un vrai fichier GIF.");
      return;
    }

    const durationSec = file.type.startsWith("audio/") ? await getAudioDurationSeconds(file) : null;
    await uploadAttachmentFile(file, durationSec ?? undefined);
  }

  function toggleForwardTarget(targetId: string) {
    setSelectedForwardIds((current) =>
      current.includes(targetId)
        ? current.filter((id) => id !== targetId)
        : [...current, targetId],
    );
  }

  async function handleForwardSend() {
    if (!forwardMessage || selectedForwardIds.length === 0 || forwardSending) {
      return;
    }

    setForwardSending(true);

    try {
      const response = await fetch("/api/messages/forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageText: forwardMessage.text,
          attachment: forwardMessage.attachment ?? null,
          recipientIds: selectedForwardIds,
        }),
      });

      const data = (await response.json()) as { delivered?: number; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Transfert impossible.");
      }

      setForwardModalOpen(false);
      setForwardMessage(null);
      setSelectedForwardIds([]);
      setFeedback(`Message transfere a ${data.delivered ?? 0} personne(s).`);
      await loadThreads(true);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    } finally {
      setForwardSending(false);
    }
  }

  async function handleStartCall(mode: "audio" | "video") {
    if (!selectedThread || !selectedThreadId) {
      return;
    }

    try {
      const response = await fetch("/api/messages/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "initiate", threadId: selectedThreadId, mode }),
      });
      const data = (await response.json()) as { call?: CallSignal; error?: string };
      if (!response.ok || !data.call) {
        throw new Error(data.error ?? "Appel impossible.");
      }

      setOutgoingCall(data.call);
      setIncomingCall(null);
      setFeedback(mode === "audio" ? `Sonnerie envoyee a ${selectedThread.name}.` : `Invitation video envoyee a ${selectedThread.name}.`);
      await syncCalls();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    }
  }

  async function handleAcceptIncomingCall() {
    if (!incomingCall) {
      return;
    }

    try {
      const response = await fetch("/api/messages/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "accept", callId: incomingCall.id }),
      });
      const data = (await response.json()) as { call?: CallSignal; error?: string };
      if (!response.ok || !data.call) {
        throw new Error(data.error ?? "Impossible d'accepter l'appel.");
      }

      setSelectedThreadId(data.call.threadId);
      setIncomingCall(null);
      setActiveCall(data.call);
      setCallRoomUrl(buildCallRoomUrl(data.call));
      setFeedback("Appel accepte.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    }
  }

  async function handleDeclineIncomingCall() {
    if (!incomingCall) {
      return;
    }

    try {
      const response = await fetch("/api/messages/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "decline", callId: incomingCall.id }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Impossible de refuser l'appel.");
      }

      setIncomingCall(null);
      setFeedback("Appel refuse.");
      await syncCalls();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    }
  }

  async function handleEndCall() {
    const call = activeCall ?? outgoingCall ?? incomingCall;
    if (!call) {
      return;
    }

    try {
      const response = await fetch("/api/messages/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "end", callId: call.id }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Impossible de terminer l'appel.");
      }

      setActiveCall(null);
      setOutgoingCall(null);
      setIncomingCall(null);
      setCallRoomUrl(null);
      setFeedback("Appel termine.");
      await syncCalls();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    }
  }

  async function handleSubmitReport() {
    if (!selectedThreadId || !reportMessage || reportSubmitting) {
      return;
    }

    setReportSubmitting(true);

    try {
      const response = await fetch(
        `/api/messages/threads/${selectedThreadId}/messages/${reportMessage.id}/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "report", reason: reportReason }),
        },
      );

      const data = (await response.json()) as { error?: string; blocked?: boolean };
      if (!response.ok) {
        throw new Error(data.error ?? "Signalement impossible.");
      }

      setReportMessage(null);
      setFeedback(data.blocked ? "Message signale. Cette personne est maintenant bloquee." : "Message signale.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Erreur inconnue";
      setFeedback(detail);
    } finally {
      setReportSubmitting(false);
    }
  }

  return (
    <section className="relative mx-auto mt-1 h-[calc(100vh-16px)] w-full max-w-6xl overflow-hidden pb-4 pr-1">
      {copyToastOpen ? (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#4d2e63] bg-[#120a1a]/95 px-4 py-1.5 text-xs font-semibold text-[#f6e9ff] shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
          Texte copie
        </div>
      ) : null}

      {infoMessage ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-4" onClick={() => setInfoMessage(null)}>
          <div
            className="w-full max-w-[360px] rounded-2xl border border-[#2f3544] bg-[#06090f]/95 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-lg font-semibold text-[#f2f5fb]">Sent by</p>

            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#161d28] px-3 py-3">
              <AvatarBadge
                name={infoMessage.sender === "me" ? "You" : selectedThread?.name ?? "Contact"}
                className={selectedThread?.avatarClassName ?? "from-[#3f2653] to-[#9067aa]"}
              />
              <div className="min-w-0">
                <p className="truncate text-2xl font-semibold leading-none text-white">
                  {infoMessage.senderName ?? (infoMessage.sender === "me" ? "You" : selectedThread?.name ?? "Contact")}
                </p>
                <p className="truncate text-sm text-[#8fa1bc]">Message details</p>
              </div>
              {selectedThread?.isVerified ? <span className="text-sm text-[#26b2ff]">●</span> : null}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#161d28] px-3 py-3">
              <span className="text-xl font-semibold text-[#d7e1f1]">Sent</span>
              <span className="text-xl font-semibold text-[#d7e1f1]">{formatInfoDateTime(infoMessage)}</span>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoMessage(null)}
                className="rounded-full bg-[#1a2331] px-4 py-1.5 text-sm font-semibold text-[#e8eefb] transition hover:bg-[#273247]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {reportMessage ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 px-4" onClick={() => setReportMessage(null)}>
          <div
            className="w-full max-w-[420px] rounded-3xl border border-[#2f3544] bg-[#06090f]/95 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold text-white">Signaler ce message</p>
              <button
                type="button"
                onClick={() => setReportMessage(null)}
                className="rounded-full bg-[#1a2331] px-3 py-1 text-xs font-semibold text-[#f0e6ff] transition hover:bg-[#273247]"
                title="Fermer"
              >
                Fermer
              </button>
            </div>

            <p className="mt-2 text-sm text-[#b8c4d8]">Aide-nous a comprendre le probleme avec cette conversation.</p>

            <div className="mt-4 space-y-2">
              {REPORT_REASONS.map((reason) => {
                const active = reportReason === reason;

                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setReportReason(reason)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-[#5e79a7] bg-[#152033] text-white"
                        : "border-[#2c3444] bg-[#0f141f] text-[#d9e4f6] hover:border-[#445169]"
                    }`}
                  >
                    <span className="text-sm font-medium">{reason}</span>
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                        active ? "border-[#4aa7ff] bg-[#1b8be9]" : "border-[#65748f]"
                      }`}
                    >
                      {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={reportSubmitting}
              onClick={() => void handleSubmitReport()}
              className="mt-5 w-full rounded-full bg-[#1ca8ff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f93e6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reportSubmitting ? "Envoi..." : "Envoyer le signalement"}
            </button>
          </div>
        </div>
      ) : null}

      {incomingCall && !activeCall ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-[360px] rounded-3xl border border-[#33405a] bg-[#070d17]/95 p-5 text-white shadow-[0_24px_58px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col items-center text-center">
              <AvatarBadge name={incomingCall.callerName} className={incomingCall.callerAvatarClassName} size="h-20 w-20" />
              <p className="mt-3 text-2xl font-semibold">{incomingCall.callerName}</p>
              <p className="mt-1 text-sm text-[#b8c8df]">Appel entrant {incomingCall.mode === "audio" ? "audio" : "video"}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void handleDeclineIncomingCall()}
                className="inline-flex items-center justify-center rounded-full bg-[#ef4444] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => void handleAcceptIncomingCall()}
                className="inline-flex items-center justify-center rounded-full bg-[#10b981] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#059669]"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {outgoingCall && !activeCall ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-[360px] rounded-3xl border border-[#33405a] bg-[#070d17]/95 p-5 text-white shadow-[0_24px_58px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col items-center text-center">
              <AvatarBadge name={outgoingCall.calleeName} className={outgoingCall.calleeAvatarClassName} size="h-20 w-20" />
              <p className="mt-3 text-2xl font-semibold">{outgoingCall.calleeName}</p>
              <p className="mt-1 text-sm text-[#b8c8df]">Sonnerie en cours...</p>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                onClick={() => void handleEndCall()}
                className="inline-flex items-center justify-center rounded-full bg-[#ef4444] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeCall && callRoomUrl ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/65 p-3">
          <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#33405a] bg-[#070d17] shadow-[0_24px_58px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between border-b border-[#24324a] px-4 py-3 text-white">
              <div>
                <p className="text-base font-semibold">{activeCall.isIncoming ? activeCall.callerName : activeCall.calleeName}</p>
                <p className="text-xs text-[#b8c8df]">{activeCall.mode === "audio" ? "Appel audio" : "Appel video"}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleEndCall()}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
                  title="Raccrocher"
                >
                  <FiPhoneOff size={16} />
                  <span className="ml-2">Raccrocher</span>
                </button>
              </div>
            </div>

            <iframe
              title="Appel en direct"
              src={callRoomUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      ) : null}

      <div className="flex h-full flex-col bg-transparent p-2 text-white sm:p-3">
        {forwardModalOpen ? (
          <div className="absolute inset-0 z-40 flex items-start justify-center bg-black/45 px-4 pt-8">
            <div className="w-full max-w-[560px] rounded-[26px] border border-[#2d3e5a] bg-[#04070d]/95 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.55)] sm:p-5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setForwardModalOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#e7f0ff] hover:bg-[#132035]"
                  title="Fermer"
                >
                  <FiArrowLeft size={18} />
                </button>
                <p className="text-2xl font-semibold text-white">Forward</p>
                <button
                  type="button"
                  disabled={selectedForwardIds.length === 0 || forwardSending}
                  onClick={() => void handleForwardSend()}
                  className="rounded-full bg-[#1ca8ff] px-4 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>

              <div className="relative mt-4">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea7ca]" size={17} />
                <input
                  type="text"
                  value={forwardSearch}
                  onChange={(event) => setForwardSearch(event.target.value)}
                  placeholder="Search"
                  className="h-11 w-full rounded-full border border-[#1ca8ff] bg-transparent pl-10 pr-4 text-lg text-white outline-none placeholder:text-[#9fb2cf]"
                />
              </div>

              <div className="scrollbar-hidden mt-4 max-h-[360px] overflow-y-auto">
                {forwardLoading ? <p className="px-1 py-2 text-sm text-[#d7e6ff]">Chargement...</p> : null}

                {!forwardLoading && forwardTargets.length === 0 ? (
                  <p className="px-1 py-2 text-sm text-[#d7e6ff]">Aucun utilisateur trouve.</p>
                ) : null}

                {forwardTargets.map((target) => {
                  const active = selectedForwardIds.includes(target.id);

                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => toggleForwardTarget(target.id)}
                      className={`mb-1 grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl px-2 py-2 text-left transition ${
                        active ? "bg-[#12345c]/65" : "hover:bg-[#0e1a2c]"
                      }`}
                    >
                      <AvatarBadge name={target.name} className={target.avatarClassName} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-[30px] font-semibold leading-none text-white">
                          <span className="truncate text-[34px]">{target.name}</span>
                          {target.isVerified ? <span className="text-[14px] text-[#26b2ff]">●</span> : null}
                        </span>
                        <span className="block truncate text-[32px] leading-none text-[#8f9fb9]">{target.handle}</span>
                      </span>
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                          active ? "border-[#1ca8ff] bg-[#1ca8ff]" : "border-[#6b84a5]"
                        }`}
                      >
                        {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              {forwardMessage ? (
                <p className="mt-3 truncate text-xs text-[#b8c8df]">
                  Message: {forwardMessage.text || forwardMessage.attachment?.name || "[Piece jointe]"}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[28px] font-semibold leading-none tracking-tight">
            {selectedThread ? selectedThread.name : "Chat"}
          </h2>
          <div className="flex items-center gap-2">
            {selectedThread ? (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedThreadId(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#6a3f7d] bg-[#2d1438]/70 text-[#f6e9ff] transition hover:border-[#8c5ca3]"
                  title="Retour"
                >
                  <FiArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleStartCall("audio")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#6a3f7d] bg-[#2d1438]/70 text-[#f6e9ff] transition hover:border-[#8c5ca3]"
                  title="Appel"
                >
                  <FiPhone size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleStartCall("video")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#6a3f7d] bg-[#2d1438]/70 text-[#f6e9ff] transition hover:border-[#8c5ca3]"
                  title="Video"
                >
                  <FiVideo size={15} />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-[#6a3f7d] bg-[#2d1438]/70 px-3 py-1.5 text-xs text-[#f6e9ff] transition hover:border-[#8c5ca3]"
              >
                All
                <FiChevronDown size={13} />
              </button>
            )}
          </div>
        </div>

        {feedback ? <p className="mt-2 text-xs text-[#efc8ff]">{feedback}</p> : null}

        {showThreadList ? (
          <>
            <div className="relative mt-4">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#c39ed8]" size={16} />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-2xl border border-[#6a3f7d] bg-gradient-to-r from-[#2d1438]/80 to-[#3a1c49]/70 pl-10 pr-3 text-sm text-[#f2e1ff] outline-none placeholder:text-[#d5b2e7] focus:border-[#9968b2]"
              />
            </div>

            <div className="scrollbar-hidden mt-4 flex-1 overflow-y-auto pr-1">
              {threadsLoading ? <p className="px-1 py-2 text-sm text-[#d5bee4]">Chargement...</p> : null}

              {!threadsLoading && visibleThreads.length === 0 ? (
                <p className="px-1 py-2 text-sm text-[#d5bee4]">Aucune conversation.</p>
              ) : null}

              {visibleThreads.map((thread, index) => (
                <article key={thread.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedThreadId(thread.id);
                      setActionMessageId(null);
                    }}
                    className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-3 rounded-2xl px-1 py-3 text-left transition hover:bg-[#3b1a4b]/40"
                  >
                    <AvatarBadge name={thread.name} className={thread.avatarClassName} />

                    <span className="block min-w-0">
                      <span className="flex items-center gap-1 text-lg font-semibold leading-none tracking-tight text-white">
                        <span className="truncate text-[18px]">{thread.name}</span>
                        {thread.isVerified ? <span className="text-[11px] text-[#3bc3ff]">●</span> : null}
                        {thread.isVerified ? <span className="text-[12px]">💗</span> : null}
                      </span>
                      <span className="mt-1 block truncate text-sm leading-none text-[#d2b9e2]">
                        {thread.preview}
                      </span>
                    </span>

                    <span className="pt-0.5 text-sm leading-none text-[#d5bee4]">{thread.time}</span>
                  </button>

                  {index < visibleThreads.length - 1 ? <div className="mx-[58px] border-b border-[#6a3f7d]/70" /> : null}
                </article>
              ))}
            </div>
          </>
        ) : selectedThread ? (
          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
              <div className="mx-auto mt-2 flex w-full max-w-md flex-col items-center text-center">
                <AvatarBadge name={selectedThread.name} className={selectedThread.avatarClassName} size="h-16 w-16" />
                <p className="mt-3 text-2xl font-semibold leading-none text-white">{selectedThread.name}</p>
                <p className="mt-1 text-base text-[#d0b0e2]">{selectedThread.handle}</p>
                <p className="mt-1 text-base text-[#d0b0e2]">{selectedThread.joinedAt}</p>
                <a
                  href={`/profile/${selectedThread.handle.replace(/^@/, "")}`}
                  className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#1d0930] transition hover:bg-[#efe8f7]"
                >
                  View Profile
                </a>
              </div>

              <p className="mt-8 text-center text-sm text-[#cfb7de]">Mon, Apr 20</p>

              <div className="mt-3 flex flex-col gap-4 pb-4">
                {messagesLoading ? <p className="text-sm text-[#d5bee4]">Chargement des messages...</p> : null}

                {selectedMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`relative flex max-w-[72%] items-center gap-2 ${message.sender === "me" ? "flex-row-reverse" : ""}`}>
                      {/* Avatar à gauche pour 'them', à droite pour 'me' */}
                      <a
                        href={message.sender === "me" ? "/profile/me" : `/profile/${selectedThread?.handle?.replace(/^@/, "")}`}
                        title="View Profile"
                        className="shrink-0"
                        tabIndex={-1}
                        style={{ textDecoration: "none" }}
                      >
                        <AvatarBadge
                          name={message.sender === "me" ? "You" : selectedThread?.name ?? "Contact"}
                          className={selectedThread?.avatarClassName ?? "from-[#3f2653] to-[#9067aa]"}
                          size="h-9 w-9"
                        />
                      </a>
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm ${
                          message.sender === "me"
                            ? "bg-[#1ca8ff] text-white"
                            : "bg-[#2a1735]/90 text-[#f6edff]"
                        }`}
                      >
                        {message.replyTo ? (
                          <div
                            className={`mb-1 rounded-xl border px-2 py-1 text-[11px] leading-tight ${
                              message.sender === "me"
                                ? "border-[#9ad9ff] bg-[#1a8fda]/55 text-[#eaf8ff]"
                                : "border-[#5d3b74] bg-[#342043]/70 text-[#d9c2e8]"
                            }`}
                          >
                            <p className="font-semibold">{message.replyTo.senderName || "Reply"}</p>
                            <p className="truncate">{message.replyTo.text}</p>
                          </div>
                        ) : null}
                        {message.attachment ? (
                          <div className="mb-2">
                            {message.attachment.kind === "image" ? (
                              <img
                                src={message.attachment.url}
                                alt={message.attachment.name}
                                className="max-h-64 w-full rounded-xl object-cover"
                              />
                            ) : message.attachment.kind === "video" ? (
                              <video
                                controls
                                className="max-h-64 w-full rounded-xl"
                                src={message.attachment.url}
                              />
                            ) : message.attachment.kind === "audio" ? (
                              <VoiceMessagePlayer
                                url={message.attachment.url}
                                initialDurationSec={message.attachment.durationSec}
                                sender={message.sender}
                              />
                            ) : (
                              <a
                                href={message.attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium underline ${
                                  message.sender === "me" ? "bg-[#1a8fda]/60 text-[#eaf8ff]" : "bg-[#342043]/70 text-[#ecd9ff]"
                                }`}
                              >
                                {message.attachment.name}
                              </a>
                            )}
                          </div>
                        ) : null}
                        {message.text ? <span>{message.text}</span> : null}
                        <span
                          className={`ml-2 inline-block text-[11px] ${
                            message.sender === "me" ? "text-[#d8f2ff]" : "text-[#ceb4dd]"
                          }`}
                        >
                          {message.time}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setActionMessageId((current) => (current === message.id ? null : message.id))
                        }
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22102d] text-xs text-[#cab2d8] transition hover:bg-[#321746]"
                        title="Actions"
                      >
                        <FiMoreHorizontal size={14} />
                      </button>

                      {actionMessageId === message.id ? (
                        <div
                          className={`absolute bottom-[calc(100%+8px)] z-10 w-56 rounded-3xl border border-[#3f274f] bg-[#1a1027]/95 p-2 shadow-[0_12px_30px_rgba(8,3,14,0.5)] ${
                            message.sender === "me" ? "right-0" : "left-0"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => void handleMessageAction("reply", message)}
                            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#f3e7ff] hover:bg-[#2a1738]"
                          >
                            <FiMessageCircle size={15} />
                            Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleMessageAction("forward", message)}
                            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#f3e7ff] hover:bg-[#2a1738]"
                          >
                            <FiArrowLeft size={15} className="rotate-180" />
                            Forward
                          </button>
                          {message.sender === "me" && message.text.trim() ? (
                            <button
                              type="button"
                              onClick={() => void handleMessageAction("edit", message)}
                              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#f3e7ff] hover:bg-[#2a1738]"
                            >
                              <FiEdit2 size={15} />
                              Edit message
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => void handleMessageAction("copy", message)}
                            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#f3e7ff] hover:bg-[#2a1738]"
                          >
                            <FiInfo size={15} />
                            Copy text
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleMessageAction("info", message)}
                            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#f3e7ff] hover:bg-[#2a1738]"
                          >
                            <FiInfo size={15} />
                            Info
                          </button>
                          {message.sender === "them" ? (
                            <button
                              type="button"
                              onClick={() => void handleMessageAction("report", message)}
                              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#ff6f9f] hover:bg-[#2a1738]"
                            >
                              <FiInfo size={15} />
                              Report message
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => void handleMessageAction("delete-for-me", message)}
                            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#ff6f9f] hover:bg-[#2a1738]"
                          >
                            <FiTrash2 size={15} />
                            Supprimer pour moi
                          </button>
                          {message.sender === "me" ? (
                            <button
                              type="button"
                              onClick={() => void handleMessageAction("delete-for-all", message)}
                              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#ff6f9f] hover:bg-[#2a1738]"
                            >
                              <FiTrash2 size={15} />
                              Supprimer pour nous 2
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mb-3 mt-auto text-center text-sm text-[#baa2cb]">This conversation is now end-to-end encrypted</p>
            </div>

            <div className="relative mt-2 flex items-center gap-3 overflow-visible rounded-full border border-[#6a3f7d] bg-[#2d1438]/75 p-2">
              <div ref={plusMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setPlusMenuOpen((value) => !value)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#22102d] text-[#f6e9ff] transition hover:bg-[#34154b]"
                  title="Ajouter"
                >
                  <FiPlus size={18} />
                </button>

                {plusMenuOpen ? (
                  <div className="absolute bottom-[calc(100%+10px)] left-0 z-30 w-44 rounded-2xl border border-[#4b2f60] bg-[#14101c]/95 p-2 shadow-[0_14px_30px_rgba(6,3,12,0.6)]">
                    <button
                      type="button"
                      onClick={handleEmojiInsert}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#f4e9ff] transition hover:bg-[#2b1a39]"
                    >
                      <FiSmile size={15} />
                      Emoji
                    </button>
                    <button
                      type="button"
                      onClick={handleGifInsert}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#f4e9ff] transition hover:bg-[#2b1a39]"
                    >
                      <FiImage size={15} />
                      GIF
                    </button>
                    <button
                      type="button"
                      onClick={handleUploadButtonClick}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#f4e9ff] transition hover:bg-[#2b1a39]"
                    >
                      <FiPaperclip size={15} />
                      Upload
                    </button>
                  </div>
                ) : null}

                <input
                  ref={attachInputRef}
                  type="file"
                  accept={uploadIntent === "gif" ? "image/gif" : "image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"}
                  className="hidden"
                  onChange={handleAttachmentChange}
                />
              </div>
              <input
                ref={composerRef}
                type="text"
                value={composerValue}
                onChange={(event) => setComposerValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSendMessage();
                  }
                }}
                placeholder="Message"
                className="h-9 flex-1 bg-transparent text-sm text-[#f6e9ff] outline-none placeholder:text-[#c7aad9]"
              />
              {pendingAttachment ? (
                <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 mx-2 flex items-start justify-between rounded-xl border border-[#694086] bg-[#1f1329]/95 px-3 py-2 text-xs text-[#eedbff]">
                  <div className="min-w-0">
                    <p className="font-semibold">Piece jointe prete</p>
                    <p className="truncate text-[#d5bee4]">
                      {pendingAttachment.name}
                      {pendingAttachment.kind === "audio" && typeof pendingAttachment.durationSec === "number"
                        ? ` (${formatAudioDuration(pendingAttachment.durationSec)})`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="ml-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#f4e8ff] hover:bg-[#31203f]"
                    title="Retirer la piece jointe"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : null}
              {replyingTo ? (
                <div
                  className={`absolute left-0 right-0 mx-2 flex items-start justify-between rounded-xl border border-[#694086] bg-[#1f1329]/95 px-3 py-2 text-xs text-[#eedbff] ${
                    pendingAttachment ? "bottom-[calc(100%+68px)]" : "bottom-[calc(100%+8px)]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold">Replying to {replyingTo.sender === "me" ? "you" : selectedThread?.name}</p>
                    <p className="truncate text-[#d5bee4]">{replyingTo.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="ml-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#f4e8ff] hover:bg-[#31203f]"
                    title="Annuler reponse"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : null}
              {editingMessageId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMessageId(null);
                    setComposerValue("");
                  }}
                  className="inline-flex h-8 items-center justify-center rounded-full bg-[#22102d] px-3 text-xs text-[#f6e9ff] transition hover:bg-[#34154b]"
                  title="Annuler modification"
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="button"
                disabled={isSending || attachmentUploading}
                onClick={() => void handleComposerPrimaryAction()}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[#f6e9ff] transition ${
                  isRecording ? "bg-[#c83352] hover:bg-[#b12a47]" : "bg-[#22102d] hover:bg-[#34154b]"
                }`}
                title={
                  composerValue.trim() || pendingAttachment
                    ? editingMessageId
                      ? "Sauvegarder"
                      : "Envoyer"
                    : isRecording
                      ? "Stop recording"
                      : "Audio"
                }
              >
                {composerValue.trim() || pendingAttachment ? <FiSend size={15} /> : <FiMic size={15} />}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function EspaceClientShell({ userName, feedPosts }: EspaceClientShellProps) {
  const [activeView, setActiveView] = useState<EspaceClientView>("home");
  const [targetReelId, setTargetReelId] = useState<string | null>(null);

  useEffect(() => {
    if (activeView === "profile") {
      window.location.href = "/profile/me";
    }
  }, [activeView]);

  const extraViewData = useMemo(() => {
    if (activeView === "home") {
      return null;
    }

    return viewContent[activeView];
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "home" || !targetReelId) {
      return;
    }

    const escapedReelId = targetReelId.replaceAll('"', '\\"');
    const timer = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(`[data-reel-id="${escapedReelId}"]`);
      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "center" });
      window.dispatchEvent(new CustomEvent("asmyne-active-video", { detail: { reelId: targetReelId } }));
      setTargetReelId(null);
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeView, targetReelId]);

  return (
    <main className="h-screen overflow-hidden bg-fixed bg-gradient-to-b from-[#120714] via-[#260d2e] to-[#ffe6f6] px-4">
      <EspaceClientSidebar userName={userName} activeView={activeView} onChangeView={setActiveView} />

      <div className="h-full overflow-hidden pl-24">
        {activeView !== "messages" && activeView !== "search" && activeView !== "notifications" && activeView !== "create" ? (
          <div className="mx-auto w-full max-w-6xl pt-2">
            <StatusNavbar />
          </div>
        ) : null}

        {activeView === "home" ? (
          <section
            id="espace-feed-scroll"
            className="scrollbar-hidden mx-auto mt-6 h-[calc(100vh-112px)] w-full max-w-6xl overflow-y-auto pb-10 pr-1"
          >
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_minmax(0,620px)_1fr]">
              <div className="hidden md:block" />

              <div className="space-y-10">
                {feedPosts.map((post) => (
                  <InteractiveReelCard
                    key={post.reelId}
                    userName={post.userName}
                    reelId={post.reelId}
                    mediaType={post.mediaType}
                    mediaSrc={post.mediaSrc}
                    trackTitle={post.trackTitle}
                    caption={post.caption}
                    userAvatar={post.userAvatar}
                  />
                ))}
              </div>

              <div className="hidden md:block" />
            </div>
          </section>
        ) : activeView === "messages" ? (
          <MessagesPanel />
        ) : activeView === "search" ? (
          <SearchProfilesPanel
            feedPosts={feedPosts}
            onOpenReelFeed={(reelId) => {
              setTargetReelId(reelId ?? null);
              setActiveView("home");
            }}
          />
        ) : activeView === "notifications" ? (
          <NotificationsPanel />
        ) : activeView === "create" ? (
          <CreatePostPanel userName={userName} onClose={() => setActiveView("home")} />
        ) : extraViewData ? (
          <InternalViewPanel title={extraViewData.title} subtitle={extraViewData.subtitle} />
        ) : null}
      </div>
    </main>
  );
}
