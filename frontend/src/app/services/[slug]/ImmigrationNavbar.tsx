import React from "react";

export default function ImmigrationNavbar() {
  return (
    <nav className="w-full max-w-full bg-[#0a174e] flex items-center justify-between px-4 md:px-8 py-2 shadow-md sticky top-0 z-50 animate-fade-in">
      <div className="flex items-center min-w-[40px]">
        <span className="font-extrabold text-lg md:text-xl tracking-tight text-[#e6b85c] opacity-90 whitespace-nowrap">CONSULTORA MIGRATORIA</span>
      </div>
      <div className="hidden lg:flex gap-8 font-bold text-[14px] tracking-wide whitespace-nowrap min-w-0">
        <a href="/" className="text-[#e6b85c] border-b-2 border-[#e6b85c] pb-0.5 hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-[#e6b85c] transition-all">INICIO</a>
        <a href="/blog" className="text-[#e6b85c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e6b85c] transition-all">SOBRE</a>
        <a href="/services/yontikonsey-blog" className="text-[#e6b85c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e6b85c] transition-all">BLOG</a>
        <a href="/contact" className="text-[#e6b85c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#e6b85c] transition-all">CONTACTO</a>
      </div>
      <div className="flex flex-row items-center gap-2 min-w-0 ml-2">
        <span className="text-[12px] font-bold text-[#e6b85c] leading-4 whitespace-nowrap">+1 (809) 308-6370</span>
        <div className="bg-[#e6b85c] rounded-full p-2 flex items-center justify-center ml-1 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#0a174e" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" stroke="#0a174e" strokeWidth="2" fill="none" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8M12 8v8" />
          </svg>
        </div>
      </div>
      {/* Temporal de trabajomenu (mobile) */}
      <div className="lg:hidden flex items-center ml-2">
        <button className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e6b85c] hover:bg-[#e6b85c]/10 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#e6b85c" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
