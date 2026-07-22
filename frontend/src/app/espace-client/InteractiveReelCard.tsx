"use client";

import {
  FiBookmark,
  FiChevronRight,
  FiCopy,
  FiHeart,
  FiMail,
  FiMessageCircle,
  FiSearch,
  FiSend,
  FiSmile,
  FiX,
} from "react-icons/fi";
import { BsMessenger } from "react-icons/bs";
import { FaFacebookF, FaThreads, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useRef, useState } from "react";

type InteractiveReelCardProps = {
  userName: string;
  reelId: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  trackTitle: string;
  caption: string;
  userAvatar?: string;
};

type ReelComment = {
  id?: string;
  parentCommentId?: string | null;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string | Date;
  likeCount?: number;
  liked?: boolean;
};

type ShareRecipient = {
  id: string;
  name: string;
  avatar: string;
};

function formatRelativeTime(value: string | Date) {
  const date = new Date(value);
  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return "now";
  }

  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }

  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

function formatCount(value: number) {
  if (value < 1000) {
    return String(value);
  }

  if (value < 10000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}K`;
  }

  return `${Math.round(value / 1000)}K`;
}

export default function InteractiveReelCard({
  userName,
  reelId,
  mediaType,
  mediaSrc,
  trackTitle,
  caption,
  userAvatar,
}: InteractiveReelCardProps) {
  const [likeCount, setLikeCount] = useState(1900);
  const [commentCount, setCommentCount] = useState(82);
  const [shareCount, setShareCount] = useState(23);
  const [liked, setLiked] = useState(false);
  const [submittingLike, setSubmittingLike] = useState(false);
  const [updatingInteraction, setUpdatingInteraction] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState<ReelComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [stickersOpen, setStickersOpen] = useState(false);
  const [updatingCommentId, setUpdatingCommentId] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; userName: string } | null>(null);
  const [panelMessage, setPanelMessage] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareSearch, setShareSearch] = useState("");
  const [shareRecipients, setShareRecipients] = useState<ShareRecipient[]>([]);
  const [loadingShareRecipients, setLoadingShareRecipients] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  const cardRef = useRef<HTMLElement | null>(null);
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  function resetVideoPlayback(video: HTMLVideoElement | null) {
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
  }

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("asmyne-video-muted");
      if (stored === "false") {
        setIsMuted(false);
      } else if (stored === "true") {
        setIsMuted(true);
      }
    } catch {
      // Ignore storage errors and keep default value.
    }
  }, []);

  useEffect(() => {
    const handleMuteChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ muted: boolean }>;
      if (typeof customEvent.detail?.muted === "boolean") {
        setIsMuted(customEvent.detail.muted);
      }
    };

    window.addEventListener("asmyne-video-muted-change", handleMuteChanged as EventListener);
    return () => {
      window.removeEventListener("asmyne-video-muted-change", handleMuteChanged as EventListener);
    };
  }, []);

  const stickers = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
    "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗",
    "🤩", "🤔", "🫡", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣",
    "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛",
    "😜", "🤪", "😝", "🤑", "🤠", "🥳", "😤", "😡", "🤬", "🤯",
    "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😭", "😓", "🤤",
    "😇", "🤓", "🫶", "🙌", "👏", "👍", "👎", "👊", "✌️", "🤟",
    "🙏", "💪", "🔥", "💯", "✨", "⭐", "🌈", "⚡", "🎉", "🎊",
    "🎵", "🎶", "💃", "🕺", "💎", "👑", "🌹", "🌸", "🌺", "🍀",
    "❤️", "🩷", "🧡", "💛", "💚", "🩵", "💙", "💜", "🤍", "🖤",
  ];

  const likeText = useMemo(() => formatCount(likeCount), [likeCount]);
  const othersCountText = useMemo(() => formatCount(likeCount + 21), [likeCount]);
  const displayComments = comments;

  const commentsByParent = useMemo(() => {
    const grouped = new Map<string, ReelComment[]>();

    for (const item of displayComments) {
      const parentKey = item.parentCommentId ?? "ROOT";
      const list = grouped.get(parentKey) ?? [];
      list.push(item);
      grouped.set(parentKey, list);
    }

    return grouped;
  }, [displayComments]);

  const filteredShareRecipients = useMemo(() => {
    const query = shareSearch.trim().toLowerCase();
    if (!query) {
      return shareRecipients;
    }

    return shareRecipients.filter((item) => item.name.toLowerCase().includes(query));
  }, [shareRecipients, shareSearch]);

  useEffect(() => {
    let mounted = true;

    async function loadLikes() {
      try {
        const response = await fetch(`/api/reels/${encodeURIComponent(reelId)}/like`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          likeCount?: number;
          commentCount?: number;
          shareCount?: number;
          liked?: boolean;
        };

        if (!mounted) {
          return;
        }

        if (typeof data.likeCount === "number") {
          setLikeCount(data.likeCount);
        }

        if (typeof data.commentCount === "number") {
          setCommentCount(data.commentCount);
        }

        if (typeof data.shareCount === "number") {
          setShareCount(data.shareCount);
        }

        if (typeof data.liked === "boolean") {
          setLiked(data.liked);
        }
      } catch {
        // Keep local fallback values when API cannot be reached.
      }
    }

    loadLikes();

    return () => {
      mounted = false;
    };
  }, [reelId]);

  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.muted = isMuted;
    }

    if (modalVideoRef.current) {
      modalVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (mediaType !== "video" || !cardRef.current) {
      return;
    }

    const target = cardRef.current;
    const feedRoot = document.getElementById("espace-feed-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.4);
        setIsInView(visible);

        if (!visible && mainVideoRef.current) {
          mainVideoRef.current.pause();
        }
      },
      {
        root: feedRoot,
        threshold: [0, 0.2, 0.4, 0.6, 1],
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [mediaType]);

  useEffect(() => {
    if (mediaType !== "video") {
      return;
    }

    const handleActiveVideoChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ reelId: string }>;
      const activeReelId = customEvent.detail?.reelId;

      if (activeReelId && activeReelId !== reelId && mainVideoRef.current) {
        resetVideoPlayback(mainVideoRef.current);
      }
    };

    window.addEventListener("asmyne-active-video", handleActiveVideoChange as EventListener);

    return () => {
      window.removeEventListener("asmyne-active-video", handleActiveVideoChange as EventListener);
    };
  }, [mediaType, reelId]);

  useEffect(() => {
    if (mediaType !== "video" || !mainVideoRef.current) {
      return;
    }

    if (isInView) {
      window.dispatchEvent(new CustomEvent("asmyne-active-video", { detail: { reelId } }));
      void mainVideoRef.current.play().catch(() => undefined);
      return;
    }

    resetVideoPlayback(mainVideoRef.current);
  }, [isInView, mediaType, reelId]);

  useEffect(() => {
    if (!mainVideoRef.current) {
      return;
    }

    if (commentsOpen) {
      mainVideoRef.current.pause();
      return;
    }

    if (mediaType === "video" && isInView) {
      void mainVideoRef.current.play().catch(() => undefined);
    }
  }, [commentsOpen, mediaType, isInView]);

  useEffect(() => {
    const shouldLock = commentsOpen || shareOpen;
    const previousOverflow = document.body.style.overflow;

    if (shouldLock) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [commentsOpen, shareOpen]);

  async function handleLike() {
    if (submittingLike) {
      return;
    }

    setSubmittingLike(true);

    try {
      const response = await fetch(`/api/reels/${encodeURIComponent(reelId)}/like`, {
        method: liked ? "DELETE" : "POST",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setPanelMessage("Connectez-vous pour liker.");
        }
        return;
      }

      setPanelMessage("");

      const data = (await response.json()) as {
        likeCount?: number;
        commentCount?: number;
        shareCount?: number;
        liked?: boolean;
      };

      if (typeof data.likeCount === "number") {
        setLikeCount(data.likeCount);
      }

      if (typeof data.commentCount === "number") {
        setCommentCount(data.commentCount);
      }

      if (typeof data.shareCount === "number") {
        setShareCount(data.shareCount);
      }

      if (typeof data.liked === "boolean") {
        setLiked(data.liked);
      }
    } finally {
      setSubmittingLike(false);
    }
  }

  async function handleInteraction(kind: "comment" | "share") {
    if (updatingInteraction) {
      return;
    }

    setUpdatingInteraction(true);

    try {
      const response = await fetch(`/api/reels/${encodeURIComponent(reelId)}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setPanelMessage("Connectez-vous pour interagir.");
        }
        return;
      }

      setPanelMessage("");

      const data = (await response.json()) as {
        likeCount?: number;
        commentCount?: number;
        shareCount?: number;
      };

      if (typeof data.likeCount === "number") {
        setLikeCount(data.likeCount);
      }

      if (typeof data.commentCount === "number") {
        setCommentCount(data.commentCount);
      }

      if (typeof data.shareCount === "number") {
        setShareCount(data.shareCount);
      }
    } finally {
      setUpdatingInteraction(false);
    }
  }

  async function loadComments() {
    setLoadingComments(true);

    try {
      const response = await fetch(`/api/reels/${encodeURIComponent(reelId)}/comments`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { comments?: ReelComment[] };
      setComments(data.comments ?? []);
      setPanelMessage("");
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleOpenComments() {
    setCommentsOpen(true);
    await loadComments();
  }

  async function loadShareRecipients() {
    setLoadingShareRecipients(true);
    try {
      const response = await fetch("/api/statuses", { cache: "no-store" });
      if (!response.ok) {
        setShareRecipients([]);
        return;
      }

      const data = (await response.json()) as {
        statuses?: Array<{ id?: string; name?: string; avatar?: string }>;
      };

      const mapped = (data.statuses ?? [])
        .map((item, index) => ({
          id: item.id?.trim() || `recipient-${index}`,
          name: item.name?.trim() || "Client",
          avatar: item.avatar?.trim() || "",
        }))
        .filter((item) => item.name);

      setShareRecipients(mapped);
    } finally {
      setLoadingShareRecipients(false);
    }
  }

  async function handleOpenShare() {
    setShareOpen(true);
    setShareMessage("");
    await loadShareRecipients();
  }

  async function handleCopyLinkShare() {
    const url = `${window.location.origin}/espace-client?reel=${encodeURIComponent(reelId)}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
      await handleInteraction("share");
      setShareMessage("Lien copie.");
    } catch {
      setShareMessage("Impossible de copier le lien.");
    }
  }

  async function handleExternalShare(kind: "whatsapp" | "email" | "x" | "facebook" | "messenger" | "threads") {
    const url = `${window.location.origin}/espace-client?reel=${encodeURIComponent(reelId)}`;
    const text = encodeURIComponent("Regarde ce reel sur Asmyne");
    const encodedUrl = encodeURIComponent(url);

    const targetUrl =
      kind === "whatsapp"
        ? `https://wa.me/?text=${text}%20${encodedUrl}`
        : kind === "email"
          ? `mailto:?subject=Partage%20Asmyne&body=${text}%20${encodedUrl}`
          : kind === "x"
            ? `https://x.com/intent/tweet?text=${text}&url=${encodedUrl}`
            : kind === "facebook"
              ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
              : kind === "messenger"
                ? `https://www.messenger.com/share?link=${encodedUrl}`
                : `https://www.threads.net/intent/post?text=${text}%20${encodedUrl}`;

    window.open(targetUrl, "_blank", "noopener,noreferrer");
    await handleInteraction("share");
    setShareMessage("Partage envoye.");
  }

  async function handleSendToRecipient(recipient: ShareRecipient) {
    await handleInteraction("share");
    setShareMessage(`Envoye a ${recipient.name}.`);
  }

  function handleToggleMute() {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    try {
      window.localStorage.setItem("asmyne-video-muted", String(nextMuted));
    } catch {
      // Ignore storage errors.
    }

    window.dispatchEvent(new CustomEvent("asmyne-video-muted-change", { detail: { muted: nextMuted } }));

    if (mainVideoRef.current) {
      void mainVideoRef.current.play().catch(() => undefined);
    }

    if (modalVideoRef.current) {
      void modalVideoRef.current.play().catch(() => undefined);
    }
  }

  async function handleSubmitComment() {
    const text = newComment.trim();
    if (!text || submittingComment) {
      return;
    }

    setSubmittingComment(true);

    try {
      const response = await fetch(`/api/reels/${encodeURIComponent(reelId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, parentCommentId: replyingTo?.id ?? null }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setPanelMessage("Connectez-vous pour commenter.");
        }
        return;
      }

      setPanelMessage("");

      const data = (await response.json()) as {
        comment?: ReelComment;
        commentCount?: number;
      };

      if (data.comment) {
        setComments((prev) => [data.comment as ReelComment, ...prev]);
      }

      if (typeof data.commentCount === "number") {
        setCommentCount(data.commentCount);
      }

      setNewComment("");
      setStickersOpen(false);
      setReplyingTo(null);
    } finally {
      setSubmittingComment(false);
    }
  }

  function handleAddSticker(sticker: string) {
    setNewComment((current) => `${current}${current ? " " : ""}${sticker}`);
  }

  async function handleCommentLike(commentId: string, currentlyLiked: boolean) {
    if (!commentId || updatingCommentId) {
      return;
    }

    setUpdatingCommentId(commentId);

    try {
      const response = await fetch(
        `/api/reels/${encodeURIComponent(reelId)}/comments/${encodeURIComponent(commentId)}/like`,
        { method: currentlyLiked ? "DELETE" : "POST" },
      );

      if (!response.ok) {
        if (response.status === 401) {
          setPanelMessage("Connectez-vous pour liker les commentaires.");
        }
        return;
      }

      setPanelMessage("");

      const data = (await response.json()) as {
        commentId?: string;
        likeCount?: number;
        liked?: boolean;
      };

      if (!data.commentId) {
        return;
      }

      setComments((prev) =>
        prev.map((item) =>
          item.id === data.commentId
            ? {
                ...item,
                likeCount: typeof data.likeCount === "number" ? data.likeCount : item.likeCount ?? 0,
                liked: typeof data.liked === "boolean" ? data.liked : item.liked ?? false,
              }
            : item,
        ),
      );
    } finally {
      setUpdatingCommentId("");
    }
  }

  function renderCommentNodes(parentId: string | null, depth: number, trail: Set<string> = new Set()) {
    const key = parentId ?? "ROOT";
    const nodes = commentsByParent.get(key) ?? [];

    return nodes.map((item, index) => (
      <div
        key={`${item.id ?? `${item.userName}-${item.createdAt}-${index}`}`}
        className="flex items-start gap-3"
        style={{ marginLeft: depth > 0 ? Math.min(depth, 3) * 22 : 0 }}
      >
        {item.userAvatar ? (
          <img
            src={item.userAvatar}
            alt={item.userName}
            className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#351b3f] text-xs font-semibold text-white">
            {item.userName.slice(0, 1).toUpperCase()}
          </span>
        )}

        <div className="flex-1">
          <p className="text-sm leading-6 text-white/95">
            <span className="font-semibold text-white">{item.userName}</span> {item.text}
          </p>

          <div className="mt-1 flex items-center gap-3 text-xs text-white/55">
            <span>{formatRelativeTime(item.createdAt)}</span>
            <button
              type="button"
              className="hover:text-white/80"
              onClick={() => setReplyingTo(item.id ? { id: item.id, userName: item.userName } : null)}
              disabled={!item.id}
            >
              Reply
            </button>
            {typeof item.likeCount === "number" ? (
              <span>{item.likeCount > 0 ? `${item.likeCount} like${item.likeCount > 1 ? "s" : ""}` : ""}</span>
            ) : null}
          </div>

          <div className="mt-3 space-y-3">
            {item.id && !trail.has(item.id)
              ? renderCommentNodes(
                  item.id,
                  depth + 1,
                  new Set([...trail, item.id]),
                )
              : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCommentLike(item.id ?? "", Boolean(item.liked))}
          disabled={!item.id || updatingCommentId === item.id}
          className={`${item.liked ? "text-pink-300" : "text-white/65 hover:text-white"}`}
          aria-label="Like comment"
        >
          <FiHeart size={16} />
        </button>
      </div>
    ));
  }

  return (
    <article
      ref={cardRef}
      data-reel-id={reelId}
      className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[26px] border border-white/10 bg-transparent shadow-2xl"
    >
      <div className="relative aspect-[9/16] w-full">
        {mediaType === "video" ? (
          <video
            ref={mainVideoRef}
            src={mediaSrc}
            className="h-full w-full object-cover"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => {
              if (isInView) {
                void mainVideoRef.current?.play().catch(() => undefined);
              }
            }}
          />
        ) : (
          <img src={mediaSrc} alt={userName} className="h-full w-full object-cover" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />

        <div className="absolute left-3 top-3 z-10 flex items-center gap-2 text-white">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-9 w-9 overflow-hidden rounded-full border border-white/80 object-cover"
            />
          ) : (
            <div className="h-9 w-9 overflow-hidden rounded-full border border-white/80 bg-[#2a1331]" />
          )}
          <div className="leading-tight">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-white/80">{trackTitle}</p>
          </div>
        </div>

        <button
          type="button"
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-xl text-white"
          aria-label="More"
        >
          •••
        </button>

        {mediaType === "video" ? (
          <>
            <button
              type="button"
              className="absolute bottom-3 left-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-sm font-bold text-white"
              aria-label="Audio"
            >
              ♫
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="absolute bottom-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-sm text-white"
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? "🔇" : "🔈"}
            </button>
          </>
        ) : null}
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3 text-white backdrop-blur-sm bg-black/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleLike}
              disabled={submittingLike}
              className={`inline-flex items-center gap-2 text-base font-semibold ${
                liked ? "text-pink-300" : "text-white"
              }`}
              aria-label="Like this post"
            >
              <FiHeart size={22} />
              <span>{likeText}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenComments}
              className="inline-flex items-center gap-2 text-base font-semibold text-white"
            >
              <FiMessageCircle size={22} />
              <span>{formatCount(commentCount)}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenShare}
              className="inline-flex items-center gap-2 text-base font-semibold text-white"
            >
              <FiSend size={22} />
              <span>{formatCount(shareCount)}</span>
            </button>
          </div>

          <button type="button" className="text-white" aria-label="Save post">
            <FiBookmark size={21} />
          </button>
        </div>

        <p className="text-sm text-white/90">
          Liked by <span className="font-semibold text-white">mira.scarlett</span> and{" "}
          <span className="font-semibold text-white">{othersCountText} others</span>
        </p>

        <div className="flex items-start gap-2 text-sm">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#351b3f] font-semibold text-white">
            {userName.slice(0, 1).toUpperCase()}
          </span>
          <p className="leading-6 text-white/95">
            <span className="font-semibold text-white">{userName}</span> {caption}
          </p>
        </div>
      </div>

      {commentsOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/70 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true">
          <div className="mx-auto grid h-[92vh] w-full max-w-[1060px] grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-[#161a25] md:grid-cols-[46%_54%]">
            <div className="relative hidden bg-black md:block">
              {mediaType === "video" ? (
                <video
                  ref={modalVideoRef}
                  src={mediaSrc}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                />
              ) : (
                <img src={mediaSrc} alt={userName} className="h-full w-full object-cover" />
              )}
            </div>

            <div className="flex min-h-0 flex-col bg-[#1d212c] text-white">
              <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-base font-semibold">{userName}</p>
                  <p className="text-sm text-white/75">{trackTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCommentsOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
                  aria-label="Close comments"
                >
                  <FiX size={18} />
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 pb-28">
                {loadingComments ? <p className="text-sm text-white/70">Chargement des commentaires...</p> : null}
                {!loadingComments && displayComments.length === 0 ? (
                  <p className="text-sm text-white/70">Aucun commentaire pour le moment.</p>
                ) : null}
                {panelMessage ? <p className="mt-2 text-sm text-pink-300">{panelMessage}</p> : null}

                <div className="space-y-4">
                  {renderCommentNodes(null, 0)}
                </div>
              </div>

              <div className="sticky bottom-0 border-t border-white/10 bg-[#1d212c] px-4 py-3">
                <div className="flex items-center gap-4 pb-3 text-white">
                  <button type="button" onClick={handleLike} className={liked ? "text-pink-300" : "text-white"}>
                    <FiHeart size={23} />
                  </button>
                  <button type="button" onClick={handleOpenComments}>
                    <FiMessageCircle size={23} />
                  </button>
                  <button type="button" onClick={handleOpenShare}>
                    <FiSend size={23} />
                  </button>
                  <button type="button" className="ml-auto">
                    <FiBookmark size={22} />
                  </button>
                </div>

                <p className="text-sm text-white/90">
                  Liked by <span className="font-semibold text-white">mira.scarlett</span> and{" "}
                  <span className="font-semibold text-white">{othersCountText} others</span>
                </p>

                {replyingTo ? (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-[#2c3242] px-3 py-2 text-xs text-white/80">
                    <span>
                      Replying to <span className="font-semibold text-white">{replyingTo.userName}</span>
                    </span>
                    <button type="button" onClick={() => setReplyingTo(null)} className="text-white/80 hover:text-white">
                      Cancel
                    </button>
                  </div>
                ) : null}

                <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setStickersOpen((value) => !value)}
                    className="text-white/80 hover:text-white"
                    aria-label="Open stickers"
                  >
                    <FiSmile size={20} />
                  </button>
                  <input
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    placeholder={replyingTo ? `Reply to ${replyingTo.userName}...` : "Add a comment..."}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                  />
                  <button
                    type="button"
                    onClick={() => setStickersOpen((value) => !value)}
                    className="rounded-md border border-white/15 px-2 py-1 text-xs font-semibold text-white/85 hover:bg-white/10"
                  >
                    Sticker
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="text-sm font-semibold text-[#9ac0ff] disabled:opacity-40"
                  >
                    Post
                  </button>
                </div>

                {stickersOpen ? (
                  <div className="mt-2 grid max-h-52 grid-cols-8 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-[#252a38] p-2">
                    {stickers.map((sticker, index) => (
                      <button
                        key={`${sticker}-${index}`}
                        type="button"
                        onClick={() => handleAddSticker(sticker)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-lg hover:bg-white/15"
                        aria-label={`Add sticker ${sticker}`}
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {shareOpen ? (
        <div className="fixed inset-0 z-[80] bg-black/70 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true">
          <div className="mx-auto w-full max-w-[780px] overflow-hidden rounded-3xl border border-white/10 bg-[#1d212c] text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                aria-label="Close share panel"
              >
                <FiX size={18} />
              </button>
              <p className="text-lg font-semibold">Share</p>
              <div className="h-9 w-9" />
            </div>

            <div className="border-b border-white/10 px-4 py-3">
              <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <FiSearch size={16} className="text-white/60" />
                <input
                  value={shareSearch}
                  onChange={(event) => setShareSearch(event.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
              </label>
            </div>

            <div className="max-h-[320px] overflow-y-auto px-4 py-4">
              {loadingShareRecipients ? <p className="text-sm text-white/65">Chargement...</p> : null}
              {!loadingShareRecipients && filteredShareRecipients.length === 0 ? (
                <p className="text-sm text-white/65">Aucun destinataire trouve.</p>
              ) : null}

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {filteredShareRecipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    type="button"
                    onClick={() => handleSendToRecipient(recipient)}
                    className="rounded-xl bg-white/5 p-3 text-center transition hover:bg-white/10"
                  >
                    {recipient.avatar ? (
                      <img
                        src={recipient.avatar}
                        alt={recipient.name}
                        className="mx-auto h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#351b3f] text-sm font-semibold">
                        {recipient.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="mt-2 block truncate text-xs text-white/90">{recipient.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="flex items-start gap-5 overflow-x-auto pb-1">
                <button type="button" onClick={handleCopyLinkShare} className="flex min-w-[64px] flex-col items-center gap-2">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                    <FiCopy size={17} />
                  </span>
                  <span className="text-xs text-white/90">Copy Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExternalShare("whatsapp")}
                  className="flex min-w-[64px] flex-col items-center gap-2"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                    <FaWhatsapp size={18} />
                  </span>
                  <span className="text-xs text-white/90">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExternalShare("email")}
                  className="flex min-w-[64px] flex-col items-center gap-2"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                    <FiMail size={17} />
                  </span>
                  <span className="text-xs text-white/90">Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExternalShare("x")}
                  className="flex min-w-[64px] flex-col items-center gap-2"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                    <FaXTwitter size={16} />
                  </span>
                  <span className="text-xs text-white/90">X</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExternalShare("facebook")}
                  className="flex min-w-[64px] flex-col items-center gap-2"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                    <FaFacebookF size={16} />
                  </span>
                  <span className="text-xs text-white/90">Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExternalShare("messenger")}
                  className="flex min-w-[64px] flex-col items-center gap-2"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                    <BsMessenger size={16} />
                  </span>
                  <span className="text-xs text-white/90">Messenger</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExternalShare("threads")}
                  className="flex min-w-[64px] flex-col items-center gap-2"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                    <FaThreads size={16} />
                  </span>
                  <span className="text-xs text-white/90">Threads</span>
                </button>

                <button type="button" className="flex min-w-[48px] flex-col items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    <FiChevronRight size={15} />
                  </span>
                  <span className="text-xs text-white/60">More</span>
                </button>
              </div>
              {shareMessage ? <p className="mt-2 text-xs text-pink-300">{shareMessage}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
