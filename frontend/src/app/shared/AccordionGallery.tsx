"use client";
import React, { useState } from "react";
import Image from "next/image";

const items = [
  {
    title: "Temporal de trabajo",
    content:
      "I work almost exclusively with natural and available light, chasing the golden glow that makes images feel warm, timeless, and alive.",
    image: "/images/a.png",
  },
  {
    title: "Permiso de Estudiante",
    content:
      "Posing has its place, but I'll always choose a genuine laugh over a perfect pose. Real moments are what you'll treasure most.",
    image: "/images/b.png",
  },
  {
    title: "Residencia Temporal",
    content:
      "My editing is refined and restrained—enhancing what's already there, never overprocessed. Your images should still feel beautiful in 30 years.",
    image: "/images/c.png",
  },
];

export default function AccordionGallery() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="w-full bg-[#050c24] py-8 px-2 md:px-8 flex flex-col md:flex-row gap-4 items-stretch rounded-xl my-12">
      <div className="flex-1 flex flex-col gap-4">
        {items.map((item, idx) => (
          <div
            key={item.title}
            className={`bg-[#0a174e] rounded-md p-6 shadow transition-all border-b-2 border-[#14213d] ${openIndex === idx ? "" : "hover:bg-[#181f38] cursor-pointer"}`}
            onClick={() => setOpenIndex(idx)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#e6b85c] mb-2">{item.title}</h2>
              <span className="text-2xl text-[#e6b85c]">{openIndex === idx ? "\u25B2" : "\u25BC"}</span>
            </div>
            {openIndex === idx && (
              <p className="text-[#e6b85c]/90 text-base md:text-lg mt-2">{item.content}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={items[openIndex].image}
            alt={items[openIndex].title}
            width={600}
            height={400}
            className="rounded-md object-cover w-full h-auto max-h-[400px] shadow-lg border-4 border-[#e6b85c]"
          />
        </div>
      </div>
    </section>
  );
}
