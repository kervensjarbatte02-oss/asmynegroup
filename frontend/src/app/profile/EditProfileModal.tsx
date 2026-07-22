"use client";

import { useState, useRef } from "react";
import { FiX, FiCamera } from "react-icons/fi";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userBio: string;
  userLocation?: string;
  userPhotoUrl?: string;
  userCoverImageUrl?: string;
  onSave: (data: {
    name: string;
    bio: string;
    location?: string;
    website?: string;
    photoDataUrl?: string;
    coverImageUrl?: string;
  }) => Promise<void>;
};

export default function EditProfileModal({
  isOpen,
  onClose,
  userName,
  userBio,
  userLocation,
  userPhotoUrl,
  userCoverImageUrl,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(userName);
  const [bio, setBio] = useState(userBio);
  const [location, setLocation] = useState(userLocation || "");
  const [website, setWebsite] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [coverImage, setCoverImage] = useState(userCoverImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState(userPhotoUrl || "");

  const handleCoverPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePhotoClick = () => {
    profilePhotoInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setCoverImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setProfilePhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        name,
        bio,
        location,
        website,
        photoDataUrl: profilePhoto || "",
        coverImageUrl: coverImage || "",
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-4 sm:pt-10">
      <div className="scrollbar-hidden relative w-full max-h-[90vh] max-w-[580px] overflow-y-auto rounded-lg bg-[#170a21] text-[#f3e9f9] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#58326d]/45 bg-[#170a21] px-4 py-4 sm:px-6">
          <h2 className="text-xl font-bold text-[#fff8ff]">Edit profile</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#bc9acb] transition hover:bg-[#34194a] hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-4 py-6 sm:px-6">
          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={profilePhotoInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="hidden"
          />

          {/* Cover Photo Section */}
          <div className="relative -mx-4 -mt-6 mb-6 sm:-mx-6">
            <div 
              className="h-24 bg-gradient-to-br from-[#34194a] to-[#6f3f88] bg-cover bg-center relative cursor-pointer hover:opacity-80 transition sm:h-28"
              style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}
              onClick={handleCoverPhotoClick}
            >
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/30">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCoverPhotoClick();
                  }}
                  className="h-12 w-12 rounded-full bg-gray-600/80 hover:bg-gray-700 flex items-center justify-center text-white transition"
                >
                  <FiCamera size={24} />
                </button>
                {coverImage && (
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverImage("");
                    }}
                    className="h-12 w-12 rounded-full bg-gray-600/80 hover:bg-gray-700 flex items-center justify-center text-white transition"
                  >
                    <FiX size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Photo Section */}
          <div className="flex items-center justify-between pb-6 border-b border-[#58326d]/45">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-[#34194a] border-4 border-[#6f3f88] flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition"
                  onClick={handleProfilePhotoClick}
                >
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                  ) : userPhotoUrl ? (
                    <img src={userPhotoUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-[#b87bda]">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={handleProfilePhotoClick}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#6f3f88] hover:bg-[#7d4a96] flex items-center justify-center text-white transition border-2 border-[#170a21]">
                  <FiCamera size={14} />
                </button>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f3e9f9]">Edit your photo with Imagime</h3>
                <p className="text-xs text-[#a888b3]">Customize yourself in seconds</p>
                <button 
                  type="button"
                  onClick={handleProfilePhotoClick}
                  className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#b87bda] hover:text-[#f3e9f9] transition">
                  <FiCamera size={16} />
                  Edit Photo
                </button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="edit-name" className="block text-sm font-semibold text-[#f3e9f9] mb-2">
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-[#58326d]/45 bg-[#241033] px-4 py-3 text-[#f3e9f9] placeholder-[#bc9acb] outline-none transition focus:border-[#b87bda] focus:ring-1 focus:ring-[#b87bda]"
              placeholder="Your name"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="edit-bio" className="block text-sm font-semibold text-[#f3e9f9] mb-2">
              Bio
            </label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#58326d]/45 bg-[#241033] px-4 py-3 text-[#f3e9f9] placeholder-[#bc9acb] outline-none transition focus:border-[#b87bda] focus:ring-1 focus:ring-[#b87bda]"
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="edit-location" className="block text-sm font-semibold text-[#f3e9f9] mb-2">
              Location
            </label>
            <input
              id="edit-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-[#58326d]/45 bg-[#241033] px-4 py-3 text-[#f3e9f9] placeholder-[#bc9acb] outline-none transition focus:border-[#b87bda] focus:ring-1 focus:ring-[#b87bda]"
              placeholder="City, Country"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="edit-website" className="block text-sm font-semibold text-[#f3e9f9] mb-2">
              Website
            </label>
            <input
              id="edit-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-lg border border-[#58326d]/45 bg-[#241033] px-4 py-3 text-[#f3e9f9] placeholder-[#bc9acb] outline-none transition focus:border-[#b87bda] focus:ring-1 focus:ring-[#b87bda]"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
