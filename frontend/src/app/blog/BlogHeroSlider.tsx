"use client";
import { useEffect, useRef, useState } from "react";

const images = [
  "/images/blog-slider1.jpg",
  "/images/blog-slider2.jpg",
  "/images/blog-slider3.jpg"
];

export default function BlogHeroSlider() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden rounded-b-2xl shadow-lg mb-8 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: `url(${images[current]})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Overlay pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a174e]/80 to-transparent z-20" />
      <div className="relative z-30 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow mb-2 text-center">Bienvenue sur le Blog</h1>
        <p className="text-lg md:text-2xl text-blue-100 text-center max-w-2xl">Inspirez-vous, informez-vous et découvrez nos dernières actualités et conseils digitaux.</p>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, idx) => (
          <span key={idx} className={`w-3 h-3 rounded-full bg-white transition-all duration-300 ${idx === current ? 'opacity-100' : 'opacity-40'}`}></span>
        ))}
      </div>
    </div>
  );
}
