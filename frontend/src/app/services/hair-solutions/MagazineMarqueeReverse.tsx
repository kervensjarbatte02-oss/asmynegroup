"use client";
import React from "react";

const magazines = [
  "SHEBAS",
  "SHEBAS",
  "SHEBAS",
  "SHEBAS",
  "SHEBAS",
  "SHEBAS",
  "SHEBAS",
  "SHEBAS"
];

export default function MagazineMarqueeReverse() {
  return (
    <div className="w-full overflow-hidden py-2" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
      <div className="whitespace-nowrap animate-marquee-reverse flex items-center">
        {magazines.map((name, i) => (
          <span
            key={i}
            className="mx-8 text-yellow-400 text-3xl font-bold tracking-widest font-[serif] opacity-90"
            style={{ fontFamily: 'serif' }}
          >
            {name}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-reverse {
          display: inline-block;
          min-width: 200%;
          animation: marquee-reverse 18s linear infinite;
        }
      `}</style>
    </div>
  );
}
