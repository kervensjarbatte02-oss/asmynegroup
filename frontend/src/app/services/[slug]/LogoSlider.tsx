"use client";
import React from "react";

const logos = [
  "/logo-slider-1.png",
  "/logo-slider-2.png",
  "/logo-slider-3.png",
  "/logo-slider-4.png",
  "/logo-slider-5.png"
];

export default function LogoSlider() {
  const [index, setIndex] = React.useState(0);
  const visible = 3;
  const maxIndex = logos.length - visible;

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(maxIndex, i + 1));

  return (
    <div className="w-full flex flex-col items-center py-8 bg-white">
      <div className="flex items-center gap-2">
        <button onClick={prev} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30" disabled={index === 0}>&lt;</button>
        <div className="flex gap-8 overflow-hidden w-[600px] max-w-full">
          {logos.slice(index, index + visible).map((src, i) => (
            <img key={src} src={src} alt={`Logo ${i+1}`} className="h-24 w-auto object-contain" />
          ))}
        </div>
        <button onClick={next} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30" disabled={index === maxIndex}>&gt;</button>
      </div>
    </div>
  );
}