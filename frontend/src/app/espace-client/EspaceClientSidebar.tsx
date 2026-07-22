"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  FiBell,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";

type EspaceClientSidebarProps = {
  userName: string;
  activeView: EspaceClientView;
  onChangeView: (view: EspaceClientView) => void;
};

export type EspaceClientView =
  | "home"
  | "messages"
  | "search"
  | "notifications"
  | "create"
  | "dashboard"
  | "profile"
  | "settings";

type SidebarItem = {
  view: EspaceClientView;
  label: string;
  icon: ReactNode;
};

const items: SidebarItem[] = [
  { view: "messages", label: "Messages", icon: <FiMessageCircle /> },
  { view: "search", label: "Search", icon: <FiSearch /> },
  { view: "notifications", label: "Notifications", icon: <FiBell /> },
  { view: "create", label: "Create", icon: <FiPlus /> },
  { view: "dashboard", label: "Dashboard", icon: <FiGrid /> },
];

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return "CL";
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export default function EspaceClientSidebar({ userName, activeView, onChangeView }: EspaceClientSidebarProps) {
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!menuRef.current || !buttonRef.current) {
        return;
      }

      const target = event.target as Node;
      // Fermer le menu si le clic n'est pas dans le menu ET pas sur le bouton
      if (!menuRef.current.contains(target) && !buttonRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    }

    if (profileMenuOpen) {
      document.addEventListener("click", onDocumentClick);
    }

    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [profileMenuOpen]);

  // Fermer le menu quand on change de vue
  useEffect(() => {
    setProfileMenuOpen(false);
  }, [activeView]);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-24 flex-col bg-transparent px-2 pb-6 pt-10">
      <button
        type="button"
        onClick={() => onChangeView("home")}
        className={`mx-auto mb-6 flex h-10 w-10 items-center justify-center rounded-2xl text-white ${
          activeView === "home" ? "bg-[#4a245f]" : "bg-[#351b3f]"
        }`}
        title="Home"
      >
        <FiHome size={19} />
      </button>

      <nav className="mt-2 flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onChangeView(item.view)}
            className={`group mx-auto flex w-full items-center justify-center rounded-2xl px-2 py-3 text-[#f0d4ff] transition hover:bg-[#4a245f] hover:text-white ${
              activeView === item.view ? "bg-[#4a245f] text-white" : ""
            }`}
            title={item.label}
          >
            <span className="text-[22px]">{item.icon}</span>
          </button>
        ))}
      </nav>

      <div ref={menuRef} className="relative mt-2">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setProfileMenuOpen((value) => !value)}
          className={`mx-auto flex w-full items-center justify-center rounded-2xl px-2 py-3 text-[#f0d4ff] transition hover:bg-[#4a245f] hover:text-white ${
            activeView === "profile" || activeView === "settings" ? "bg-[#4a245f] text-white" : ""
          }`}
          title="Profil"
          aria-expanded={profileMenuOpen}
          aria-haspopup="menu"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#351b3f] text-xs font-bold text-white">
            {initials(userName)}
          </span>
        </button>

        {profileMenuOpen ? (
          <div
            role="menu"
            className="absolute bottom-0 left-[calc(100%+10px)] min-w-[190px] rounded-2xl bg-[#351b3f] p-2 text-sm shadow-[0_10px_25px_rgba(25,8,36,0.45)]"
          >
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#dcb6ff]">{userName}</p>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-white transition hover:bg-[#4a245f]"
              onClick={() => {
                setProfileMenuOpen(false);
                window.location.href = "/profile/me";
              }}
            >
              <FiUser />
              Mon compte
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-white transition hover:bg-[#4a245f]"
              onClick={() => {
                setProfileMenuOpen(false);
                window.location.href = "/settings";
              }}
            >
              <FiSettings />
              Parametres
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[#ffb1c8] transition hover:bg-[#4a245f]"
              onClick={async () => {
                setProfileMenuOpen(false);
                try {
                  await fetch("/api/account/security/revoke-sessions", {
                    method: "POST",
                  });
                } finally {
                  router.replace("/connexion");
                  router.refresh();
                }
              }}
            >
              <FiLogOut />
              Deconnexion
            </button>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="mx-auto mt-2 flex w-full items-center justify-center rounded-2xl px-2 py-3 text-[#f0d4ff] transition hover:bg-[#4a245f] hover:text-white"
        title="More"
      >
        <FiMenu size={22} />
      </button>
    </aside>
  );
}
