"use client";

import { useState } from "react";

type ProfileFollowButtonProps = {
  userId: string;
  initialFollowing: boolean;
  className?: string;
};

export default function ProfileFollowButton({ userId, initialFollowing, className }: ProfileFollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleToggleFollow() {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/users/${encodeURIComponent(userId)}/follow`, {
        method: following ? "DELETE" : "POST",
      });

      const data = (await response.json()) as { following?: boolean };
      if (!response.ok) {
        return;
      }

      setFollowing(Boolean(data.following));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleToggleFollow()}
      className={
        className ??
        `rounded-full px-5 py-2 text-base font-semibold transition ${
          following
            ? "border border-[#536471] bg-transparent text-[#e7edf3] hover:bg-[#111827]"
            : "bg-[#eff3f4] text-[#0f1419] hover:bg-[#dce2e5]"
        } disabled:cursor-not-allowed disabled:opacity-70`
      }
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
