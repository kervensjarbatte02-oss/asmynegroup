"use client";
import React from "react";

const magazines = [
  "GLAMOUR",
  "BAZAAR",
  "VOGUE",
  "COSMOPOLITAN",
  "GLAMOUR",
  "BAZAAR",
  "VOGUE",
  "COSMOPOLITAN"
];

export default function MagazineMarquee() {
  return (
    <div className="w-full overflow-hidden py-2" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
      <div className="whitespace-nowrap animate-marquee flex items-center">
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
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          min-width: 200%;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}
