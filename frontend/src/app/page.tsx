import HomeFooter from "./HomeFooter";
import ServicesSection from "./ServicesSection";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-secondary via-[#0a174e] to-black text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center px-0 py-6 w-full">
        {/* Colonne logo */}
        <div className="flex items-center gap-2 flex-shrink-0 justify-start pl-0 ml-0 m-0 p-0">
          <Image src="/Asmyne-Groupe-logo.png" alt="Logo Asmyne Groupe " width={72} height={72} />
          <span className="text-2xl font-bold tracking-wide whitespace-nowrap">Asmyne <span className="text-accent">Groupe</span></span>
        </div>
        {/* Colonne menu */}
        <nav className="hidden md:flex flex-1 justify-center gap-8 text-lg font-medium">
          <Link href="/" className="hover:text-accent">Accueil</Link>
          {/* <Link href="/services" className="hover:text-accent">Services</Link> */}
          <Link href="/marketplace" className="hover:text-accent">Marketplace</Link>
          <Link href="/blog" className="hover:text-accent">Blog</Link>
          <Link href="/contact" className="hover:text-accent">Contact</Link>
        </nav>
        {/* Spacer pour garder l'alignement du menu sans bouton */}
        <div className="min-w-[160px] flex-shrink-0" aria-hidden="true" />
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-center px-10 pt-10 pb-16 gap-10">
        <div className="flex-1">
          <div className="mb-4">
            <span className="uppercase tracking-widest text-accent text-sm font-semibold">**Un solo lugar, infinitas soluciones.**
</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Todas tus soluciones digitales en un solo ecosistema <span className="text-primary"></span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl">
            
          </p>
          <div className="flex gap-4 mb-6">
            <Link href="/services/conseil-migratoire" className="px-7 py-3 rounded-full bg-primary text-white font-semibold text-lg shadow hover:bg-blue-700 transition inline-flex items-center justify-center">Comenzar Aqui </Link>
            <button className="px-7 py-3 rounded-full border border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition">Ver la demostración</button>
          </div>
          <div className="flex gap-6 text-sm text-white/70">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-start p-0 m-0">
          <Image src="/Asmyne-Groupe-logo.png" alt="Logo Asmyne Groupe " width={2000} height={2000} className="-mt-40 m-0 p-0" />
        </div>
      </section>


      

      {/* Services Section */}
      <ServicesSection />




      {/* Stats Section */}
      <section className="flex flex-wrap justify-center gap-10 px-10 pb-16 border-t border-white/10 pt-10">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">10K+</div>
          <div className="text-white/70">Clientes satisfechos</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">150+</div>
          <div className="text-white/70">Países atendidos</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">99.9%</div>
          <div className="text-white/70">Seguridad garantizada</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">24/7</div>
          <div className="text-white/70">Soporte disponible</div>
        </div>
      </section>


      <section className="w-full flex flex-col md:flex-row items-center justify-center gap-10 px-4 md:px-16 py-12 bg-[#14213d] rounded-2xl shadow-lg my-8">
        {/* Image à gauche */}
        <div className="flex-1 flex justify-center">
          <img src="/Asmyne-pierre.jpg" alt="Asmyne Pierre" className="rounded-2xl object-cover w-full max-w-xs md:max-w-sm shadow-md" />
        </div>
        {/* Texte à droite */}
        <div className="flex-1 max-w-xl">
          <div className="block font-bold text-lg text-white mb-1 uppercase tracking-widest">SOBRE NOSOTROS</div>
          {/* <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What <span className="text-primary">We Do</span></h2> */}
          <div className="text-white/80 mb-4 space-y-4">
            <p className="font-semibold text-white">
              Somos una plataforma integral dedicada a ofrecer asesoría migratoria, empresarial y soluciones digitales innovadoras para personas y negocios. Nuestro objetivo es brindar un acompañamiento profesional, confiable y personalizado que ayude a nuestros clientes a crecer, regularizar sus procesos y alcanzar nuevas oportunidades.
            </p>
            <div>
              <span className="block font-bold text-lg text-white mb-1"></span>
              <span>También ofrecemos servicios de viajes, contenido informativo, soluciones de belleza y herramientas digitales adaptadas a las necesidades actuales. Trabajamos con compromiso, responsabilidad y visión para conectar a cada persona con soluciones efectivas y modernas.</span>
            </div>
            <div>
              <span className="block font-bold text-lg text-white mb-1"></span>
              <span></span>
            </div>
            <div>
              <span className="block font-bold text-lg text-white mb-1"></span>
              <span></span>
            </div>
            <div>
              <span className="block font-bold text-lg text-white mb-1"></span>
              <span></span>
            </div>
          </div>
          <p className="font-semibold text-white mb-6">
            
          </p>
          <button className="px-8 py-3 rounded-full bg-primary text-white font-bold tracking-wide shadow hover:bg-blue-700 transition">READ MORE</button>
        </div>
      </section>

      {/* Por qué elegir Asmyne Groupe Section */}
      <section className="w-full flex flex-col items-center justify-center px-4 md:px-16 py-16 bg-[#14213d] mt-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Por qué elegir Asmyne Groupe</h2>
        <p className="text-white/80 text-lg text-center mb-12 max-w-2xl">Ayuda y orientación en todo tu camino para tomar las mejores decisiones.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Card 1 */}
            <div className="flex flex-col md:flex-row items-center gap-2 bg-gradient-to-br from-[#181f38] via-[#1e2746] to-[#232c4d] border border-[#e6b85c] rounded-lg p-6 shadow-lg min-h-[160px] Groupe transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#e6b85c] mb-2 md:mb-0">
              <svg width="36" height="36" fill="none" stroke="#e6b85c" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <div>
              <div className="font-bold text-xl text-white mb-1">Asesoría Migratoria</div>
              <div className="text-white/80 text-sm">Asesoría migratoria profesional y acompañamiento personalizado para ayudarte a entender cada proceso y tomar decisiones con seguridad y confianza.</div>
            </div>
          </div>
          {/* Card 2 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-br from-[#181f38] via-[#1e2746] to-[#232c4d] border border-[#e6b85c] rounded-xl p-6 shadow-lg min-h-[160px] Groupe transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#e6b85c] mb-2 md:mb-0">
              <svg width="36" height="36" fill="none" stroke="#e6b85c" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9z"/></svg>
            </div>
            <div>
              <div className="font-bold text-xl text-white mb-1">Consejos Empresariales</div>
              <div className="text-white/80 text-sm">Consejos empresariales para ayudarte a crecer, emprender y fortalecer tu negocio con estrategias efectivas y mejores decisiones para tu futuro.</div>
            </div>
          </div>
          {/* Card 3 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-br from-[#181f38] via-[#1e2746] to-[#232c4d] border border-[#e6b85c] rounded-xl p-6 shadow-lg min-h-[160px] Groupe transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#e6b85c] mb-2 md:mb-0">
              <svg width="36" height="36" fill="none" stroke="#e6b85c" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8v8H8z"/></svg>
            </div>
            <div>
              <div className="font-bold text-xl text-white mb-1">Soluciones de Belleza</div>
              <div className="text-white/80 text-sm">Soluciones de belleza y Soluciones capilares adaptadas a tus necesidades para resaltar tu estilo, tu confianza y tu bienestar personal.</div>
            </div>
          </div>
          {/* Card 4 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-br from-[#181f38] via-[#1e2746] to-[#232c4d] border border-[#e6b85c] rounded-xl p-6 shadow-lg min-h-[160px] Groupe transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#e6b85c] mb-2 md:mb-0">
              <svg width="36" height="36" fill="none" stroke="#e6b85c" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20v-6m0 0V8m0 6H8m4 0h4"/></svg>
            </div>
            <div>
              <div className="font-bold text-xl text-white mb-1">Yontikonsey Blog</div>
              <div className="text-white/80 text-sm">Plataforma de blog y contenido útil con “Yontikonsey Blog”, donde compartimos consejos, información y experiencias que te inspiran y te ayudan a avanzar.</div>
            </div>
          </div>
          {/* Card 5 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-br from-[#181f38] via-[#1e2746] to-[#232c4d] border border-[#e6b85c] rounded-xl p-6 shadow-lg min-h-[160px] Groupe transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#e6b85c] mb-2 md:mb-0">
              <svg width="36" height="36" fill="none" stroke="#e6b85c" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0 0V8m0 4H8m4 0h4"/></svg>
            </div>
            <div>
              <div className="font-bold text-xl text-white mb-1">Agencia de Viajes</div>
              <div className="text-white/80 text-sm">Servicios de agencia de viajes y asistencia internacional para que vivas experiencias increíbles con tranquilidad, seguridad y el mejor acompañamiento.</div>
            </div>
          </div>
          {/* Card 6 */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-gradient-to-br from-[#181f38] via-[#1e2746] to-[#232c4d] border border-[#e6b85c] rounded-xl p-6 shadow-lg min-h-[160px] Groupe transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-accent hover:-translate-y-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#e6b85c] mb-2 md:mb-0">
              <svg width="36" height="36" fill="none" stroke="#e6b85c" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20v-6m0 0V8m0 6H8m4 0h4"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div>
              <div className="font-bold text-xl text-white mb-1">Red Social</div>
              <div className="text-white/80 text-sm">Espacio de red social para conectar con otras personas, compartir ideas, crear relaciones y formar parte de una comunidad activa y positiva.</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="relative w-full flex items-center justify-center min-h-[560px] md:min-h-[760px] py-0 px-4 md:px-0 mt-8 overflow-hidden bg-[#0a174e]">
        <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
          <img src="/cta-office-bg.png" alt="Bureau" className="w-full h-full object-contain opacity-100 brightness-100" />
        </div>
      </section>


      {/* Section Real-Estate Agency ajoutée */}

      <section className="w-full flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#0a174e] via-[#0a174e] to-[#16213a] rounded-xl shadow-lg border-2 border-[#0a174e] px-8 py-12 mb-12 mt-16">
        <div className="flex-1 flex flex-col justify-center items-start gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Somos verdaderamente excelentes en servicios en la ciudad<br /></h2>
          <p className="text-blue-100 text-lg mb-4">Somos una agencia familiar con experiencia empírica, combinando generaciones de trabajo práctico con análisis basados en datos para ofrecer los mejores resultados a nuestros clientes.<br/></p>
          <div className="flex gap-4 mt-2">
            <button className="bg-white text-[#0a174e] px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-100 transition">Habla con un experto</button>
            <button className="bg-[#0a174e] border border-blue-900 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#16213a] transition">Call: +1-(809) 308-6370</button>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center mt-8 md:mt-0">
          <img src="/images/real-estate-building.png" alt="Real Estate Building" className="rounded-xl w-full max-w-md shadow-lg object-cover" style={{minHeight:'220px', maxHeight:'320px', opacity:0.95}} />
        </div>
      </section>

      {/* Features Section tout en bas */}
      <section className="relative w-full flex flex-col items-center justify-center bg-[#232c3d] py-20 px-4 md:px-0 border-t border-white/10 mt-16 animate-fadein">
        <h2 className="text-[56px] md:text-[96px] font-extrabold text-[#2d7ff9] text-center tracking-tight leading-none mb-0 drop-shadow-2xl opacity-95 select-none feature-appear-fadein" style={{letterSpacing:'0.04em', textShadow:'0 8px 32px #0a174e'}}>
          FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full max-w-6xl mt-[-32px] z-10 relative pb-2">
          {/* Feature 1 */}
          <div className="flex flex-col items-center justify-center p-8 feature-appear-fadein" style={{animationDelay:'0.2s'}}>
            <div className="mb-3">
              <svg width="48" height="48" fill="none" stroke="#2563eb" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#2d7ff9] mb-1">2007</div>
            <div className="uppercase text-[#b3cfff] tracking-widest text-xs font-medium">Year of Establishment</div>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center justify-center p-8 feature-appear-fadein" style={{animationDelay:'0.4s'}}>
            <div className="mb-3">
              <svg width="48" height="48" fill="none" stroke="#2563eb" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/></svg>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#2d7ff9] mb-1">547</div>
            <div className="uppercase text-[#b3cfff] tracking-widest text-xs font-medium">Successful Projects</div>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center justify-center p-8 feature-appear-fadein" style={{animationDelay:'0.6s'}}>
            <div className="mb-3">
              <svg width="48" height="48" fill="none" stroke="#2563eb" strokeWidth="2.5" viewBox="0 0 24 24"><g><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="17" cy="17" r="4"/></g></svg>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#2d7ff9] mb-1">45+</div>
            <div className="uppercase text-[#b3cfff] tracking-widest text-xs font-medium">Global Partners</div>
          </div>
          {/* Feature 4 */}
          <div className="flex flex-col items-center justify-center p-8 feature-appear-fadein" style={{animationDelay:'0.8s'}}>
            <div className="mb-3">
              <svg width="48" height="48" fill="none" stroke="#2563eb" strokeWidth="2.5" viewBox="0 0 24 24"><g><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="17" cy="17" r="4"/></g><text x="12" y="15" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="bold"></text></svg>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#2d7ff9] mb-1">1500</div>
            <div className="uppercase text-[#b3cfff] tracking-widest text-xs font-medium">Team Members</div>
          </div>
        </div>
      </section>
      {/* Section FAQ Bleu déplacée tout en bas */}
      <section className="relative overflow-hidden w-full flex flex-col md:flex-row justify-center items-stretch gap-12 px-4 md:px-16 py-20" style={{background:'#16213a'}}>
        {/* Bloc gauche */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
          <div className="text-[#2563eb] font-bold text-lg mb-2 uppercase tracking-widest">Preguntas Frecuentes Generales (FAQ)</div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            ¿Tienes dudas?<br />Revisa las FAQ o contáctanos
          </h2>
          <div className="w-24 h-1 bg-[#2563eb] mb-8" />
          <p className="text-base text-white/80 mb-8 opacity-90">
            Aquí encontrarás respuestas rápidas sobre nuestros servicios digitales, asesorías y procesos. Si necesitas ayuda personalizada, nuestro equipo está listo para orientarte paso a paso.
          </p>
          <Link href="/faq" className="bg-[#2563eb] hover:bg-[#1b4fa0] text-white font-semibold px-8 py-4 rounded-lg text-lg shadow transition w-fit inline-flex items-center">Ver más preguntas frecuentes</Link>
        </div>
        {/* Bloc droit */}
        <div className="relative z-10 flex-1 flex flex-col gap-2 max-w-xl">
          <details open className="bg-[#2563eb] text-white rounded-lg p-5">
            <summary className="list-none flex justify-between items-center font-semibold text-lg cursor-pointer">
              <span>¿Cómo puedo iniciar mi proceso con Asmyne Groupe?</span>
              <span className="text-2xl">+</span>
            </summary>
            <p className="mt-3 text-base font-normal text-white/90">
              Puedes comenzar escribiéndonos por WhatsApp o desde el formulario de contacto. Evaluamos tu necesidad y te guiamos con un plan personalizado.
            </p>
          </details>

          <details className="bg-[#eaf3fd] text-[#14213d] rounded-lg p-5">
            <summary className="list-none flex justify-between items-center font-semibold text-base cursor-pointer">
              <span>¿Cuánto tiempo tarda una asesoría migratoria?</span>
              <span className="text-2xl text-[#2563eb]">+</span>
            </summary>
            <p className="mt-3 text-sm text-[#1e2f52]">
              Depende del tipo de trámite y de la documentación disponible. En la primera consulta te damos una estimación clara de tiempos y pasos.
            </p>
          </details>

          <details className="bg-[#eaf3fd] text-[#14213d] rounded-lg p-5">
            <summary className="list-none flex justify-between items-center font-semibold text-base cursor-pointer">
              <span>¿Qué documentos necesito para comenzar?</span>
              <span className="text-2xl text-[#2563eb]">+</span>
            </summary>
            <p className="mt-3 text-sm text-[#1e2f52]">
              Generalmente: pasaporte vigente, actas civiles, antecedentes y formularios según el caso. Te entregamos una lista exacta antes de iniciar.
            </p>
          </details>

          <details className="bg-[#eaf3fd] text-[#14213d] rounded-lg p-5">
            <summary className="list-none flex justify-between items-center font-semibold text-base cursor-pointer">
              <span>¿Qué documentos necesito para comenzar?</span>
              <span className="text-2xl text-[#2563eb]">+</span>
            </summary>
            <p className="mt-3 text-sm text-[#1e2f52]">
              Generalmente: pasaporte vigente, actas civiles, antecedentes y formularios según el caso. Te entregamos una lista exacta antes de iniciar.
            </p>
          </details>
        </div>
      </section>
        {/* Footer Section */}
        {/* The footer has been removed to avoid duplication with the global Footer */}
      <HomeFooter />
    </div>
  );
}
