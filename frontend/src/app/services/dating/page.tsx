
"use client";
import React from "react";
import Link from "next/link";

export default function DatingLanding() {
  return (
    <>
      <div className="relative min-h-screen flex flex-col justify-center items-center bg-black">
        <div className="absolute inset-0 z-0 bg-[#1b0f1f]">
          <img src="/dating-hero.png" alt="Fondo de encuentros" className="w-full h-full object-contain md:object-cover object-center" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <header className="relative z-10 w-full flex justify-between items-center px-8 pt-8">
          <div className="flex items-center gap-2">
            <span className="bg-pink-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-2xl font-bold">♥</span>
            <span className="text-white text-2xl font-extrabold tracking-wide">Asmyne Groupe</span>
          </div>
          <button className="text-white text-3xl focus:outline-none">
            <span className="sr-only">Abrir menú</span>
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>
          </button>
        </header>

        <main className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-4 text-center mt-24">
          <div className="flex gap-4 justify-center mb-6">
            <a href="#" className="text-white text-2xl hover:text-pink-400"><i className="fab fa-Asmyn-Groupe-f"></i></a>
            <a href="#" className="text-white text-2xl hover:text-pink-400"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-white text-2xl hover:text-pink-400"><i className="fab fa-youtube"></i></a>
            <a href="#" className="text-white text-2xl hover:text-pink-400"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-white text-2xl hover:text-pink-400"><i className="fab fa-tumblr"></i></a>
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-2 leading-tight">Encuentros para adultos<br />Haz una conexión real</h1>
          <p className="text-white text-lg md:text-2xl mb-8">Comienza a conocer personas que están listas para comprometerse hoy mismo.</p>
          <Link
            href="/inscription"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-10 py-4 rounded-full text-xl shadow-lg transition-all"
          >
            Empezar
          </Link>
        </main>

        <div className="w-full overflow-hidden pointer-events-none relative z-10" style={{height: '60px', marginTop: '-1px'}}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0,0 Q720,120 1440,0 L1440,60 L0,60 Z" fill="#fff" />
          </svg>
        </div>

        <section className="relative w-full flex flex-col items-center justify-center bg-pink-500 py-16">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center space-x-[-24px] z-10">
            <img src="/destinations/person1.png" alt="Persona 1" className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg" />
            <img src="/destinations/person2.png" alt="Persona 2" className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg z-20" />
            <img src="/destinations/person3.png" alt="Persona 3" className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-lg" />
            <img src="/destinations/person4.png" alt="Persona 4" className="w-14 h-14 rounded-full border-4 border-white object-cover shadow-lg" />
            <img src="/destinations/person5.png" alt="Persona 5" className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-lg" />
          </div>
          <div className="flex flex-col items-center justify-center z-20">
            <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-2">Inicia tu historia de amor</h2>
            <p className="text-white text-lg md:text-xl mb-8">Asmyne Groupe: encuentra el amor con nuestro sitio de citas.</p>
            <Link
              href="/connexion"
              className="bg-white text-pink-500 font-bold px-10 py-3 rounded-full text-lg shadow-lg hover:bg-pink-100 transition-all"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>
      </div>

      <section className="w-full bg-white py-16 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-black">
          El número 1 en confianza <span className="relative inline-block">
            <span className="z-10 relative text-pink-600 underline decoration-pink-300 decoration-4">Encuentros</span>
            <span className="absolute left-0 right-0 -bottom-1 h-2 bg-pink-200 rounded-full -z-10"></span>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl w-full px-4">
          <div className="flex flex-col items-center text-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4"><rect x="8" y="8" width="40" height="32" rx="4" stroke="#222" strokeWidth="2"/><circle cx="40" cy="16" r="8" fill="#EC008C" stroke="#fff" strokeWidth="2"/><path d="M36 16l2.5 2.5L44 13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            <h3 className="text-2xl font-bold mb-2 text-black">Comunidad increíble</h3>
            <p className="text-black">Caramelos, tarta, merengue y donas para una experiencia única.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4"><circle cx="28" cy="28" r="20" stroke="#222" strokeWidth="2"/><circle cx="36" cy="24" r="6" fill="#EC008C" stroke="#fff" strokeWidth="2"/><path d="M32 24l2.5 2.5L40 21" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M20 36c0-4 8-4 8 0" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
            <h3 className="text-2xl font-bold mb-2 text-black">Millones de miembros</h3>
            <p className="text-black">Caramelos, tarta, merengue y donas para una experiencia única.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4"><rect x="12" y="16" width="32" height="20" rx="4" stroke="#222" strokeWidth="2"/><rect x="24" y="8" width="8" height="8" rx="2" fill="#EC008C" stroke="#fff" strokeWidth="2"/><path d="M20 36h16" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
            <h3 className="text-2xl font-bold mb-2 text-black">Grupos privados</h3>
            <p className="text-black">Caramelos, tarta, merengue y donas para una experiencia única.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4"><rect x="8" y="16" width="40" height="24" rx="4" stroke="#222" strokeWidth="2"/><rect x="36" y="24" width="8" height="8" rx="2" fill="#EC008C" stroke="#fff" strokeWidth="2"/><path d="M16 32h16" stroke="#222" strokeWidth="2" strokeLinecap="round"/><rect x="32" y="36" width="8" height="8" rx="2" fill="#fff" stroke="#EC008C" strokeWidth="2"/><path d="M36 40v-4" stroke="#EC008C" strokeWidth="2" strokeLinecap="round"/></svg>
            <h3 className="text-2xl font-bold mb-2 text-black">Foros amigables</h3>
            <p className="text-black">Caramelos, tarta, merengue y donas para una experiencia única.</p>
          </div>
        </div>
      </section>

      <VideoSection />

      <section className="w-full bg-gray-50 py-16 flex flex-col items-center relative overflow-hidden">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-2 text-black">
          Explora los consejos de <span className="relative inline-block">
            <span className="z-10 relative text-pink-600 underline decoration-pink-300 decoration-4">Encuentros</span>
          </span>
        </h2>
        <p className="text-center text-xl text-black mb-10 font-semibold">Mantén la calma. Sé amable. Sé tú mismo.</p>
        <div className="flex flex-col items-center w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-md px-6 py-4 mb-8 text-black text-lg w-full text-left font-normal">
            Hola, soy Sarah y soy la primera IA de Encuentros para Asmyne Groupe. <span className="font-bold text-black">¿Cuáles son tus preferencias?</span>
          </div>
          <div className="flex flex-col gap-6 w-full">
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-full text-lg shadow-lg transition-all">Hombres</button>
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-full text-lg shadow-lg transition-all">Mujeres</button>
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-full text-lg shadow-lg transition-all">Otro</button>
          </div>
        </div>

        <svg className="absolute left-0 right-0 mx-auto top-0 bottom-0 h-full w-full pointer-events-none" viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 350 Q 250 50 450 200 Q 650 350 800 100" stroke="#F9A8D4" strokeWidth="2" strokeDasharray="8 8" fill="none" />
        </svg>
      </section>

      <section className="w-full py-16 flex flex-col items-center bg-gradient-to-br from-pink-500 via-white to-pink-100">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-12 text-pink-600">Haz de Asmyne tu lugar favorito</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full px-4">
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6">
            <img src="/destinations/Asmyne1.png" alt="Aplicación de chat" className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-pink-600 text-xl font-extrabold mb-2 text-left w-full">Asmyne es tu aplicación de chat</h3>
            <p className="text-pink-500 text-left w-full">Conoce rápidamente a nuevas personas que buscan lo mismo que tú.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6">
            <img src="/destinations/Asmyne2.png" alt="Filtrar por perfiles" className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-pink-600 text-xl font-extrabold mb-2 text-left w-full">Filtra por perfiles</h3>
            <p className="text-pink-500 text-left w-full">Encuentra personas que comparten tu forma de ser y lo que te importa.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6">
            <img src="/destinations/Asmyne3.png" alt="Muéstrate en directo" className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-pink-600 text-xl font-extrabold mb-2 text-left w-full">Muéstrate en directo</h3>
            <p className="text-pink-500 text-left w-full">Chatea por video con personas nuevas en tiempo real y conócelas mejor.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6">
            <img src="/destinations/Asmyne4.png" alt="Tus citas comienzan" className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-pink-600 text-xl font-extrabold mb-2 text-left w-full">Tus citas comienzan</h3>
            <p className="text-pink-500 text-left w-full">Descubre nuevos singles, chatea y flirtea: Asmyne hace que el dating en línea sea fácil.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function VideoSection() {
  return (
    <section className="w-full bg-gray-50 flex justify-center items-center py-8">
      <div className="relative w-full max-w-4xl aspect-video flex justify-center items-center overflow-hidden rounded-lg shadow-lg">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/destinations/iloveyou.mp4" type="video/mp4" />
          Tu navegador no admite la etiqueta de video.
        </video>
      </div>
    </section>
  );
}
