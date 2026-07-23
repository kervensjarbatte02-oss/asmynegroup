import Link from "next/link";

export default function BlogNavbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-transparent z-20">
      <div className="flex items-center gap-3">
        <img src="/Asmyne-Group-logo.png" alt="Logo" className="w-10 h-auto rounded-full" />
        <span className="text-xl font-bold text-white">Asmyne Group Blog</span>
      </div>
      <div className="flex gap-8 text-white font-medium">
        <Link href="/" className="hover:text-blue-300 transition">Accueil</Link>
        <Link href="/blog" className="hover:text-blue-300 transition">Blog</Link>
        <Link href="/marketplace" className="hover:text-blue-300 transition">Marketplace</Link>
        <Link href="/contact" className="hover:text-blue-300 transition">Contact</Link>
      </div>
      <div className="w-[140px]" aria-hidden="true" />
    </nav>
  );
}
