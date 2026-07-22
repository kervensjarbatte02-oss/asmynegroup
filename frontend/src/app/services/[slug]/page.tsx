import AccordionGallery from "../../shared/AccordionGallery";
import ImmigrationFooter from "./ImmigrationFooter";
import ImmigrationNavbar from "./ImmigrationNavbar";
import MiniMigrationAssistant from "./MiniMigrationAssistant";

// Carrousel de 4 cartes, 2 visibles, défilement automatique
function CarouselCards() {
  const carouselData = [
    {
      img: "/images/Asly Lico Charles P Administrador.png",
      title: "Asly Lico Charles P.",
      desc: "Administrador"
    },
    {
      img: "/images/Genesis.png",
      title: "Génesis Gabriela Pérez Sánchez ",
      desc: "Community Manager y Relaciones Públicas"
    },
    {
      img: "/images/Charles.png",
      title: "Charles Frantzo",
      desc: "Customers Services superviseur"
    },
    {
      img: "/images/blog-hero.jpeg",
      title: "Asmyne Pierre",
      desc: "C.E.O"
    }
  ];

  const loopData = [...carouselData, ...carouselData];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-[#0a174e] to-[#050c24]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#e6b85c] mb-3">Nuestro Equipo</h2>
        <p className="text-center text-[#e6b85c]/80 mb-10">Nuestro compromiso es brindarte la mejor asistencia en cada paso..</p>

        <div className="overflow-hidden">
          <div className="flex w-max gap-6 carousel-cards-track">
            {loopData.map((item, idx) => (
              <article
                key={`${item.title}-${idx}`}
                className="w-[250px] md:w-[280px] shrink-0 rounded-3xl overflow-hidden bg-white/90 shadow-xl transition-transform duration-300 hover:-translate-y-1"
              >
                <img src={item.img} alt={item.title} className="h-[260px] w-full object-cover" />
                <div className="p-5 bg-[#e6eef8]">
                  <h3 className="text-4xl font-extrabold tracking-tight text-[#0a174e] mb-3">{item.title}</h3>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-[#2563eb] text-white">
                    {item.desc}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";

function ImmigrationHero() {
  return (
    <section
      className="w-full min-h-[600px] md:min-h-[900px] bg-center bg-cover flex items-center justify-center relative animate-fade-in"
      style={{
        backgroundImage: 'url(/images/real-estate-building.jpeg)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="text-center z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#e6b85c] drop-shadow-lg mb-4 animate-fade-in">Consultora Migratoria</h1>
        <p className="text-lg md:text-2xl text-white/90 font-medium mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>Tu aliado en cada etapa del viaje</p>
        <a href="https://wa.me/18093086370?text=Hola%2C%20quiero%20hablar%20con%20un%20asesor%20migratorio." target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 rounded-full bg-[#e6b85c] text-[#050c24] font-bold text-lg shadow-lg hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#e6b85c]/60 transition-all duration-300 animate-fade-in" style={{animationDelay: '0.4s'}}>Descubrir más</a>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050c24]/80 pointer-events-none" />
    </section>
  );
}

export default function ConseilMigratoirePage() {
  return (
    <div className="bg-[#050c24] min-h-screen w-full font-sans overflow-x-hidden">
      <ImmigrationNavbar />
      <ImmigrationHero />


      {/* Section style classique : texte à gauche, 2 grandes cartes à droite, fond bleu foncé */}
      <section className="w-full py-16 bg-[#0a174e] animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-start md:items-stretch">
          {/* Texte à gauche */}
          <div className="flex-1 min-w-[260px] flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-[#e6b85c] uppercase mb-2 tracking-wide">Construyendo tu visión</h3>
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">¿Por qué elegir a Asmyne Pierre?</h2>
            <div className="border-t border-[#e6b85c]/40 my-4 w-3/4" />
            <p className="text-[#e6b85c]/90 mb-4">Con más de 25 años de experiencia en República Dominicana, Asmyne Pierre ofrece una asesoría migratoria integral, clara y enfocada en resultados.</p>
            <ul className="text-[#e6b85c]/90 mb-6 space-y-1">
              <li>✔ Experiencia sólida en procesos migratorios</li>
              <li>✔ Atención personalizada en cada etapa</li>
              <li>✔ Transparencia, ética y responsabilidad profesional</li>
              <li>✔ Acompañamiento paso a paso hasta la resolución del trámite</li>
              <li>✔ Confidencialidad y compromiso con cada cliente</li>
            </ul>
            <p className="text-[#e6b85c]/70 text-sm">Si necesitas apoyo con tus trámites migratorios en República Dominicana, recibirás orientación especializada para residencia, visas, regularización migratoria, nacionalidad y documentación legal. Nuestro enfoque es responsable, seguro y confiable para que avances con tranquilidad.</p>
          </div>
          {/* Une grande carte à droite */}
          <div className="flex-1 flex flex-col md:flex-row gap-8 w-full items-stretch justify-center">
            <div className="flex-1 flex flex-col items-center justify-center min-w-[220px] max-w-full bg-[#0a174e] p-0 shadow-none border-none" style={{minHeight: '340px'}}>
              <img src="/blog-header.jpg" alt="Accompagnement migratoire professionnel" className="h-[400px] w-full object-cover rounded-xl mb-0" />
            </div>
          </div>
        </div>
      </section>
      {/* Section Missions */}
      <section id="misiones" className="w-full py-20 animate-fade-in">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-[#e6b85c] mb-4">Nuestras principales misiones</h2>
          <p className="text-center text-[#e6b85c]/80 mb-16 max-w-2xl mx-auto">Descubre cómo nuestra consultora migratoria te acompaña en cada etapa: trámites administrativos, preparación para el viaje e integración exitosa.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Passeport */}
            <div className="flex flex-col items-center text-center bg-[#0a174e]/60 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in group focus-within:ring-4 focus-within:ring-[#e6b85c]/40">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                <img src="/images/service-migratoire.png" alt="Asistencia administrativa" className="h-14 w-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#e6b85c] mb-2 transition-colors duration-300 group-hover:text-white">Asistencia administrativa</h3>
              <p className="text-[#e6b85c]/80 mb-4">Te ayudamos a reunir todos los documentos necesarios para tus trámites migratorios: pasaporte, visas y formularios oficiales.</p>
              <a href="/services/yontikonsey-blog" target="_blank" rel="noopener noreferrer" className="font-bold text-[#e6b85c] relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e6b85c] after:transition-all after:duration-300 hover:after:w-full hover:after:h-0.5 focus:outline-none focus:ring-2 focus:ring-[#e6b85c]">En savoir plus</a>
            </div>
            {/* Avion */}
            <div className="flex flex-col items-center text-center bg-[#0a174e]/60 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in group focus-within:ring-4 focus-within:ring-[#e6b85c]/40">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                <img src="/images/service-voyage.png" alt="Preparación para el viaje" className="h-14 w-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#e6b85c] mb-2 transition-colors duration-300 group-hover:text-white">Preparación para el viaje</h3>
              <p className="text-[#e6b85c]/80 mb-4">Asesoría personalizada para organizar tu viaje: boletos de avión, seguro, lista de verificación y acompañamiento logístico.</p>
              <a href="/services/yontikonsey-blog" target="_blank" rel="noopener noreferrer" className="font-bold text-[#e6b85c] relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e6b85c] after:transition-all after:duration-300 hover:after:w-full hover:after:h-0.5 focus:outline-none focus:ring-2 focus:ring-[#e6b85c]">En savoir plus</a>
            </div>
            {/* Livre ouvert */}
            <div className="flex flex-col items-center text-center bg-[#0a174e]/60 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in group focus-within:ring-4 focus-within:ring-[#e6b85c]/40">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                <img src="/images/service-entrepreneurial.png" alt="Integración y formación" className="h-14 w-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-[#e6b85c] mb-2 transition-colors duration-300 group-hover:text-white">Integración y formación</h3>
              <p className="text-[#e6b85c]/80 mb-4">Te acompañamos en tu integración: aprendizaje del idioma, descubrimiento de la cultura y consejos prácticos para lograr una instalación exitosa.</p>
              <a href="/services/yontikonsey-blog" target="_blank" rel="noopener noreferrer" className="font-bold text-[#e6b85c] relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#e6b85c] after:transition-all after:duration-300 hover:after:w-full hover:after:h-0.5 focus:outline-none focus:ring-2 focus:ring-[#e6b85c]">En savoir plus</a>
            </div>
          </div>
        </div>
      </section>
      <AccordionGallery />
      <CarouselCards />
      <MiniMigrationAssistant />

      {/* Footer spécifique immigration */}
      <ImmigrationFooter />
    </div>
  );
}
