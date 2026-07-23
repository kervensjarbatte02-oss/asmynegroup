"use client";
import { FaUser, FaEnvelope, FaPhone, FaCommentDots, FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt, FaCheckCircle, FaLock } from "react-icons/fa";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [avatar, setAvatar] = useState("/destinations/person1.png"); // Remplacez par un vrai chemin si besoin

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  }
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a174e] via-[#1e2746] to-[#111216] flex flex-col items-center justify-center pt-28 pb-16 px-2 relative overflow-hidden">
      {/* Fond animé premium */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-tr from-accent/30 to-primary/10 rounded-full blur-2xl animate-pulse-slower" />
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight animate-fade-in">Contáctanos</h1>
      <p className="mb-12 text-xl text-white/80 max-w-2xl text-center animate-fade-in">Une question ? Un projet ? Besoin d'accompagnement ? Remplissez le formulaire premium ci-dessous ou contactez-nous directement par email.</p>
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-12 items-stretch animate-fade-in-up z-10">
        {/* Carte formulaire premium */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl pt-20 pb-10 px-6 md:pt-24 md:pb-16 md:px-16 flex flex-col gap-8 border border-white/10 relative overflow-visible">
          {/* Avatar décoratif */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent border-4 border-white shadow-lg flex items-center justify-center animate-bounce-slow z-20">
            <video src="/videos/video1.mp4" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow bg-black" poster="/destinations/person1.png" autoPlay loop muted />
            {!avatar && <FaUser style={{ color: 'white', fontSize: '2rem' }} />}
          </div>
          {sent && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-semibold text-lg animate-fade-in z-20">
              <FaCheckCircle style={{ color: '#86efac', fontSize: '1.5rem' }} /> Message envoyé avec succès !
            </div>
          )}
          <form className="flex flex-col gap-6 mt-12" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
                <FaUser style={{ color: 'var(--tw-color-primary, #0ea5e9)', fontSize: '1.25rem' }} />
                <input className="bg-transparent outline-none w-full text-white placeholder-white/70 text-lg" placeholder="Votre nom" required />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
                <FaEnvelope style={{ color: 'var(--tw-color-primary, #0ea5e9)', fontSize: '1.25rem' }} />
                <input className="bg-transparent outline-none w-full text-white placeholder-white/70 text-lg" placeholder="Votre email" type="email" required />
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
              <FaPhone style={{ color: 'var(--tw-color-primary, #0ea5e9)', fontSize: '1.25rem' }} />
              <input className="bg-transparent outline-none w-full text-white placeholder-white/70 text-lg" placeholder="Votre téléphone (optionnel)" type="tel" />
            </div>
            <div className="flex items-start gap-3 bg-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
              <FaCommentDots style={{ color: 'var(--tw-color-primary, #0ea5e9)', fontSize: '1.25rem', marginTop: '0.25rem' }} />
              <textarea className="bg-transparent outline-none w-full text-white placeholder-white/70 text-lg resize-none min-h-[120px]" placeholder="Votre message" required />
            </div>
            <button type="submit" className="mt-2 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold tracking-wide text-lg shadow-xl hover:scale-105 transition-all duration-200 border-2 border-white/10 relative overflow-hidden group">
              <span className="relative z-10">Envoyer le message</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaCheckCircle style={{ color: '#86efac', fontSize: '1.5rem' }} />
              </span>
            </button>
          </form>
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 bg-green-700/30 text-green-200 px-3 py-1 rounded-full text-xs font-semibold"><FaCheckCircle style={{ color: '#bbf7d0', fontSize: '1rem' }} /> Réponse sous 24h</span>
              <span className="inline-flex items-center gap-1 bg-blue-700/30 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold"><FaLock style={{ color: '#60a5fa', fontSize: '1rem' }} /> Données sécurisées</span>
            </div>
            <div className="text-center text-white/60 text-sm">Nous vous répondrons sous 24h. Vos informations restent confidentielles.</div>
          </div>

          {/* Carrousel vidéos témoignages/présentation */}
          <div className="w-full flex flex-col items-center mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Découvrez nos vidéos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <video src="/videos/video1.mp4" className="w-full h-40 rounded-xl object-cover border-2 border-white/10 shadow" autoPlay loop muted controls />
              <video src="/videos/video2.mp4" className="w-full h-40 rounded-xl object-cover border-2 border-white/10 shadow" autoPlay loop muted controls />
              <video src="/videos/video3.mp4" className="w-full h-40 rounded-xl object-cover border-2 border-white/10 shadow" autoPlay loop muted controls />
              <video src="/videos/video4.mp4" className="w-full h-40 rounded-xl object-cover border-2 border-white/10 shadow" autoPlay loop muted controls />
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex justify-center gap-6 mt-8">
            <a href="https://www.facebook.com/share/1KGpFstMcy/" className="text-white/80 hover:text-primary text-2xl transition" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook style={{ color: 'white', opacity: 0.8, fontSize: '2rem' }} /></a>
            <a href="https://www.instagram.com/asmynegroup?igsh=M3FpNzA2dTZzdXl4" className="text-white/80 hover:text-primary text-2xl transition" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram style={{ color: 'white', opacity: 0.8, fontSize: '2rem' }} /></a>
            <a href="https://www.youtube.com/@asmynegroup" className="text-white/80 hover:text-primary text-2xl transition" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><FaYoutube style={{ color: 'white', opacity: 0.8, fontSize: '2rem' }} /></a>
          </div>
        </div>
        {/* Carte info & carte */}
        <div className="flex-1 flex flex-col gap-8 justify-center items-center bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-xl p-8 border border-white/10 min-h-[420px] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <FaMapMarkerAlt style={{ color: 'var(--tw-color-accent, #f59e42)', fontSize: '1.5rem' }} />
            <span className="text-lg text-white font-semibold">Bureau principal</span>
          </div>
          <div className="text-white/80 text-center mb-2">Casa 12
Calle primera 
Urb Mirador Isabela 
Sector Villa Mella 
Próximo a la avenida Jacobo Majluta 
Santo Domingo Norte
Rep Dom<br/></div>
          <div className="text-white/80 text-center mb-2">Support 24/7 : <span className="font-semibold text-white">1-(809) 308-6370</span></div>
          <div className="text-white/80 text-center mb-2">Email : <span className="font-semibold text-white">contact@asmyne.com</span></div>
          {/* Carte Google Maps intégrée (exemple, à remplacer par votre iframe réel si besoin) */}
          <div className="rounded-2xl overflow-hidden shadow-lg w-full h-56 border-2 border-white/10">
            <iframe
              title="Carte Asmyne"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-73.935242%2C40.730610%2C-73.935242%2C40.730610&amp;layer=mapnik"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
