import Image from 'next/image';

export default function AsmynNavbar() {
  return (
    <nav className="w-full bg-[#223e8a] flex items-center justify-between px-6 py-2 border-b-4 border-[#f2c46f]">
      <div className="flex items-center gap-3">
        <Image src="/Asmyne-Group-logo.png" alt="Logo Asmyne" width={40} height={40} className="min-w-[40px] min-h-[40px]" />
        <a href="/services/marketplace-global" className="text-white font-bold text-xl md:text-2xl hover:underline">Asmyne Voyages</a>
      </div>
      <div className="flex items-center gap-8">
        <a href="/" className="text-white font-semibold hover:underline">Accueil</a>
        <a href="/services/conseil-entrepreneurial" className="text-white font-bold underline">Asesoría empresarial</a>
      </div>
      <div className="text-white text-sm">
        Contact : <a href="mailto:+1 (809) 308-6370" className="hover:underline">+1 (809) 308-6370</a>
      </div>
    </nav>
  );
}
