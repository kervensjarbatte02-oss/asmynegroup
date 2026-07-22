"use client";
import React from "react";

export default function FooterSection() {
  return (
    <footer className="w-full mt-0">
      {/* Newsletter */}
      <div className="w-full py-10 flex flex-col items-center" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
        <div className="uppercase tracking-widest text-gray-700 mb-2">Newsletter</div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6 text-center">EXCLUSIVE OFFERS & UPDATES.</h2>
        <form className="w-full max-w-xl flex items-center">
          <input
            type="email"
            placeholder="EMAIL"
            className="flex-1 px-6 py-3 rounded-l-full border border-gray-300 focus:outline-none text-lg bg-white"
          />
          <button type="submit" className="px-6 py-3 rounded-r-full bg-[#21594d] text-white font-bold text-lg border border-l-0 border-gray-300 hover:bg-[#174138] transition-all">
            →
          </button>
        </form>
      </div>
      {/* Footer */}
      <div className="w-full text-white py-10 px-4 flex flex-col md:flex-row md:justify-between md:items-start gap-8" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
        <div>
          <div className="text-xl font-bold mb-2">NATURAL CARE,<br />REAL RESULTS</div>
          <div className="text-3xl font-extrabold tracking-widest mb-4 opacity-80">SHEBAS</div>
          {/* Ligne supprimée */}
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="text-lg font-bold mb-2">FOLLOW US</div>
          <div className="text-sm mb-2">Follow our adventures on social media:</div>
          <div className="flex gap-4 text-2xl">
            <a href="#" aria-label="Instagram" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2V6a2 2 0 1 1 4 0v2h2z"/><path d="M12 16v-4"/><path d="M10 12h4"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" fill="none"/><path d="M10 15l5.19-3L10 9v6z"/><rect x="2" y="2" width="20" height="20" rx="5" fill="none"/></svg>
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-yellow-400" target="_blank" rel="noopener noreferrer">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17a4 4 0 1 1 0-8v8zm0 0a4 4 0 0 0 4-4V3h3a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="w-full text-white text-xs py-4 px-4 flex flex-col md:flex-row md:justify-between items-center" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
        <div className="mb-2 md:mb-0">© 2026, SHEBAS</div>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="underline hover:text-yellow-400">Privacy policy</a>
          <a href="#" className="underline hover:text-yellow-400">Refund policy</a>
          <a href="#" className="underline hover:text-yellow-400">Terms of service</a>
          <a href="#" className="underline hover:text-yellow-400">Shipping policy</a>
          <a href="#" className="underline hover:text-yellow-400">Contact information</a>
        </div>
      </div>
    </footer>
  );
}
