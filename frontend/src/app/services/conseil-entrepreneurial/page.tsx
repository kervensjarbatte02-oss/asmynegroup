"use client";

import { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";
import ChatWidget from "./ChatWidget";




export default function ConseilEntrepreneurialPage() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Disparaît progressivement sur les 100 premiers pixels
      const newOpacity = Math.max(0, 1 - scrollY / 100);
      setOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [showBot, setShowBot] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav
        className="w-full bg-black text-white py-3 px-8 flex items-center justify-between shadow z-30 fixed top-0 left-0 transition-opacity duration-300"
        style={{ opacity }}
      >
        {/* Logo et titre à gauche */}
        <div className="flex items-center gap-2 min-w-[170px]">
          <img src="/asmyne-groupe-logo.png" alt="Asmyne Group" width={40} height={40} className="object-contain rounded-full border-2 border-[#f2c46f] bg-black" />
          <span className="text-lg font-bold tracking-tight text-[#f2c46f] ml-2">Asmyne Group</span>
        </div>
        {/* Contact à droite */}
        <div className="text-sm md:text-base font-medium whitespace-nowrap flex items-center gap-1 ml-auto">
          <a
            href="https://wa.me/18093086370?text=Bonjour%20Asmyne%20Group%2C%20j'ai%20besoin%20d'informations."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-white"
            title="Écrire sur WhatsApp"
          >
            +1 (809) 308-6370
          </a>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center min-h-[120vh] px-4 bg-[url('/images/entrepreneur.jpeg')] bg-cover bg-center pt-40">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-[#f2c46f] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-center">Asesoría empresarial</h1>
      </section>

      {/* Section 4 blocs Asesoría empresarial */}
      <section className="w-full bg-black py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#f2c46f] text-center mb-12 max-w-3xl">
          Nuestras especialidades para impulsar el éxito de tu emprendimiento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-6xl">
          {/* Bloc 1 */}
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 text-[#f2c46f]">
              {/* Icône générique */}
              <svg width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <h3 className="font-bold text-xl mb-2 text-[#f2c46f]">Nuestros Servicios</h3>
            <p className="text-[#f2c46f]">1. Creación y Registro de Empresas

Registro de compañías

Constitución legal de empresas

Registro mercantil

Creación de SRL, EIRL y otras estructuras

Reserva de nombre comercial

Registro de marca

Elaboración de estatutos

Formalización de negocios

Apertura legal para emprendedores</p>
          </div>
          {/* Bloc 2 */}
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 text-[#f2c46f]">
              <svg width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
            </span>
            <h3 className="font-bold text-xl mb-2 text-[#f2c46f]">Asesoría para Emprendedores</h3>
            <p className="text-[#f2c46f]">Orientación para nuevos negocios

Evaluación de ideas de negocio

Planificación empresarial

Consultoría estratégica

Organización administrativa

Desarrollo de modelo de negocio

Mentoría para emprendedores

Acompañamiento empresarial
</p>
          </div>
          {/* Bloc 3 */}
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 text-[#f2c46f]">
              <svg width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75"/></svg>
            </span>
            <h3 className="font-bold text-xl mb-2 text-[#f2c46f]">Servicios Migratorios y Documentación</h3>
            <p className="text-[#f2c46f]">Renovación de documentos

Asistencia migratoria

Preparación de expedientes

Traducción de documentos

Legalización de documentos

Apostilla

Formularios y procesos administrativos
</p>
          </div>
          {/* Bloc 4 */}
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 text-[#f2c46f]">
              <svg width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M16 2v4M8 2v4M2 10h20"/></svg>
            </span>
            <h3 className="font-bold text-xl mb-2 text-[#f2c46f]">Servicios Financieros y Administrativos</h3>
            <p className="text-[#f2c46f]">Apertura de cuentas empresariales

Organización financiera

Control administrativo

Facturación empresarial

Gestión de pagos

Elaboración de cotizaciones

Presupuestos empresariales

Manejo de documentos</p>
          </div>
        </div>
      </section>

      {/* Section Témoignages Slider */}
      <section className="w-full bg-black py-16 px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 max-w-3xl">
          
        </h2>
        <TestimonialSlider />
      </section>
      {/* Section chiffres clés professionnelle */}
      <section className="w-full bg-black py-20 px-4 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#f2c46f] text-center mb-14 max-w-4xl leading-tight drop-shadow-lg uppercase tracking-wide">
          Acompañando a los emprendedores hacia el éxito desde hace más de 10 años
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-12 md:gap-24 w-full max-w-6xl">
          {/* Chiffre 1 */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-6xl md:text-7xl font-extrabold text-[#f2c46f] mb-3 font-mono">500+</span>
            <span className="font-semibold text-lg md:text-xl text-[#f2c46f] text-center mt-2">Empresas acompañadas</span>
          </div>
          {/* Chiffre 2 */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-6xl md:text-7xl font-extrabold text-[#f2c46f] mb-3 font-mono">2000+</span>
            <span className="font-semibold text-lg md:text-xl text-[#f2c46f] text-center mt-2">Proyectos empresariales<br className='md:hidden'/> realizados</span>
          </div>
          {/* Chiffre 3 */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-6xl md:text-7xl font-extrabold text-[#f2c46f] mb-3 font-mono">12 Ans</span>
            <span className="font-semibold text-lg md:text-xl text-[#f2c46f] text-center mt-2">de experiencia al servicio de los<br className='md:hidden'/> emprendedores</span>
          </div>
        </div>
      </section>
      {/* Section mini-formulaire de contact large */}
      <section className="w-full bg-black py-16 px-4 flex flex-col items-center border-t border-[#f2c46f]">
        <h2 className="text-3xl md:text-4xl font-bold text-[#f2c46f] text-center mb-8">Contáctanos</h2>
        <form className="w-full max-w-2xl bg-[#181818] rounded-xl p-8 flex flex-col gap-5 border border-[#f2c46f] shadow-lg">
          <label htmlFor="servicio" className="text-[#f2c46f] font-semibold">¿Qué servicio le interesa?</label>
          <select
            id="servicio"
            name="servicio"
            className="px-4 py-2 rounded bg-black text-white border border-[#f2c46f] focus:outline-none focus:ring-2 focus:ring-[#f2c46f]"
            required
          >
            <option value="">Seleccione un servicio</option>
            <option value="creacion_empresa">Creación de empresa</option>
            <option value="apertura_cuenta">Apertura de cuenta bancaria</option>
            <option value="gestion_documentos">Gestión de documentos</option>
            <option value="asesoria_fiscal">Asesoría fiscal y contable</option>
            <option value="coaching">Coaching y formación</option>
            <option value="red_contactos">Red de contactos y networking</option>
            <option value="otros">Otros</option>
          </select>
          <input
            type="text"
            name="nom"
            placeholder="Votre nom"
            className="px-4 py-2 rounded bg-black text-white border border-[#f2c46f] focus:outline-none focus:ring-2 focus:ring-[#f2c46f]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            className="px-4 py-2 rounded bg-black text-white border border-[#f2c46f] focus:outline-none focus:ring-2 focus:ring-[#f2c46f]"
            required
          />
          <textarea
            name="message"
            placeholder="Votre message"
            rows={4}
            className="px-4 py-2 rounded bg-black text-white border border-[#f2c46f] focus:outline-none focus:ring-2 focus:ring-[#f2c46f]"
            required
          />
          <button
            type="submit"
            className="bg-[#f2c46f] text-black font-bold py-2 rounded hover:bg-yellow-400 transition"
          >
            Envoyer
          </button>
        </form>
      </section>
      {/* Footer unique pour cette page */}
      <footer className="w-full bg-black text-[#f2c46f] pt-12 pb-6 px-4 border-t border-[#f2c46f] mt-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
          {/* Bloc logo & description */}
          <div className="flex-1 min-w-[220px] flex flex-col items-center md:items-start mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <img src="/asmyne-groupe-logo.png" alt="Asmyne Group" width={40} height={40} className="object-contain rounded-full border-2 border-[#f2c46f] bg-black" />
              <span className="text-2xl font-extrabold tracking-wide">Asmyne Group</span>
            </div>
            <div className="text-[#f2c46f]/90 mb-2 font-semibold">Consultoría Empresarial</div>
            <div className="text-[#f2c46f]/70 text-sm">Acompañamiento, formación y soluciones a medida para emprendedores, pymes y creadores de proyectos.</div>
          </div>
          {/* Bloc liens rapides */}
          <div className="flex-1 min-w-[180px]">
            <div className="font-bold mb-3 text-lg">Enlaces rápidos</div>
            <ul className="space-y-2 text-[#f2c46f]/80">
              <li>
                <a href="#specialidades" className="hover:text-white font-semibold">Especialidades</a>
                <div className="text-xs text-[#f2c46f]/60 ml-2">Nuestros servicios clave para emprendedores</div>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-white font-semibold">Testimonios</a>
                <div className="text-xs text-[#f2c46f]/60 ml-2">Opiniones de clientes satisfechos</div>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white font-semibold">Contacto</a>
                <div className="text-xs text-[#f2c46f]/60 ml-2">Solicita tu asesoría personalizada</div>
              </li>
              <li>
                <a href="#equipo" className="hover:text-white font-semibold">Nuestro equipo</a>
                <div className="text-xs text-[#f2c46f]/60 ml-2">Expertos a tu servicio</div>
              </li>
              <li>
                <a href="#faq" className="hover:text-white font-semibold">Preguntas frecuentes</a>
                <div className="text-xs text-[#f2c46f]/60 ml-2">Respuestas a tus dudas</div>
              </li>
            </ul>
          </div>
          {/* Bloc coordonnées */}
          <div className="flex-1 min-w-[220px]">
            <div className="font-bold mb-3 text-lg">Contacto</div>
            <div className="mb-2">WhatsApp: <a href="https://wa.me/18093086370" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">+1 (809) 308-6370</a></div>
            <div className="mb-2">Correo: <a href="mailto:contact@asmyne.com" className="underline hover:text-white">contact@asmyne.com</a></div>
            <div className="mb-2">Dirección:<br/>Casa 12 Calle primera Urb Mirador Isabela, Villa Mella, Santo Domingo Norte, Rep. Dom.</div>
          </div>
          {/* Bloc réseaux sociaux */}
          <div className="flex-1 min-w-[160px]">
            <div className="font-bold mb-3 text-lg">Síguenos</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white" aria-label="Facebook"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M15 8h-2a1 1 0 0 0-1 1v2h3l-.5 2H12v6h-2v-6H8v-2h2V9a3 3 0 0 1 3-3h2v2z" fill="currentColor"/></svg></a>
              <a href="#" className="hover:text-white" aria-label="Instagram"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg></a>
              <a href="#" className="hover:text-white" aria-label="LinkedIn"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><rect x="8" y="10" width="2" height="6" fill="currentColor"/><rect x="14" y="10" width="2" height="6" fill="currentColor"/><circle cx="9" cy="8" r="1" fill="currentColor"/><circle cx="15" cy="8" r="1" fill="currentColor"/></svg></a>
            </div>
          </div>
        </div>
        <hr className="my-8 border-[#f2c46f]/20" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-4 text-[#f2c46f]/70 text-sm">
          <div>©2026 Asmyne Group. Todos los derechos reservados.</div>
          <div><a href="#" className="underline hover:text-white">Aviso legal</a></div>
        </div>
      </footer>

      {/* Bouton robot flottant */}
      <button
        onClick={() => setShowBot(true)}
        className="fixed z-50 bottom-6 right-6 bg-[#f2c46f] text-black shadow-lg rounded-full w-16 h-16 flex items-center justify-center hover:bg-yellow-400 border-4 border-black transition-all"
        title="Asistente AI"
        aria-label="Asistente AI"
      >
        <FaRobot className="w-8 h-8" />
      </button>

      {/* Widget chatbot flottant en bas à droite */}
      {showBot && (
        <div className="fixed z-50 bottom-24 right-6 w-[350px] max-w-[95vw] bg-black rounded-2xl border-2 border-[#f2c46f] shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-black border-b border-yellow-500">
            <span className="font-bold text-yellow-400 text-base">Asesoría Empresarial</span>
            <button
              onClick={() => setShowBot(false)}
              className="text-yellow-400 bg-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-500 hover:text-black border border-yellow-500 transition"
              title="Cerrar"
              aria-label="Cerrar"
            >✕</button>
          </div>
          <div className="flex-1">
            <ChatWidget onClose={() => setShowBot(false)} />
          </div>
        </div>
      )}
    </>
  );
}

// Slider simple sans dépendance externe
const testimonials = [
  {
    text: "Convierte tu idea en una empresa real.\nTe ayudamos a crear, organizar y desarrollar tu negocio de manera profesional, rápida y segura.\nBrindamos asesoría personalizada para emprendedores, comerciantes, inmigrantes y empresas que desean crecer local e internacionalmente.",
    author: "ASMYNE PIERRE.",
    role: "CEO",
    logo: "/logo-slider-1.png",
    image: "/blog-header.jpg"
  },
  {
    text: "Leur réseau d'experts nous a permis de rencontrer des partenaires clés pour accélérer notre développement.",
    author: "Jean M.",
    role: "CEO",
    logo: "/reseau-logo.png",
    image: "/reseau-site.png"
  },
  {
    text: "Les formations et le coaching personnalisé nous ont fait gagner en compétences et en efficacité.",
    author: "Sophie L.",
    role: "Entrepreneure",
    logo: "/coaching-logo.png",
    image: "/coaching-site.png"
  }
];

function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  const t = testimonials[index];
  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 relative bg-black rounded-2xl p-8 border-2 border-[#f2c46f] shadow-xl">
      <button
        onClick={prev}
        className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 text-[#f2c46f] text-4xl font-bold bg-transparent border-none cursor-pointer hover:scale-125 transition"
        aria-label="Précédent"
      >&#60;</button>
      <div className="flex-1 text-[#f2c46f] text-2xl italic font-light flex flex-col gap-6">
        <p>"{t.text}"</p>
        <div className="flex items-center gap-3 mt-4">
          {t.logo && <img src={t.logo} alt={t.author} className="h-10 w-10 object-contain bg-white rounded-full p-1 border-2 border-[#f2c46f]" />}
          <span className="font-bold text-[#f2c46f]">- {t.author}</span>
          <span className="text-base font-normal text-[#f2c46f]">, {t.role}</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img src={t.image} alt="Site" className="rounded-xl shadow-2xl max-h-72 w-auto object-cover border-2 border-[#f2c46f] bg-black" />
      </div>
      <button
        onClick={next}
        className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 text-[#f2c46f] text-4xl font-bold bg-transparent border-none cursor-pointer hover:scale-125 transition"
        aria-label="Suivant"
      >&#62;</button>
    </div>
  );
}
