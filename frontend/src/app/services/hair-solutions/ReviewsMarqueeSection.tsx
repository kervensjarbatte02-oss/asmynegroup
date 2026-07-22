"use client";
import React from "react";

const reviews = [
  {
    title: "Love It",
    stars: 5,
    text: "Perfect balance of moisture and shine. My hair feels amazing.",
    author: "Jessica L."
  },
  {
    title: "Effective",
    stars: 5,
    text: "Great hydration without heaviness. My hair stays soft all day.",
    author: "Sophie K."
  },
  {
    title: "Pro Results",
    stars: 4.5,
    text: "It feels like a professional treatment at home.",
    author: "Emma W."
  },
  {
    title: "Game Changer",
    stars: 5,
    text: "My curls have never looked better! Highly recommend.",
    author: "Maya P."
  }
];

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  return (
    <span className="text-yellow-400 text-xl ml-2">
      {Array(full).fill(0).map((_, i) => <span key={i}>★</span>)}
      {half && <span>☆</span>}
    </span>
  );
}

export default function ReviewsMarqueeSection() {
  return (
    <section className="w-full py-16 px-2 flex flex-col items-center" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
      <h2 className="text-4xl font-extrabold text-yellow-400 mb-2 text-center">RESULTADOS REALES, OPINIONES REALES</h2>
      <p className="text-lg text-yellow-100 mb-8 text-center">Amados por nuestros clientes por los resultados visibles que ofrecen.</p>
      <div className="w-full overflow-x-hidden">
        <div className="flex gap-8 animate-review-marquee">
          {reviews.concat(reviews).map((review, idx) => (
            <div key={idx} className="inline-block align-top bg-white/80 rounded-xl shadow p-6 min-w-[340px] max-w-[340px] mx-2 break-words whitespace-normal">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-yellow-800 flex items-center gap-1">{review.title} <span title="Verified" className="text-xs">✔️</span></span>
                <Stars value={review.stars} />
              </div>
              <div className="text-yellow-900/80 mb-4 break-words whitespace-normal">{review.text}</div>
              <div className="font-bold text-yellow-900/80">{review.author}</div>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes review-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-review-marquee {
            display: inline-flex;
            min-width: 200%;
            animation: review-marquee 28s linear infinite;
          }
        `}</style>
      </div>
      <div className="w-24 border-b-4 border-yellow-400 mt-10" />
    </section>
  );
}
