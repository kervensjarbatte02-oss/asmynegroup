
"use client";
import React, { useEffect, useRef } from "react";

const HERO_BG = "/blog-header.jpg"; // Image personnalisée du header
const CATEGORIES = ["", "", "", "", ""];

export default function YontikonseyBlog() {
  // Référence pour le slider
  const sliderRef = useRef<HTMLDivElement>(null);

  // Défilement automatique
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    let scrollAmount = 0;
    const slideWidth = 340; // largeur approx. d'un slide (min-w-[320px] + gap)
    const interval = setInterval(() => {
      if (!slider) return;
      if (scrollAmount + slideWidth >= slider.scrollWidth - slider.clientWidth) {
        scrollAmount = 0;
      } else {
        scrollAmount += slideWidth;
      }
      slider.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen w-full bg-white">
      {/* HERO */}
      <section
        className="relative flex flex-col items-center justify-center min-h-[80vh] w-full overflow-hidden"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full pt-24 pb-16">
          <h1 className="text-white text-center font-serif text-6xl md:text-7xl font-light tracking-tight mb-6" style={{letterSpacing: "-0.04em"}}>
            Blog de Yontikonsey
          </h1>
          <div className="text-white text-center font-serif italic text-3xl md:text-4xl mb-2">Categorías</div>
          <div className="flex flex-col items-center mb-10">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-white animate-bounce">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
            </svg>
          </div>
          <div className="w-full max-w-4xl flex flex-row items-center justify-center gap-8 mt-2">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="flex flex-col items-center w-32">
                <span className="uppercase text-white tracking-widest text-sm font-semibold mb-2">{cat}</span>
                <span className="block w-16 h-px bg-white/80" />
              </div>
            ))}
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C480,120 960,0 1440,120 L1440,120 L0,120 Z" fill="#fff" />
        </svg>
      </section>

      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-16 px-4 mb-24 relative z-20 text-black">
        <div className="flex-1 flex flex-col items-start">
          <div className="relative w-[320px] h-[400px] mb-0">
            <div className="absolute -top-8 -left-8 w-[320px] h-[400px] bg-[#f9f6f3]" />
            <img src="/Algunos buenos consejos para un inmigrante que vive en la Dominican Republic.jpg" alt="Algunos buenos consejos para un inmigrante que vive en la República Dominicana" className="relative w-[320px] h-[400px] object-cover" />
          </div>
          <div className="block md:hidden w-[320px] pl-0 mt-8">
            <span className="block uppercase tracking-widest text-xs mb-2">Título</span>
            <h2 className="font-serif italic text-3xl font-normal mb-4">Aquí tienes algunas buenas actividades que un joven inmigrante puede hacer en Santo Domingo para vivir, desarrollarse y ganar dinero con dignidad.</h2>
            <ul className="text-gray-700 mb-6 max-w-xs list-disc list-inside">
              <li>Trabajos y servicios:</li>
              <li>Servicio al cliente en tiendas, restaurantes o call centers.</li>
              <li>Traducción de criollo haitiano – español – francés para ayudar a otros inmigrantes.</li>
              <li>Asistencia migratoria para ayudar a las personas a llenar documentos y obtener información.</li>
              <li>Reparto en moto o bicicleta.</li>
              <li>Limpieza de oficinas y apartamentos.</li>
              <li>Seguridad privada si tiene formación o experiencia.</li>
            </ul>
            <a href="/services/yontikonsey-blog/blogs/detail" className="block bg-[#f9f6f3] px-6 py-3 rounded tracking-widest text-xs font-semibold text-gray-800 border border-transparent hover:border-black transition w-fit">Leer más</a>
          </div>
        </div>

        <div className="flex-[2] flex flex-col gap-12">
          <div>
            <h3 className="font-serif italic text-2xl font-normal mb-8">Consejos prácticos para un inmigrante que vive en la República Dominicana</h3>
            <div className="mb-8">
              <span className="block uppercase tracking-widest text-xs mb-2">Artículo</span>
              <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                <a href="#" className="font-serif italic text-xl leading-snug hover:underline">Aprende español poco a poco.<br/>Aunque no lo hables perfectamente al principio, intenta aprender algunas palabras cada día.<br/>Eso te ayudará a conseguir trabajo, hacer amigos y entender mejor el sistema.</a>
                <span className="ml-4 text-2xl">→</span>
              </div>
            </div>
            <div className="mb-8">
              <span className="block uppercase tracking-widest text-xs text-gray-700 mb-2">Artículo</span>
              <div className="flex items-center justify-between border-b border-gray-300 pb-4">
                <a href="#" className="font-serif italic text-xl leading-snug hover:underline">Mantén siempre tus documentos en regla.<br/>Guarda copias de tu pasaporte, identificación, documentos migratorios y todos los papeles importantes en un lugar seguro.<br/>Eso puede ahorrarte muchos problemas.</a>
                <span className="ml-4 text-2xl">→</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block mt-8">
            <span className="block uppercase tracking-widest text-xs text-gray-700 mb-2">Artículo</span>
            <h2 className="font-serif italic text-3xl font-normal mb-4">Aquí tienes algunas buenas actividades que un joven inmigrante puede hacer en Santo Domingo para vivir, desarrollarse y ganar dinero con dignidad.</h2>
            <ul className="text-gray-700 mb-6 max-w-xs list-disc list-inside">
              <li>Trabajos y servicios:</li>
              <li>Servicio al cliente en tiendas, restaurantes o call centers.</li>
              <li>Traducción de criollo haitiano – español – francés para ayudar a otros inmigrantes.</li>
              <li>Asistencia migratoria para ayudar a las personas a llenar documentos y obtener información.</li>
              <li>Reparto en moto o bicicleta.</li>
              <li>Limpieza de oficinas y apartamentos.</li>
              <li>Seguridad privada si tiene formación o experiencia.</li>
            </ul>
            <a href="/services/yontikonsey-blog/blogs/detail" className="inline-block bg-[#f9f6f3] px-6 py-3 rounded tracking-widest text-xs font-semibold text-gray-800 border border-transparent hover:border-black transition">Leer más</a>
          </div>

          <div>
            <span className="block uppercase tracking-widest text-xs text-gray-700 mb-2">Artículo</span>
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 w-full">
              <ul className="font-serif italic text-xl leading-snug list-disc list-inside w-full">
                <li>Actividades en internet:</li>
                <li>Crear una página de Facebook o TikTok para compartir consejos sobre la vida de los inmigrantes.</li>
                <li>Hacer marketing digital para pequeños negocios.</li>
                <li>Vender ropa, productos de belleza o comida por internet.</li>
                <li>Aprender diseño gráfico o edición de videos.</li>
              </ul>
              <span className="ml-4 text-2xl">→</span>
            </div>
          </div>

          <div>
            <span className="block uppercase tracking-widest text-xs text-gray-700 mb-2">Artículo</span>
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 w-full">
              <ul className="font-serif italic text-xl leading-snug list-disc list-inside w-full">
                <li>Pequeños negocios sencillos:</li>
                <li>Vender comida casera, frituras, jugos, patés, etc.</li>
                <li>Vender recargas telefónicas o servicios de transferencias.</li>
                <li>Abrir un pequeño servicio de impresión, fotocopias o cyber.</li>
                <li>Hacer peinados, uñas o barbería si conoce el oficio.</li>
              </ul>
              <span className="ml-4 text-2xl">→</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-0 px-4 mt-24 mb-24">
        <div className="flex flex-col md:flex-row w-full bg-black p-8 md:p-16 rounded">
          <div className="flex-1 flex flex-col justify-center text-white min-w-[260px]">
            <span className="block uppercase tracking-widest text-xs mb-6 font-semibold">Publicación patrocinada</span>
            <h2 className="font-serif italic text-3xl md:text-4xl font-normal mb-6">
              UN BUEN CONSEJO PARA LOS INMIGRANTES
            </h2>
            <p className="mb-8 text-base md:text-lg leading-relaxed text-white/90">Vivir en un país extranjero no siempre es fácil. Habrá días difíciles, momentos de soledad y muchos desafíos, pero nunca debes rendirte. Cada esfuerzo, cada sacrificio y cada paso que das hoy puede abrirte grandes oportunidades mañana.<br/><br/>Aprende algo nuevo, trabaja con honestidad, ahorra dinero, rodéate de personas positivas y mantente enfocado en tus metas. No permitas que las dificultades cambien la persona que sueñas llegar a ser.<br/><br/>Recuerda siempre: tu situación actual es solo una etapa, no tu destino final.</p>
            <a href="/services/yontikonsey-blog/blogs/detail" className="inline-block bg-[#f9f6f3] px-6 py-3 rounded tracking-widest text-xs font-semibold text-black border border-transparent hover:border-black transition w-fit">Leer más</a>
          </div>
          <div className="flex-1 flex items-center justify-center relative mt-12 md:mt-0">
            <img src="/images/sponsored.png" alt="Patrocinado" className="mx-auto w-[320px] h-[320px] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-4 mt-24 mb-24">
        <h2 className="text-center font-serif italic text-4xl md:text-5xl font-normal mb-12 text-black">Popular</h2>
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-8 pb-4"
            style={{ overflowX: "hidden" }}
          >
            <div className="min-w-[320px] max-w-xs flex-shrink-0 snap-center flex flex-col items-center">
              <video src="/videos/video1.mp4" controls className="w-72 h-72 object-cover mb-6 bg-black" poster="/images/sponsored2.jpg" />
              <div className="w-full flex items-center mb-2">
                <span className="text-2xl mr-2 text-black">←</span>
                <h3 className="font-serif text-2xl font-normal text-black">Cómo empezar una nueva vida con dignidad</h3>
              </div>
              <p className="text-base text-gray-700 mb-8 text-center">Todo empieza con una idea. A veces solo necesitas un primer paso firme y una meta clara.</p>
              <a href="/services/yontikonsey-blog/blogs/detail" className="inline-block bg-[#f9f6f3] px-8 py-3 rounded tracking-widest text-base font-semibold text-black border border-transparent hover:border-black transition">Leer más</a>
            </div>
            <div className="min-w-[320px] max-w-xs flex-shrink-0 snap-center flex flex-col items-center">
              <video src="/videos/video2.mp4" controls className="w-72 h-72 object-cover mb-6 bg-black" poster="/images/popular2.jpg" />
              <div className="w-full flex items-center mb-2">
                <h3 className="font-serif text-2xl font-normal text-black">Pequeños negocios con gran futuro</h3>
              </div>
              <p className="text-base text-gray-700 mb-8 text-center">Con disciplina, servicio y constancia, un negocio pequeño puede convertirse en una oportunidad real.</p>
              <a href="/services/yontikonsey-blog/blogs/detail" className="inline-block bg-[#f9f6f3] px-8 py-3 rounded tracking-widest text-base font-semibold text-black border border-transparent hover:border-black transition">Leer más</a>
            </div>
            <div className="min-w-[320px] max-w-xs flex-shrink-0 snap-center flex flex-col items-center">
              <video src="/videos/video3.mp4" controls className="w-72 h-72 object-cover mb-6 bg-black" poster="/images/popular3.jpg" />
              <div className="w-full flex items-center mb-2">
                <h3 className="font-serif text-2xl font-normal text-black">Aprender, ahorrar y avanzar</h3>
                <span className="text-2xl ml-2 text-black">→</span>
              </div>
              <p className="text-base text-gray-700 mb-8 text-center">Cada día que aprendes te acercas más a una vida más estable y llena de oportunidades.</p>
              <a href="/services/yontikonsey-blog/blogs/detail" className="inline-block bg-[#f9f6f3] px-8 py-3 rounded tracking-widest text-base font-semibold text-black border border-transparent hover:border-black transition">Leer más</a>
            </div>
            <div className="min-w-[320px] max-w-xs flex-shrink-0 snap-center flex flex-col items-center">
              <video src="/videos/video4.mp4" controls className="w-72 h-72 object-cover mb-6 bg-black" poster="/images/popular4.jpg" />
              <div className="w-full flex items-center mb-2">
                <span className="text-2xl mr-2 text-black">→</span>
                <h3 className="font-serif text-2xl font-normal text-black">La importancia de una buena red de apoyo</h3>
              </div>
              <p className="text-base text-gray-700 mb-8 text-center">Las personas que te acompañan pueden marcar la diferencia en tu camino y en tus decisiones.</p>
              <a href="#" className="inline-block bg-[#f9f6f3] px-8 py-3 rounded tracking-widest text-base font-semibold text-black border border-transparent hover:border-black transition">Leer más</a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative flex flex-col items-center justify-center min-h-[60vh] w-full overflow-hidden"
        style={{
          backgroundImage: 'url(/images/freebie.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-16">
          <span className="block uppercase tracking-widest text-xs mb-6 font-semibold text-white text-center">Guía gratuita</span>
          <h2 className="text-white text-center font-serif italic text-4xl md:text-5xl font-normal mb-6">
            <span className="not-italic">Recibe un material gratuito </span>
            <span className="italic">a cambio de tu correo</span>
          </h2>
          <p className="text-white text-center mb-8 max-w-xl mx-auto text-base md:text-lg font-normal">
            Descubre un recurso práctico para orientarte mejor en tu proceso de adaptación, trabajo y desarrollo personal en República Dominicana.
          </p>
          <form className="flex flex-col md:flex-row gap-4 w-full max-w-xl mx-auto items-center justify-center">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full md:w-1/2 px-6 py-4 rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <button
              type="submit"
              className="w-full md:w-1/3 px-6 py-4 rounded bg-white text-black font-semibold tracking-widest border border-transparent hover:border-black transition"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>
      <div className="h-16 md:h-24" />

      <section className="w-full bg-black py-24 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 min-w-[320px]">
            <span className="block uppercase tracking-widest text-xs mb-6 font-semibold text-white">Suscríbete</span>
            <h2 className="text-white font-serif italic text-4xl md:text-5xl font-normal mb-6">
              <span className="not-italic">Mantente </span>
              <span className="italic">conectado</span>
              <span className="not-italic">y recibe contenido útil</span>
            </h2>
            <p className="text-white mb-8 max-w-xl text-base md:text-lg font-normal">
              Recibe consejos, recursos y noticias relevantes para tu crecimiento personal y profesional en tu nueva etapa.
            </p>
            <form className="flex flex-col gap-6 max-w-md">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-6 py-4 rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-4 rounded bg-[#f9f6f3] text-black font-semibold tracking-widest border border-transparent hover:border-white transition"
              >
                Enviar mensaje
              </button>
            </form>
            <div className="mt-8 text-white/80 text-sm">Respeta tu privacidad.</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative min-w-[320px]">
            <div className="absolute top-0 right-16 w-56 h-56 bg-white rounded shadow-lg overflow-hidden z-10">
              <img src="/images/optin2.jpg" alt="Suscripción 2" className="w-full h-full object-cover" />
            </div>
            <div className="relative top-32 left-0 w-64 h-64 bg-white rounded shadow-2xl overflow-hidden z-20">
              <img src="/images/optin1.jpg" alt="Suscripción 1" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
