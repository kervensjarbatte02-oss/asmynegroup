"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";

type ProfileEditButtonProps = {
  profileUserId: string;
  profileName: string;
  profileStatusText: string;
  profileSearchLocation?: string;
  profilePhotoUrl?: string;
  profileCoverImageUrl?: string;
  isOwnProfile: boolean;
};

export default function ProfileEditButton({
  profileUserId,
  profileName,
  profileStatusText,
  profileSearchLocation,
  profilePhotoUrl,
  profileCoverImageUrl,
  isOwnProfile,
}: ProfileEditButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (data: {
    name: string;
    bio: string;
    location?: string;
    website?: string;
    photoDataUrl?: string;
    coverImageUrl?: string;
  }) => {
    try {
      const response = await fetch("/api/users/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to update profile");
      }

      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  };

  if (!isOwnProfile) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-full border border-[#7a4a96] px-3 py-1 text-xs font-semibold text-[#f7e8ff] transition hover:bg-[#34194a]"
      >
        Edit profile
      </button>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName={profileName}
        userBio={profileStatusText}
        userLocation={profileSearchLocation}
        userPhotoUrl={profilePhotoUrl}
        userCoverImageUrl={profileCoverImageUrl}
        onSave={handleSave}
      />
    </>
  );
}
