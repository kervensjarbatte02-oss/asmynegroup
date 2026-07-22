"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell, FiGrid, FiHome, FiMenu, FiMessageCircle, FiPlus, FiSearch } from "react-icons/fi";

type ProfileSidebarProps = {
  userInitials: string;
};

const items = [
  { href: "/espace-client", icon: FiMessageCircle, label: "Messages" },
  { href: "/espace-client", icon: FiSearch, label: "Search" },
  { href: "/espace-client", icon: FiBell, label: "Notifications" },
  { href: "/espace-client", icon: FiPlus, label: "Create" },
  { href: "/espace-client", icon: FiGrid, label: "Dashboard" },
];

export default function ProfileSidebar({ userInitials }: ProfileSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col border-r border-[#4e2b62]/50 bg-[#16081f]/90 px-1.5 pb-4 pt-7 backdrop-blur md:w-20 md:px-2 md:pt-9">
      <Link
        href="/espace-client"
        className="mx-auto mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#6f3f88] text-white md:h-10 md:w-10"
        title="Home"
      >
        <FiHome size={18} />
      </Link>

      <nav className="mt-1 flex flex-1 flex-col gap-1.5 md:gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href) && item.label === "Messages";

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group mx-auto flex w-full items-center justify-center rounded-xl px-2 py-2.5 text-[#e6c8f5] transition hover:bg-[#5e3475] hover:text-white md:rounded-2xl md:py-3 ${
                active ? "bg-[#6f3f88] text-white" : ""
              }`}
              title={item.label}
            >
              <span className="text-[18px] md:text-[20px]">
                <Icon />
              </span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/profile/me"
        className="mx-auto mt-1.5 flex w-full items-center justify-center rounded-xl px-2 py-2.5 text-[#e6c8f5] transition hover:bg-[#5e3475] hover:text-white md:mt-2 md:rounded-2xl md:py-3"
        title="Mon compte"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2d133a] text-[11px] font-bold text-white md:h-10 md:w-10 md:text-xs">
          {userInitials}
        </span>
      </Link>

      <Link
        href="/settings"
        className="mx-auto mt-1.5 flex w-full items-center justify-center rounded-xl px-2 py-2.5 text-[#e6c8f5] transition hover:bg-[#5e3475] hover:text-white md:mt-2 md:rounded-2xl md:py-3"
        title="More"
      >
        <FiMenu size={20} />
      </Link>
    </aside>
  );
}
