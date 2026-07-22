"use client";

import { useMemo, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import {
  FiBell,
  FiChevronRight,
  FiDollarSign,
  FiDownload,
  FiEyeOff,
  FiGlobe,
  FiHeart,
  FiHelpCircle,
  FiLock,
  FiMessageCircle,
  FiSearch,
  FiShield,
  FiTag,
  FiUser,
  FiX,
} from "react-icons/fi";

type CategoryKey =
  | "account"
  | "monetization"
  | "premium"
  | "subscriptions"
  | "security"
  | "privacy"
  | "notifications"
  | "accessibility"
  | "resources"
  | "help";

type Category = {
  key: CategoryKey;
  label: string;
  icon: ReactNode;
};

type AccountProfile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  location: string;
  bio: string;
};

type ModalType = "none" | "account-info" | "password" | "deactivate";

type StripeConnectStatus = {
  status: "not_connected" | "connected";
  verificationStatus: "pending" | "verified" | "restricted" | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  currentlyDue?: string[];
  eventuallyDue?: string[];
};

type StripeBalance = {
  available: Array<{ amount: number; currency: string }>;
  pending: Array<{ amount: number; currency: string }>;
  payouts: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    arrivalDate: number;
  }>;
};

type WhoOption = "everyone" | "followers" | "nobody";
type WhoReelsOption = "everyone" | "followers";

type PrivacySettings = {
  isPrivateAccount: boolean;
  whoCanMessage: WhoOption;
  whoCanSeeReels: WhoReelsOption;
  whoCanTagMe: WhoOption;
  whoCanMentionMe: WhoOption;
  showActivityStatus: boolean;
  allowDataSharing: boolean;
};

const PRIVACY_DEFAULTS: PrivacySettings = {
  isPrivateAccount: false,
  whoCanMessage: "everyone",
  whoCanSeeReels: "everyone",
  whoCanTagMe: "everyone",
  whoCanMentionMe: "everyone",
  showActivityStatus: true,
  allowDataSharing: true,
};

type NotificationSettings = {
  emailNewFollower: boolean;
  emailMessages: boolean;
  emailTips: boolean;
  emailWeeklyDigest: boolean;
  pushNewFollower: boolean;
  pushMessages: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushTags: boolean;
  pushMentions: boolean;
  pushTips: boolean;
  pushViewMilestones: boolean;
};

const NOTIF_DEFAULTS: NotificationSettings = {
  emailNewFollower: true,
  emailMessages: true,
  emailTips: true,
  emailWeeklyDigest: true,
  pushNewFollower: true,
  pushMessages: true,
  pushLikes: true,
  pushComments: true,
  pushTags: true,
  pushMentions: true,
  pushTips: true,
  pushViewMilestones: true,
};

type LoginEntry = {
  ip: string;
  userAgent: string;
  timestamp: string;
};

type AccessibilitySettings = {
  theme: "dark" | "light" | "system";
  reduceMotion: boolean;
  largerText: boolean;
  highContrast: boolean;
  language: "en" | "fr" | "es" | "de" | "pt";
  fontSize: "sm" | "base" | "lg" | "xl";
};

const ACCESS_DEFAULTS: AccessibilitySettings = {
  theme: "dark",
  reduceMotion: false,
  largerText: false,
  highContrast: false,
  language: "en",
  fontSize: "base",
};

const categories: Category[] = [
  { key: "account", label: "Your account", icon: <FiUser /> },
  { key: "monetization", label: "Monetization", icon: <FiDollarSign /> },
  { key: "premium", label: "Premium", icon: <FiHeart /> },
  { key: "subscriptions", label: "Creator Subscriptions", icon: <FiDollarSign /> },
  { key: "security", label: "Security and account access", icon: <FiShield /> },
  { key: "privacy", label: "Privacy and safety", icon: <FiLock /> },
  { key: "notifications", label: "Notifications", icon: <FiBell /> },
  { key: "accessibility", label: "Accessibility, display, and languages", icon: <FiGlobe /> },
  { key: "resources", label: "Additional resources", icon: <FiHelpCircle /> },
  { key: "help", label: "Help Center", icon: <FiHelpCircle /> },
];

const defaultProfile: AccountProfile = {
  name: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  location: "",
  bio: "",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6f3f88] focus:ring-offset-2 focus:ring-offset-black ${
        checked ? "bg-[#6f3f88]" : "bg-neutral-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ToggleRow({
  icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-transparent bg-neutral-900 px-4 py-4 sm:px-5">
      <div className="flex items-center gap-4 pr-4">
        <span className="text-lg text-neutral-400">{icon}</span>
        <div>
          <div className="font-semibold text-sm text-white">{title}</div>
          <div className="text-neutral-500 text-xs mt-0.5">{desc}</div>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SelectRow({
  icon,
  title,
  desc,
  value,
  options,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-transparent bg-neutral-900 px-4 py-4 sm:px-5">
      <div className="flex items-center gap-4 pr-4">
        <span className="text-lg text-neutral-400">{icon}</span>
        <div>
          <div className="font-semibold text-sm text-white">{title}</div>
          <div className="text-neutral-500 text-xs mt-0.5">{desc}</div>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="shrink-0 rounded-xl bg-neutral-800 px-3 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-[#6f3f88] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-transparent bg-neutral-900 px-4 py-4 text-left transition-colors hover:border-neutral-700 hover:bg-neutral-800 sm:px-5"
    >
      <div className="flex items-center gap-4">
        <span className="text-lg text-neutral-100">{icon}</span>
        <div>
          <div className="font-semibold text-base text-white">{title}</div>
          <div className="text-neutral-400 text-sm">{desc}</div>
        </div>
      </div>
      <FiChevronRight className="text-neutral-600" />
    </button>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  danger,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className={`relative w-full max-w-[480px] rounded-2xl border ${danger ? "border-red-800/60 bg-[#1a0808]" : "border-neutral-800 bg-neutral-950"} p-6 shadow-2xl`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className={`text-lg font-bold ${danger ? "text-red-200" : "text-white"}`}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <FiX size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [selected, setSelected] = useState<CategoryKey>(() => {
    if (typeof window === "undefined") return "account";
    const saved = localStorage.getItem("asmyne_settings_selected");
    return (saved as CategoryKey) || "account";
  });
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalType>("none");

  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState("");

  const [profile, setProfile] = useState<AccountProfile>(defaultProfile);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const [downloadStatus, setDownloadStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [downloadError, setDownloadError] = useState("");

  const [privacy, setPrivacy] = useState<PrivacySettings>(PRIVACY_DEFAULTS);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacySaveStatus, setPrivacySaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const privacySaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [notif, setNotif] = useState<NotificationSettings>(NOTIF_DEFAULTS);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaveStatus, setNotifSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const notifSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([]);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [twoFaSaving, setTwoFaSaving] = useState(false);
  const [revokeStatus, setRevokeStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const [access, setAccess] = useState<AccessibilitySettings>(ACCESS_DEFAULTS);
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessSaveStatus, setAccessSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const accessSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [stripeStatus, setStripeStatus] = useState<StripeConnectStatus | null>(null);
  const [stripeBalance, setStripeBalance] = useState<StripeBalance | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeSaving, setStripeSaving] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState("");

  const filteredCategories = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return categories;
    return categories.filter((item) => item.label.toLowerCase().includes(value));
  }, [query]);

  const selectedCategory = categories.find((item) => item.key === selected) ?? categories[0];

  const loadPrivacy = useCallback(async () => {
    setPrivacyLoading(true);
    try {
      const res = await fetch("/api/account/privacy");
      const data = await res.json();
      if (res.ok) setPrivacy({ ...PRIVACY_DEFAULTS, ...data.settings });
    } finally {
      setPrivacyLoading(false);
    }
  }, []);

  const loadNotif = useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/account/notifications");
      const data = await res.json();
      if (res.ok) setNotif({ ...NOTIF_DEFAULTS, ...data.settings });
    } finally {
      setNotifLoading(false);
    }
  }, []);

  const loadSecurity = useCallback(async () => {
    setSecurityLoading(true);
    try {
      const res = await fetch("/api/account/security");
      const data = await res.json();
      if (res.ok) {
        setTwoFactorEnabled(data.twoFactorEnabled ?? false);
        setLoginHistory(data.loginHistory ?? []);
      }
    } finally {
      setSecurityLoading(false);
    }
  }, []);

  const loadAccess = useCallback(async () => {
    setAccessLoading(true);
    try {
      const res = await fetch("/api/account/accessibility");
      const data = await res.json();
      if (res.ok) setAccess({ ...ACCESS_DEFAULTS, ...data.settings });
    } finally {
      setAccessLoading(false);
    }
  }, []);

  const loadStripe = useCallback(async () => {
    setStripeLoading(true);
    setStripeError("");
    try {
      const res = await fetch("/api/stripe-connect/account-status");
      const data = await res.json();
      if (res.ok) {
        setStripeStatus(data);
      }

      if (data.status === "connected") {
        const balRes = await fetch("/api/stripe-connect/balance");
        const balData = await balRes.json();
        if (balRes.ok) {
          setStripeBalance(balData);
        }
      }
    } catch (error) {
      setStripeError("Failed to load Stripe status");
    } finally {
      setStripeLoading(false);
    }
  }, []);

  const createStripeAccount = useCallback(async () => {
    setStripeSaving(true);
    setStripeError("");
    try {
      const res = await fetch("/api/stripe-connect/create-account", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");

      // Récupérer le lien d'onboarding
      const linkRes = await fetch("/api/stripe-connect/onboarding-link", { method: "POST" });
      const linkData = await linkRes.json();
      if (!linkRes.ok) throw new Error(linkData.error || "Failed to get onboarding link");

      setOnboardingUrl(linkData.url);
      // Charger le statut pour voir les changements
      await loadStripe();
    } catch (error) {
      setStripeError(error instanceof Error ? error.message : "Failed to create Stripe account");
    } finally {
      setStripeSaving(false);
    }
  }, [loadStripe]);

  // Persist selected section to localStorage
  useEffect(() => {
    localStorage.setItem("asmyne_settings_selected", selected);
  }, [selected]);

  useEffect(() => {
    if (selected === "privacy") void loadPrivacy();
    if (selected === "notifications") void loadNotif();
    if (selected === "security") void loadSecurity();
    if (selected === "accessibility") void loadAccess();
    if (selected === "monetization") void loadStripe();
  }, [selected, loadPrivacy, loadNotif, loadSecurity, loadAccess, loadStripe]);

  async function toggleTwoFactor(value: boolean) {
    setTwoFaSaving(true);
    try {
      const res = await fetch("/api/account/security", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twoFactorEnabled: value }),
      });
      if (res.ok) setTwoFactorEnabled(value);
    } finally {
      setTwoFaSaving(false);
    }
  }

  async function revokeAllSessions() {
    setRevokeStatus("loading");
    try {
      const res = await fetch("/api/account/security/revoke-sessions", { method: "POST" });
      if (!res.ok) throw new Error();
      setRevokeStatus("done");
      setTimeout(() => { window.location.href = "/connexion"; }, 1200);
    } catch {
      setRevokeStatus("error");
    }
  }

  const saveAccessField = useCallback(async (patch: Partial<AccessibilitySettings>) => {
    setAccess((prev) => ({ ...prev, ...patch }));
    setAccessSaveStatus("saving");
    if (accessSaveTimer.current) clearTimeout(accessSaveTimer.current);
    try {
      const res = await fetch("/api/account/accessibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setAccessSaveStatus("saved");
      accessSaveTimer.current = setTimeout(() => setAccessSaveStatus("idle"), 2500);
    } catch {
      setAccessSaveStatus("error");
    }
  }, []);

  const savePrivacyField = useCallback(async (patch: Partial<PrivacySettings>) => {
    setPrivacy((prev) => ({ ...prev, ...patch }));
    setPrivacySaveStatus("saving");
    if (privacySaveTimer.current) clearTimeout(privacySaveTimer.current);
    try {
      const res = await fetch("/api/account/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setPrivacySaveStatus("saved");
      privacySaveTimer.current = setTimeout(() => setPrivacySaveStatus("idle"), 2500);
    } catch {
      setPrivacySaveStatus("error");
    }
  }, []);

  const saveNotifField = useCallback(async (patch: Partial<NotificationSettings>) => {
    setNotif((prev) => ({ ...prev, ...patch }));
    setNotifSaveStatus("saving");
    if (notifSaveTimer.current) clearTimeout(notifSaveTimer.current);
    try {
      const res = await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setNotifSaveStatus("saved");
      notifSaveTimer.current = setTimeout(() => setNotifSaveStatus("idle"), 2500);
    } catch {
      setNotifSaveStatus("error");
    }
  }, []);

  function closeModal() {
    setModal("none");
    setModalMessage("");
    setModalError("");
  }

  async function openAccountInfo() {
    setModal("account-info");
    setModalError("");
    setModalMessage("");
    setProfileLoading(true);
    try {
      const response = await fetch("/api/account/profile");
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to load account information");
      setProfile(payload.profile as AccountProfile);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to load account information");
    } finally {
      setProfileLoading(false);
    }
  }

  async function saveAccountInfo() {
    setModalError("");
    setModalMessage("");
    setProfileSaving(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to update account information");
      setModalMessage("Account information updated successfully.");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to update account information");
    } finally {
      setProfileSaving(false);
    }
  }

  async function savePassword() {
    setModalError("");
    setModalMessage("");
    setPasswordSaving(true);
    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to change password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setModalMessage("Password updated successfully.");
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function downloadArchive() {
    setDownloadStatus("loading");
    setDownloadError("");
    try {
      const response = await fetch("/api/account/export");
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as { error?: string }).error || "Failed to generate archive");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const disposition = response.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^"]+)"?/i);
      anchor.href = url;
      anchor.download = match?.[1] || `asmyne-archive-${Date.now()}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      setDownloadStatus("done");
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Failed to download archive");
      setDownloadStatus("error");
    }
  }

  async function deactivateAccount() {
    setModalError("");
    setModalMessage("");
    setDeactivateLoading(true);
    try {
      const response = await fetch("/api/account/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deactivatePassword, reason: deactivateReason }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Failed to deactivate account");
      window.location.href = "/connexion";
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to deactivate account");
    } finally {
      setDeactivateLoading(false);
    }
  }

  return (
    <div className="h-screen bg-black text-white flex font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="hidden sm:flex sm:flex-col w-72 border-r border-neutral-800 bg-black pt-8 h-full overflow-y-auto scrollbar-hidden flex-shrink-0">
        <div className="px-4 pb-4 sm:px-6">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Settings"
              className="w-full rounded-full bg-neutral-900 py-2 pl-9 pr-4 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6f3f88]"
            />
          </div>
        </div>
        <nav className="pb-6">
          {filteredCategories.map((cat) => (
            <button
              key={cat.key}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-neutral-900 sm:px-6 ${selected === cat.key ? "bg-neutral-900 font-semibold" : "font-normal"}`}
              onClick={() => { setSelected(cat.key); setDownloadStatus("idle"); setDownloadError(""); }}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="flex-1">{cat.label}</span>
              <FiChevronRight className="text-neutral-600 ml-auto" />
            </button>
          ))}
          {filteredCategories.length === 0 && (
            <p className="px-6 py-4 text-sm text-neutral-500">No settings match your search.</p>
          )}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 h-full overflow-y-auto px-4 pb-8 pt-6 sm:px-10 sm:pt-8">
        {selected === "privacy" ? (
          <>
            <h2 className="mb-1 text-2xl font-bold">Privacy and safety</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              Control who can see your content, interact with you, and how your data is used.
            </p>

            {privacyLoading ? (
              <p className="text-sm text-neutral-500">Loading privacy settings…</p>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Account */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Account</h3>
                  <div className="flex flex-col gap-2">
                    <ToggleRow
                      icon={<FiLock />}
                      title="Private account"
                      desc="Only approved followers can see your posts and reels."
                      checked={privacy.isPrivateAccount}
                      onChange={(v) => void savePrivacyField({ isPrivateAccount: v })}
                    />
                    <ToggleRow
                      icon={<FiEyeOff />}
                      title="Activity status"
                      desc="Show when you were last active to people you follow and message."
                      checked={privacy.showActivityStatus}
                      onChange={(v) => void savePrivacyField({ showActivityStatus: v })}
                    />
                  </div>
                </div>

                {/* Interactions */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Interactions</h3>
                  <div className="flex flex-col gap-2">
                    <SelectRow
                      icon={<FiMessageCircle />}
                      title="Who can send you messages"
                      desc="Control who can start a conversation with you."
                      value={privacy.whoCanMessage}
                      options={[
                        { value: "everyone", label: "Everyone" },
                        { value: "followers", label: "Followers only" },
                        { value: "nobody", label: "Nobody" },
                      ]}
                      onChange={(v) => void savePrivacyField({ whoCanMessage: v as WhoOption })}
                    />
                    <SelectRow
                      icon={<FiGlobe />}
                      title="Who can see your reels"
                      desc="Choose the default audience for your video content."
                      value={privacy.whoCanSeeReels}
                      options={[
                        { value: "everyone", label: "Everyone" },
                        { value: "followers", label: "Followers only" },
                      ]}
                      onChange={(v) => void savePrivacyField({ whoCanSeeReels: v as WhoReelsOption })}
                    />
                    <SelectRow
                      icon={<FiTag />}
                      title="Who can tag you"
                      desc="Control who can tag you in posts and comments."
                      value={privacy.whoCanTagMe}
                      options={[
                        { value: "everyone", label: "Everyone" },
                        { value: "followers", label: "Followers only" },
                        { value: "nobody", label: "Nobody" },
                      ]}
                      onChange={(v) => void savePrivacyField({ whoCanTagMe: v as WhoOption })}
                    />
                    <SelectRow
                      icon={<FiUser />}
                      title="Who can mention you"
                      desc="Control who can @mention you in posts and comments."
                      value={privacy.whoCanMentionMe}
                      options={[
                        { value: "everyone", label: "Everyone" },
                        { value: "followers", label: "Followers only" },
                        { value: "nobody", label: "Nobody" },
                      ]}
                      onChange={(v) => void savePrivacyField({ whoCanMentionMe: v as WhoOption })}
                    />
                  </div>
                </div>

                {/* Data */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Data</h3>
                  <div className="flex flex-col gap-2">
                    <ToggleRow
                      icon={<FiShield />}
                      title="Allow data sharing for analytics"
                      desc="Help improve ASMYNE by sharing anonymous usage data."
                      checked={privacy.allowDataSharing}
                      onChange={(v) => void savePrivacyField({ allowDataSharing: v })}
                    />
                  </div>
                </div>

                {/* Save status */}
                <div className="h-5">
                  {privacySaveStatus === "saving" && <p className="text-xs text-neutral-500">Saving…</p>}
                  {privacySaveStatus === "saved" && <p className="text-xs text-emerald-400">Changes saved.</p>}
                  {privacySaveStatus === "error" && <p className="text-xs text-red-400">Failed to save. Please try again.</p>}
                </div>
              </div>
            )}
          </>
        ) : selected === "notifications" ? (
          <>
            <h2 className="mb-1 text-2xl font-bold">Notifications</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              Choose what you want to be notified about by email and within the app.
            </p>

            {notifLoading ? (
              <p className="text-sm text-neutral-500">Loading notification settings…</p>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Email */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Email notifications</h3>
                  <div className="flex flex-col gap-2">
                    <ToggleRow
                      icon={<FiUser />}
                      title="New follower"
                      desc="Receive an email when someone starts following you."
                      checked={notif.emailNewFollower}
                      onChange={(v) => void saveNotifField({ emailNewFollower: v })}
                    />
                    <ToggleRow
                      icon={<FiMessageCircle />}
                      title="New messages"
                      desc="Receive an email when you get a new direct message."
                      checked={notif.emailMessages}
                      onChange={(v) => void saveNotifField({ emailMessages: v })}
                    />
                    <ToggleRow
                      icon={<FiDollarSign />}
                      title="Tips & payments"
                      desc="Receive an email when someone sends you a tip."
                      checked={notif.emailTips}
                      onChange={(v) => void saveNotifField({ emailTips: v })}
                    />
                    <ToggleRow
                      icon={<FiBell />}
                      title="Weekly digest"
                      desc="A weekly summary of your account activity and stats."
                      checked={notif.emailWeeklyDigest}
                      onChange={(v) => void saveNotifField({ emailWeeklyDigest: v })}
                    />
                  </div>
                </div>

                {/* In-app / Push */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">In-app notifications</h3>
                  <div className="flex flex-col gap-2">
                    <ToggleRow
                      icon={<FiUser />}
                      title="New follower"
                      desc="Notify when someone follows you."
                      checked={notif.pushNewFollower}
                      onChange={(v) => void saveNotifField({ pushNewFollower: v })}
                    />
                    <ToggleRow
                      icon={<FiMessageCircle />}
                      title="Direct messages"
                      desc="Notify when you receive a new message."
                      checked={notif.pushMessages}
                      onChange={(v) => void saveNotifField({ pushMessages: v })}
                    />
                    <ToggleRow
                      icon={<FiHeart />}
                      title="Likes"
                      desc="Notify when someone likes your post or reel."
                      checked={notif.pushLikes}
                      onChange={(v) => void saveNotifField({ pushLikes: v })}
                    />
                    <ToggleRow
                      icon={<FiBell />}
                      title="Comments"
                      desc="Notify when someone comments on your content."
                      checked={notif.pushComments}
                      onChange={(v) => void saveNotifField({ pushComments: v })}
                    />
                    <ToggleRow
                      icon={<FiTag />}
                      title="Tags"
                      desc="Notify when someone tags you in a post."
                      checked={notif.pushTags}
                      onChange={(v) => void saveNotifField({ pushTags: v })}
                    />
                    <ToggleRow
                      icon={<FiGlobe />}
                      title="Mentions"
                      desc="Notify when someone @mentions you."
                      checked={notif.pushMentions}
                      onChange={(v) => void saveNotifField({ pushMentions: v })}
                    />
                    <ToggleRow
                      icon={<FiDollarSign />}
                      title="Tips received"
                      desc="Notify instantly when you receive a tip."
                      checked={notif.pushTips}
                      onChange={(v) => void saveNotifField({ pushTips: v })}
                    />
                    <ToggleRow
                      icon={<FiShield />}
                      title="View milestones"
                      desc="Notify when your content reaches 1K, 10K, 100K views."
                      checked={notif.pushViewMilestones}
                      onChange={(v) => void saveNotifField({ pushViewMilestones: v })}
                    />
                  </div>
                </div>

                {/* Save status */}
                <div className="h-5">
                  {notifSaveStatus === "saving" && <p className="text-xs text-neutral-500">Saving…</p>}
                  {notifSaveStatus === "saved" && <p className="text-xs text-emerald-400">Changes saved.</p>}
                  {notifSaveStatus === "error" && <p className="text-xs text-red-400">Failed to save. Please try again.</p>}
                </div>
              </div>
            )}
          </>
        ) : selected === "security" ? (
          <>
            <h2 className="mb-1 text-2xl font-bold">Security and account access</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              Manage your account security, two-factor authentication, and connected sessions.
            </p>

            {securityLoading ? (
              <p className="text-sm text-neutral-500">Loading security settings…</p>
            ) : (
              <div className="flex flex-col gap-6">

                {/* 2FA */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Authentication</h3>
                  <div className="flex flex-col gap-2">
                    <ToggleRow
                      icon={<FiShield />}
                      title="Two-factor authentication (2FA)"
                      desc="Require a verification code in addition to your password when signing in."
                      checked={twoFactorEnabled}
                      onChange={(v) => { void toggleTwoFactor(v); }}
                    />
                    {twoFaSaving && <p className="pl-1 text-xs text-neutral-500">Saving…</p>}
                    {twoFactorEnabled && (
                      <div className="flex items-start gap-3 rounded-2xl border border-emerald-800/50 bg-emerald-950/20 px-5 py-4">
                        <FiShield className="mt-0.5 shrink-0 text-emerald-400" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-300">2FA is enabled</p>
                          <p className="mt-0.5 text-xs text-emerald-500">A verification code will be sent to your email each time you log in.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sessions */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Sessions</h3>
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm text-white">Sign out of all devices</p>
                        <p className="mt-0.5 text-xs text-neutral-400">This will immediately sign you out of all active sessions on every device.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { void revokeAllSessions(); }}
                        disabled={revokeStatus === "loading" || revokeStatus === "done"}
                        className="shrink-0 rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-red-900/60 hover:text-red-200 transition disabled:opacity-50"
                      >
                        {revokeStatus === "loading" ? "Signing out…" : revokeStatus === "done" ? "Signed out ✓" : "Sign out everywhere"}
                      </button>
                    </div>
                    {revokeStatus === "error" && <p className="mt-2 text-xs text-red-400">Failed. Please try again.</p>}
                  </div>
                </div>

                {/* Login history */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Login activity</h3>
                  {loginHistory.length === 0 ? (
                    <p className="text-sm text-neutral-500">No login history recorded yet.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {loginHistory.map((entry, i) => {
                        const date = new Date(entry.timestamp);
                        const label = date.toLocaleString("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        });
                        // Simplify user-agent to browser name
                        const ua = entry.userAgent ?? "";
                        const browser =
                          ua.includes("Edg") ? "Edge" :
                          ua.includes("Chrome") ? "Chrome" :
                          ua.includes("Firefox") ? "Firefox" :
                          ua.includes("Safari") ? "Safari" :
                          ua.includes("curl") ? "curl" : "Unknown browser";
                        const device = ua.includes("Mobile") ? "Mobile" : "Desktop";
                        return (
                          <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-3 ${i === 0 ? "border border-[#6f3f88]/50 bg-[#6f3f88]/10" : "bg-neutral-900"}`}>
                            <div className="flex items-center gap-3">
                              <FiShield className={`shrink-0 ${i === 0 ? "text-[#a06ac4]" : "text-neutral-600"}`} />
                              <div>
                                <p className="text-sm text-white">{browser} · {device}</p>
                                <p className="text-xs text-neutral-500">{entry.ip}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-neutral-400">{label}</p>
                              {i === 0 && <p className="text-xs text-[#a06ac4] font-medium">Most recent</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        ) : selected === "accessibility" ? (
          <>
            <h2 className="mb-1 text-2xl font-bold">Accessibility, display, and languages</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              Customize how ASMYNE looks and behaves to suit your preferences.
            </p>

            {accessLoading ? (
              <p className="text-sm text-neutral-500">Loading accessibility settings…</p>
            ) : (
              <div className="flex flex-col gap-6">

                {/* Display */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Display</h3>
                  <div className="flex flex-col gap-2">
                    <SelectRow
                      icon={<FiGlobe />}
                      title="Theme"
                      desc="Choose your preferred color scheme."
                      value={access.theme}
                      options={[
                        { value: "dark", label: "Dark" },
                        { value: "light", label: "Light" },
                        { value: "system", label: "System (default)" },
                      ]}
                      onChange={(v) => void saveAccessField({ theme: v as "dark" | "light" | "system" })}
                    />
                    <SelectRow
                      icon={<FiUser />}
                      title="Font size"
                      desc="Adjust the size of text throughout the app."
                      value={access.fontSize}
                      options={[
                        { value: "sm", label: "Small" },
                        { value: "base", label: "Standard" },
                        { value: "lg", label: "Large" },
                        { value: "xl", label: "Extra large" },
                      ]}
                      onChange={(v) => void saveAccessField({ fontSize: v as "sm" | "base" | "lg" | "xl" })}
                    />
                  </div>
                </div>

                {/* Accessibility */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Accessibility</h3>
                  <div className="flex flex-col gap-2">
                    <ToggleRow
                      icon={<FiShield />}
                      title="Reduce motion"
                      desc="Minimize animations and transitions for reduced distraction."
                      checked={access.reduceMotion}
                      onChange={(v) => void saveAccessField({ reduceMotion: v })}
                    />
                    <ToggleRow
                      icon={<FiGlobe />}
                      title="Larger text"
                      desc="Increase text size globally for better readability."
                      checked={access.largerText}
                      onChange={(v) => void saveAccessField({ largerText: v })}
                    />
                    <ToggleRow
                      icon={<FiBell />}
                      title="High contrast"
                      desc="Use stronger colors for improved visibility."
                      checked={access.highContrast}
                      onChange={(v) => void saveAccessField({ highContrast: v })}
                    />
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">Language</h3>
                  <div className="flex flex-col gap-2">
                    <SelectRow
                      icon={<FiGlobe />}
                      title="Interface language"
                      desc="Choose the language for the ASMYNE interface."
                      value={access.language}
                      options={[
                        { value: "en", label: "English" },
                        { value: "fr", label: "Français" },
                        { value: "es", label: "Español" },
                        { value: "de", label: "Deutsch" },
                        { value: "pt", label: "Português" },
                      ]}
                      onChange={(v) => void saveAccessField({ language: v as "en" | "fr" | "es" | "de" | "pt" })}
                    />
                  </div>
                </div>

                {/* Save status */}
                <div className="h-5">
                  {accessSaveStatus === "saving" && <p className="text-xs text-neutral-500">Saving…</p>}
                  {accessSaveStatus === "saved" && <p className="text-xs text-emerald-400">Changes saved.</p>}
                  {accessSaveStatus === "error" && <p className="text-xs text-red-400">Failed to save. Please try again.</p>}
                </div>

              </div>
            )}
          </>
        ) : selected === "monetization" ? (
          <>
            <h2 className="mb-1 text-2xl font-bold">Monetization</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              Connect your Stripe account to receive payments and manage payouts.
            </p>

            {stripeLoading ? (
              <p className="text-sm text-neutral-500">Loading Stripe status…</p>
            ) : (
              <div className="flex flex-col gap-6">
                {stripeError && (
                  <div className="rounded-xl border border-red-700/70 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                    {stripeError}
                  </div>
                )}

                {/* Stripe Connect Status */}
                <div>
                  <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Stripe Connect
                  </h3>
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
                    {!stripeStatus || stripeStatus.status === "not_connected" ? (
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="font-semibold text-sm text-white">
                            Connect your Stripe account
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-400">
                            Start receiving payments by connecting your Stripe account.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void createStripeAccount()}
                          disabled={stripeSaving}
                          className="self-start rounded-xl bg-[#6f3f88] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8b5fb3] disabled:opacity-60"
                        >
                          {stripeSaving ? "Connecting…" : "Connect Stripe"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm text-white">
                              Account connected
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-400">
                              Your Stripe account is linked to ASMYNE
                            </p>
                          </div>
                          <div
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              stripeStatus.verificationStatus === "verified"
                                ? "bg-emerald-950/40 text-emerald-300"
                                : stripeStatus.verificationStatus === "restricted"
                                  ? "bg-red-950/40 text-red-300"
                                  : "bg-yellow-950/40 text-yellow-300"
                            }`}
                          >
                            {stripeStatus.verificationStatus === "verified"
                              ? "✓ Verified"
                              : stripeStatus.verificationStatus === "restricted"
                                ? "⚠ Restricted"
                                : "⏳ Pending"}
                          </div>
                        </div>

                        {stripeStatus.verificationStatus !== "verified" && (
                          <div className="rounded-xl bg-neutral-800 px-4 py-3 text-sm">
                            <p className="font-semibold text-white mb-2">
                              Verification in progress
                            </p>
                            {stripeStatus.currentlyDue && stripeStatus.currentlyDue.length > 0 && (
                              <div className="text-xs text-neutral-400">
                                <p className="mb-1">Required information:</p>
                                <ul className="list-inside list-disc">
                                  {stripeStatus.currentlyDue.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Balance */}
                        {stripeBalance && (
                          <div className="rounded-xl bg-neutral-800 px-4 py-3">
                            <p className="text-xs font-semibold text-neutral-300 mb-3">
                              Available balance
                            </p>
                            <div className="flex gap-4">
                              {stripeBalance.available.map((bal) => (
                                <div key={bal.currency}>
                                  <p className="text-xs text-neutral-400">
                                    {bal.currency.toUpperCase()}
                                  </p>
                                  <p className="text-lg font-bold text-white">
                                    {(bal.amount / 100).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Payouts */}
                        {stripeBalance && stripeBalance.payouts.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-neutral-300 mb-2">
                              Recent payouts
                            </p>
                            <div className="flex flex-col gap-2">
                              {stripeBalance.payouts.slice(0, 5).map((payout) => {
                                const date = new Date(payout.arrivalDate * 1000);
                                return (
                                  <div
                                    key={payout.id}
                                    className="flex items-center justify-between rounded-lg bg-neutral-800 px-3 py-2 text-xs"
                                  >
                                    <div>
                                      <p className="text-neutral-200">
                                        {(payout.amount / 100).toFixed(2)} {payout.currency.toUpperCase()}
                                      </p>
                                      <p className="text-neutral-500">
                                        {date.toLocaleDateString("fr-FR")}
                                      </p>
                                    </div>
                                    <div
                                      className={`font-semibold ${
                                        payout.status === "paid"
                                          ? "text-emerald-400"
                                          : payout.status === "in_transit"
                                            ? "text-blue-400"
                                            : "text-neutral-400"
                                      }`}
                                    >
                                      {payout.status === "paid"
                                        ? "✓"
                                        : payout.status === "in_transit"
                                          ? "→"
                                          : "○"}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (onboardingUrl) {
                              window.open(onboardingUrl, "_blank");
                            } else {
                              void (async () => {
                                const res = await fetch("/api/stripe-connect/onboarding-link", {
                                  method: "POST",
                                });
                                const data = await res.json();
                                if (res.ok && data.url) {
                                  window.open(data.url, "_blank");
                                }
                              })();
                            }
                          }}
                          className="self-start rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
                        >
                          Manage Stripe Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : selected === "resources" ? (
          <>
            <h2 className="mb-1 text-2xl font-bold">Additional resources</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              Learn more about ASMYNE with our documentation, tutorials, and community support
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Documentation */}
              <a
                href="https://docs.asmyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <FiGlobe className="text-[#6f3f88]" size={20} />
                  <h3 className="font-semibold text-white">Documentation</h3>
                </div>
                <p className="text-sm text-neutral-400">
                  Complete guides and API reference for developers and users.
                </p>
              </a>

              {/* Community Forum */}
              <a
                href="https://community.asmyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <FiMessageCircle className="text-[#6f3f88]" size={20} />
                  <h3 className="font-semibold text-white">Community Forum</h3>
                </div>
                <p className="text-sm text-neutral-400">
                  Connect with other ASMYNE users and get help from the community.
                </p>
              </a>

              {/* Video Tutorials */}
              <a
                href="https://youtube.com/channel/asmyne"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <FiDownload className="text-[#6f3f88]" size={20} />
                  <h3 className="font-semibold text-white">Video Tutorials</h3>
                </div>
                <p className="text-sm text-neutral-400">
                  Learn ASMYNE features with step-by-step video guides.
                </p>
              </a>

              {/* Status Page */}
              <a
                href="https://status.asmyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <FiShield className="text-[#6f3f88]" size={20} />
                  <h3 className="font-semibold text-white">Status Page</h3>
                </div>
                <p className="text-sm text-neutral-400">
                  Check ASMYNE service status and incident history.
                </p>
              </a>

              {/* Blog */}
              <a
                href="https://blog.asmyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <FiGlobe className="text-[#6f3f88]" size={20} />
                  <h3 className="font-semibold text-white">Blog</h3>
                </div>
                <p className="text-sm text-neutral-400">
                  Read articles about features, tips, and company updates.
                </p>
              </a>

              {/* Support */}
              <a
                href="https://support.asmyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <FiHelpCircle className="text-[#6f3f88]" size={20} />
                  <h3 className="font-semibold text-white">Contact Support</h3>
                </div>
                <p className="text-sm text-neutral-400">
                  Get help from our support team for any issues.
                </p>
              </a>
            </div>
          </>
        ) : selected === "help" ? (
          <>
            <h2 className="mb-1 text-2xl font-bold">Help Center</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              Find answers to common questions and get support
            </p>

            {/* FAQ Section */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-white">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {[
                  {
                    q: "How do I change my password?",
                    a: "Go to Your Account section and select 'Change your password'. You'll need to verify your current password before setting a new one."
                  },
                  {
                    q: "How do I enable two-factor authentication?",
                    a: "Visit the Security section and toggle 'Two-factor authentication'. Follow the prompts to set up your preferred authentication method."
                  },
                  {
                    q: "Can I download my data?",
                    a: "Yes, in Your Account section, click 'Download an archive of your data' to get a full JSON export of your account."
                  },
                  {
                    q: "How do I deactivate my account?",
                    a: "Visit Your Account and select 'Deactivate your account'. Your account will be deactivated immediately and you'll be signed out."
                  },
                  {
                    q: "How do I change my privacy settings?",
                    a: "Navigate to Privacy and Safety settings to control who can message you, see your content, tag you, and more."
                  },
                  {
                    q: "Can I change the interface language?",
                    a: "Yes, go to Accessibility section and select your preferred language under Language settings."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 transition-all hover:border-neutral-700">
                    <h4 className="mb-2 font-semibold text-white">{faq.q}</h4>
                    <p className="text-sm text-neutral-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Categories */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-white">Get Help</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Report a Problem */}
                <a
                  href="https://support.asmyne.com/report"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <FiShield className="text-[#6f3f88]" size={20} />
                    <h4 className="font-semibold text-white">Report a Problem</h4>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Let us know about any issues you're experiencing.
                  </p>
                </a>

                {/* Account Help */}
                <a
                  href="https://support.asmyne.com/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <FiUser className="text-[#6f3f88]" size={20} />
                    <h4 className="font-semibold text-white">Account Help</h4>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Get help with account access and security.
                  </p>
                </a>

                {/* Privacy & Safety */}
                <a
                  href="https://support.asmyne.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <FiEyeOff className="text-[#6f3f88]" size={20} />
                    <h4 className="font-semibold text-white">Privacy & Safety</h4>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Learn about your privacy controls and account security.
                  </p>
                </a>

                {/* Content & Copyright */}
                <a
                  href="https://support.asmyne.com/content"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <FiTag className="text-[#6f3f88]" size={20} />
                    <h4 className="font-semibold text-white">Content & Copyright</h4>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Get help with uploads, copyright, and content policies.
                  </p>
                </a>

                {/* Technical Support */}
                <a
                  href="https://support.asmyne.com/technical"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <FiGlobe className="text-[#6f3f88]" size={20} />
                    <h4 className="font-semibold text-white">Technical Support</h4>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Troubleshooting for app crashes, performance, and features.
                  </p>
                </a>

                {/* Contact Support */}
                <a
                  href="https://support.asmyne.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <FiMessageCircle className="text-[#6f3f88]" size={20} />
                    <h4 className="font-semibold text-white">Contact Support</h4>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Chat with our support team for personalized help.
                  </p>
                </a>
              </div>
            </div>

            {/* Community */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Community</h3>
              <a
                href="https://community.asmyne.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 transition-all hover:border-[#6f3f88]/50 hover:bg-neutral-900/80"
              >
                <div className="mb-3 flex items-center gap-2">
                  <FiMessageCircle className="text-[#6f3f88]" size={20} />
                  <h4 className="font-semibold text-white">Community Forum</h4>
                </div>
                <p className="text-sm text-neutral-400">
                  Connect with other ASMYNE users, share tips, and get community support.
                </p>
              </a>
            </div>
          </>
        ) : selected !== "account" ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6">
            <h2 className="mb-2 text-2xl font-bold text-white">{selectedCategory.label}</h2>
            <p className="max-w-2xl text-sm text-neutral-400">This section is ready for your next feature set.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-2xl font-bold">Your Account</h2>
            <p className="mb-6 max-w-xl text-sm text-neutral-400">
              See information about your account, download an archive of your data, or learn about your account deactivation options
            </p>

            <div className="flex flex-col gap-2.5">
              <SectionCard
                icon={<FiUser />}
                title="Account information"
                desc="See and update your account information like phone number and email address."
                onClick={() => { void openAccountInfo(); }}
              />
              <SectionCard
                icon={<FiLock />}
                title="Change your password"
                desc="Change your password at any time."
                onClick={() => { setModal("password"); setModalError(""); setModalMessage(""); }}
              />
              <SectionCard
                icon={<FiDownload />}
                title="Download an archive of your data"
                desc="Download a full JSON archive of your account data."
                onClick={() => { void downloadArchive(); }}
              />
              <SectionCard
                icon={<FiHeart />}
                title="Deactivate your account"
                desc="Deactivate your account and sign out immediately."
                onClick={() => { setModal("deactivate"); setModalError(""); setModalMessage(""); setDeactivatePassword(""); setDeactivateReason(""); }}
              />
            </div>

            {/* Download feedback */}
            {downloadStatus === "loading" && (
              <p className="mt-4 text-sm text-neutral-400">Generating archive, please wait…</p>
            )}
            {downloadStatus === "done" && (
              <div className="mt-4 rounded-xl border border-emerald-700/70 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">Archive downloaded successfully.</div>
            )}
            {downloadStatus === "error" && (
              <div className="mt-4 rounded-xl border border-red-700/70 bg-red-950/30 px-4 py-3 text-sm text-red-200">{downloadError}</div>
            )}
          </>
        )}
      </main>

      {/* â”€â”€ Modal: Account information â”€â”€ */}
      <Modal open={modal === "account-info"} onClose={closeModal} title="Account information">
        {modalError && <div className="mb-4 rounded-xl border border-red-700/70 bg-red-950/30 px-3 py-2 text-sm text-red-200">{modalError}</div>}
        {modalMessage && <div className="mb-4 rounded-xl border border-emerald-700/70 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200">{modalMessage}</div>}
        {profileLoading ? (
          <p className="text-sm text-neutral-400">Loading account informationâ€¦</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]" placeholder="Name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
            <input className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]" placeholder="Email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            <input className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]" placeholder="Phone" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
            <input className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]" placeholder="City" value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))} />
            <input className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]" placeholder="Country" value={profile.country} onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))} />
            <input className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]" placeholder="Location" value={profile.location} onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} />
            <textarea className="rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88] sm:col-span-2" rows={3} placeholder="Bio" value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
            <div className="sm:col-span-2">
              <button type="button" onClick={() => void saveAccountInfo()} disabled={profileSaving} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-60">
                {profileSaving ? "Savingâ€¦" : "Save"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* â”€â”€ Modal: Change password â”€â”€ */}
      <Modal open={modal === "password"} onClose={closeModal} title="Change your password">
        {modalError && <div className="mb-4 rounded-xl border border-red-700/70 bg-red-950/30 px-3 py-2 text-sm text-red-200">{modalError}</div>}
        {modalMessage && <div className="mb-4 rounded-xl border border-emerald-700/70 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200">{modalMessage}</div>}
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-400">Current password <span className="text-red-400">*</span></label>
            <input
              type="password"
              className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-neutral-500">Required to verify your identity and protect your account.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-400">New password <span className="text-red-400">*</span></label>
            <input
              type="password"
              className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]"
              placeholder="Min. 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-400">Confirm new password <span className="text-red-400">*</span></label>
            <input
              type="password"
              className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#6f3f88]"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button type="button" onClick={() => void savePassword()} disabled={passwordSaving} className="mt-1 w-fit rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-60">
            {passwordSaving ? "Updatingâ€¦" : "Update password"}
          </button>
        </div>
      </Modal>

      {/* â”€â”€ Modal: Deactivate account â”€â”€ */}
      <Modal open={modal === "deactivate"} onClose={closeModal} title="Deactivate your account" danger>
        {modalError && <div className="mb-4 rounded-xl border border-red-700/70 bg-red-950/30 px-3 py-2 text-sm text-red-200">{modalError}</div>}
        <p className="mb-4 text-sm text-red-300">Your account will be deactivated and you will be signed out immediately. Contact support to reactivate it.</p>
        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-400">Your password <span className="text-red-400">*</span></label>
            <input
              type="password"
              className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Confirm your password"
              value={deactivatePassword}
              onChange={(e) => setDeactivatePassword(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-400">Reason <span className="text-neutral-600">(optional)</span></label>
            <textarea
              className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-red-600"
              rows={3}
              placeholder="Why are you leaving?"
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
            />
          </div>
          <button type="button" onClick={() => void deactivateAccount()} disabled={deactivateLoading} className="w-fit rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60">
            {deactivateLoading ? "Deactivatingâ€¦" : "Deactivate now"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
