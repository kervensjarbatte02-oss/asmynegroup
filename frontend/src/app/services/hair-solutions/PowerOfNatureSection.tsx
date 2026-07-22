"use client";
import React from "react";

export default function PowerOfNatureSection() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-center gap-20 py-24 px-4 rounded-2xl max-w-6xl mx-auto mt-16 shadow-2xl" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-6xl font-extrabold mb-6 text-yellow-400">EL PODER DE LA NATURALEZA</h2>
        <p className="text-2xl text-yellow-100 mb-8 max-w-xl">
          Shebas cuida y embellece el cabello con fórmulas inspiradas en la naturaleza, diseñadas para nutrir, fortalecer y realzar su belleza natural.
        </p>
        <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all">
          DESCUBRE EL CUIDADO NATURAL
        </button>
      </div>
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src="/images/nature.png"
          alt="The Power of Nature Hair Products"
          className="rounded-2xl object-cover w-full max-w-[540px] h-auto"
        />
      </div>
    </section>
  );
}
