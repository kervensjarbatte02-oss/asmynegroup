"use client";


import BlogNavbar from "./BlogNavbar";
import { useState } from "react";

export default function Blog() {
  const [searchJob, setSearchJob] = useState("");
  const [searchCity, setSearchCity] = useState("");
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#0a174e] relative group transition-colors duration-500">
      {/* Navbar transparente/flottante */}
      <div className="absolute top-0 left-0 w-full z-20">
        <BlogNavbar />
      </div>
      {/* HERO PREMIUM FULLSCREEN */}
      <section className="relative flex flex-col items-center justify-center w-full min-h-[80vh] pt-24 pb-16 overflow-hidden">
        {/* Fond image ou vidéo */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <img src="/blog-header.jpg" alt="Hero background" className="w-full h-full object-cover object-center brightness-[.55]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a174e]/60 via-[#0a174e]/40 to-[#0a174e]/90" />
        </div>
        {/* Texte principal */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl uppercase tracking-tight animate-fade-in">ASMYNE PIERRE</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#e6b85c] mb-8 animate-fade-in delay-100">Asesora migratoria profesional en República Dominicana</h2>
        <p className="text-lg md:text-xl text-white mb-10 max-w-2xl animate-fade-in delay-200">Más de 25 años de experiencia acompañando a extranjeros y nacionales en procesos migratorios, administrativos y legales con responsabilidad, humanidad y profesionalismo.</p>
        {/* Barre de recherche moderne */}
        <form className="flex flex-col md:flex-row gap-4 w-full max-w-2xl justify-center animate-fade-in delay-300">
          <input
            type="text"
            placeholder="Buscar por servicio"
            value={searchJob}
            onChange={e => setSearchJob(e.target.value)}
            className="flex-1 rounded-full px-6 py-3 text-lg bg-white/90 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e6b85c] border-none shadow-md"
          />
          <input
            type="text"
            placeholder="Buscar por ciudad"
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
            className="flex-1 rounded-full px-6 py-3 text-lg bg-white/90 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e6b85c] border-none shadow-md"
          />
          <button type="submit" className="rounded-full px-6 py-3 bg-[#e6b85c] text-[#0a174e] font-bold text-lg shadow-md hover:bg-[#ffd700] transition">Buscar</button>
        </form>
        <span className="mt-10 text-white/80 animate-bounce">▼ Scroll para más</span>
      </section>
      <div className="flex flex-col gap-16 w-full max-w-3xl px-4 py-8">
        <section className="prose prose-invert prose-lg max-w-none text-white mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#e6b85c] mb-8 text-center">ASMYNE PIERRE – ASESORA MIGRATORIA PROFESIONAL EN REPÚBLICA DOMINICANA 🇩🇴</h1>
          <h2 className="text-xl md:text-2xl font-bold text-[#e6b85c] mb-6 text-center">Más de 25 años de experiencia acompañando a extranjeros y nacionales en procesos migratorios, administrativos y legales con responsabilidad, humanidad y profesionalismo</h2>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">BIENVENIDOS A UNA ASESORÍA MIGRATORIA BASADA EN EXPERIENCIA, CONFIANZA Y COMPROMISO HUMANO</h1>
          <p>Migrar a otro país representa uno de los cambios más importantes en la vida de una persona. Detrás de cada proceso migratorio existen sueños, sacrificios, metas familiares, proyectos profesionales y el deseo de construir un futuro mejor.</p>
          <p>Muchas personas llegan a República Dominicana buscando estabilidad, seguridad, oportunidades laborales, crecimiento económico o una nueva oportunidad para comenzar de nuevo. Sin embargo, los procesos migratorios pueden ser complejos, confusos y estresantes cuando no se cuenta con la orientación adecuada.</p>
          <p>Por esa razón, contar con una asesora migratoria profesional y experimentada puede marcar una gran diferencia.</p>
          <p><b>Asmyne Pierre</b> es una asesora migratoria con más de 25 años viviendo en República Dominicana, dedicada a orientar, acompañar y apoyar a extranjeros y nacionales en sus trámites migratorios, administrativos y legales de manera organizada, responsable y personalizada.</p>
          <p>Gracias a su experiencia, conocimiento del sistema dominicano y trato humano, ha logrado convertirse en una figura de confianza para personas que necesitan orientación clara y soluciones confiables para regularizar su situación o avanzar en sus proyectos de vida dentro del país.</p>
          <p>Su misión es brindar tranquilidad, seguridad y acompañamiento profesional en cada etapa del proceso migratorio.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">¿QUIÉN ES ASMYNE PIERRE?</h2>
          <p>Asmyne Pierre es una profesional comprometida con el acompañamiento migratorio y administrativo de personas que desean establecerse, trabajar, invertir o regularizar su situación en República Dominicana.</p>
          <p>Con más de dos décadas viviendo en el país, conoce profundamente:</p>
          <ul>
            <li>Los procesos migratorios</li>
            <li>Los requisitos legales</li>
            <li>El funcionamiento institucional</li>
            <li>Las necesidades de los extranjeros</li>
            <li>Las dificultades comunes de cada trámite</li>
            <li>La importancia de un acompañamiento humano y responsable</li>
          </ul>
          <p>Durante años ha ayudado a personas de diferentes nacionalidades a organizar sus expedientes, comprender sus procesos y avanzar de forma legal y segura.</p>
          <p>Cada caso es tratado con atención personalizada porque entiende que detrás de cada trámite existe una historia personal, familiar y profesional.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">UNA VISIÓN BASADA EN LA CONFIANZA Y EL RESPETO</h2>
          <p>Muchas personas enfrentan miedo, inseguridad y desinformación al iniciar procesos migratorios. Por eso, Asmyne Pierre trabaja con una visión centrada en:</p>
          <ul>
            <li>✔️ Honestidad</li>
            <li>✔️ Transparencia</li>
            <li>✔️ Profesionalismo</li>
            <li>✔️ Organización</li>
            <li>✔️ Atención humana</li>
            <li>✔️ Responsabilidad</li>
            <li>✔️ Respeto por cada cliente</li>
          </ul>
          <p>El objetivo principal no es solamente realizar trámites, sino también ofrecer tranquilidad y acompañamiento real a las personas que necesitan orientación.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">IMPORTANCIA DE UNA ASESORÍA MIGRATORIA PROFESIONAL</h2>
          <p>Los procesos migratorios requieren:</p>
          <ul>
            <li>Organización documental</li>
            <li>Conocimiento legal</li>
            <li>Seguimiento administrativo</li>
            <li>Preparación correcta de expedientes</li>
            <li>Comprensión de requisitos</li>
            <li>Atención a detalles importantes</li>
          </ul>
          <p>Muchas veces las personas pierden tiempo y dinero por:</p>
          <ul>
            <li>❌ Información incorrecta</li>
            <li>❌ Documentos incompletos</li>
            <li>❌ Errores administrativos</li>
            <li>❌ Procesos mal organizados</li>
            <li>❌ Falta de orientación adecuada</li>
          </ul>
          <p>Con una asesoría profesional es posible evitar muchos problemas y realizar procesos con mayor seguridad y confianza.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">SERVICIOS DE ASESORÍA MIGRATORIA EN REPÚBLICA DOMINICANA</h2>
          <h3 className="text-xl md:text-2xl font-bold text-[#e6b85c] mb-6">REGULARIZACIÓN MIGRATORIA</h3>
          <p>La regularización migratoria es uno de los procesos más importantes para las personas extranjeras que desean vivir legalmente en el país.</p>
          <p>Asmyne Pierre ofrece orientación y acompañamiento para:</p>
          <ul>
            <li>Regularización de estatus migratorio</li>
            <li>Cambio de categoría migratoria</li>
            <li>Actualización documental</li>
            <li>Revisión de expedientes</li>
            <li>Organización de documentos</li>
            <li>Seguimiento administrativo</li>
            <li>Corrección de expedientes incompletos</li>
          </ul>
          <p>Regularizar una situación migratoria permite:</p>
          <ul>
            <li>✔️ Mayor tranquilidad</li>
            <li>✔️ Más oportunidades laborales</li>
            <li>✔️ Mejor estabilidad legal</li>
            <li>✔️ Acceso a diferentes servicios</li>
            <li>✔️ Mayor seguridad personal y familiar</li>
          </ul>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h3 className="text-xl md:text-2xl font-bold text-[#e6b85c] mb-6">RESIDENCIA DOMINICANA</h3>
          <p>La residencia dominicana representa una gran oportunidad para extranjeros que desean vivir de manera legal y estable en República Dominicana.</p>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">RESIDENCIA TEMPORAL</h4>
          <p>Orientación y acompañamiento para personas que desean iniciar procesos de residencia temporal.</p>
          <ul>
            <li>Revisión de requisitos</li>
            <li>Organización de expedientes</li>
            <li>Preparación documental</li>
            <li>Seguimiento del proceso</li>
          </ul>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">RESIDENCIA PERMANENTE</h4>
          <p>Asistencia para extranjeros que califican para residencia permanente y desean establecerse de forma más estable en el país.</p>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">RESIDENCIA POR INVERSIÓN</h4>
          <p>Asesoría especializada para:</p>
          <ul>
            <li>Empresarios</li>
            <li>Inversionistas</li>
            <li>Personas interesadas en desarrollar proyectos económicos en República Dominicana</li>
          </ul>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">RESIDENCIA POR VÍNCULO FAMILIAR</h4>
          <p>Procesos relacionados con:</p>
          <ul>
            <li>Matrimonio</li>
            <li>Hijos</li>
            <li>Reunificación familiar</li>
            <li>Vínculos legales familiares</li>
          </ul>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">RENOVACIÓN Y SEGUIMIENTO</h4>
          <p>Control y seguimiento de renovaciones para mantener el estatus migratorio actualizado y en regla.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">SERVICIOS DE VISAS</h2>
          <p>Las visas representan una puerta importante para múltiples oportunidades personales y profesionales.</p>
          <p>Asmyne Pierre ofrece orientación y apoyo para:</p>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">VISA DE TURISMO</h4>
          <p>Información y preparación documental para procesos relacionados con turismo y estadías temporales.</p>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">VISA DE NEGOCIOS</h4>
          <p>Asesoría para personas interesadas en actividades comerciales, empresariales o inversiones.</p>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">VISA DE TRABAJO</h4>
          <p>Orientación para trabajadores extranjeros y empresas contratantes.</p>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">VISA DE ESTUDIANTE</h4>
          <p>Asistencia para estudiantes internacionales interesados en continuar estudios en República Dominicana.</p>
          <h4 className="text-lg md:text-xl font-bold text-[#e6b85c] mb-4">VISA DE REUNIFICACIÓN FAMILIAR</h4>
          <p>Procesos destinados a facilitar la unión familiar y trámites relacionados.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">NACIONALIDAD Y NATURALIZACIÓN DOMINICANA</h2>
          <p>Obtener la nacionalidad dominicana es un paso importante para muchas personas que desean construir un futuro definitivo en el país.</p>
          <p>Servicios disponibles:</p>
          <ul>
            <li>✔️ Orientación para nacionalidad dominicana</li>
            <li>✔️ Revisión documental</li>
            <li>✔️ Preparación de expedientes</li>
            <li>✔️ Seguimiento administrativo</li>
            <li>✔️ Acompañamiento legal</li>
          </ul>
          <p>Cada caso requiere análisis personalizado y organización detallada.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">SERVICIOS COMPLEMENTARIOS PARA EXTRANJEROS</h2>
          <p>Además de los procesos migratorios, muchas personas necesitan apoyo en otros aspectos administrativos importantes.</p>
          <p>Entre los servicios disponibles:</p>
          <ul>
            <li>Traducción de documentos</li>
            <li>Legalización documental</li>
            <li>Apostilla</li>
            <li>Validación de documentos</li>
            <li>Carta de garantía</li>
            <li>Seguro médico migratorio</li>
            <li>Orientación administrativa</li>
            <li>Asistencia para apertura de cuentas bancarias</li>
          </ul>
          <p>Estos servicios ayudan a simplificar diferentes procesos necesarios para vivir y trabajar en el país.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">SERVICIOS EMPRESARIALES MIGRATORIOS</h2>
          <p>Muchas empresas internacionales y emprendedores extranjeros necesitan orientación especializada para operar legalmente en República Dominicana.</p>
          <p>Asmyne Pierre ofrece asesoría para:</p>
          <ul>
            <li>Permisos para trabajadores extranjeros</li>
            <li>Contratación legal</li>
            <li>Procesos corporativos migratorios</li>
            <li>Asesoría para emprendedores</li>
            <li>Regularización empresarial</li>
            <li>Orientación administrativa para empresas internacionales</li>
          </ul>
          <p>El objetivo es facilitar procesos organizados y seguros tanto para empresas como para trabajadores extranjeros.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">ACOMPAÑAMIENTO INSTITUCIONAL Y ADMINISTRATIVO</h2>
          <p>Muchos procesos requieren interacción con instituciones gubernamentales.</p>
          <p>Asmyne Pierre brinda acompañamiento relacionado con:</p>
          <ul>
            <li>Dirección General de Migración</li>
            <li>Embajadas</li>
            <li>Consulados</li>
            <li>Ministerios</li>
            <li>Oficinas gubernamentales</li>
            <li>Procesos administrativos</li>
            <li>Procesos legales</li>
          </ul>
          <p>Contar con acompañamiento profesional ayuda a reducir errores y facilita la comprensión de cada etapa del proceso.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">EL VALOR DE LA EXPERIENCIA</h2>
          <p>La experiencia es uno de los factores más importantes en el área migratoria.</p>
          <p>Más de 25 años viviendo en República Dominicana le permiten a Asmyne Pierre comprender:</p>
          <ul>
            <li>El funcionamiento institucional</li>
            <li>Los cambios administrativos</li>
            <li>Las necesidades de los extranjeros</li>
            <li>Las preocupaciones más comunes</li>
            <li>Las mejores formas de organizar procesos</li>
          </ul>
          <p>La experiencia permite ofrecer orientación más clara, organizada y eficiente.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">¿POR QUÉ ELEGIR A ASMYNE PIERRE?</h2>
          <ul>
            <li>✔️ MÁS DE 25 AÑOS DE EXPERIENCIA EN REPÚBLICA DOMINICANA</li>
            <li>✔️ ATENCIÓN PERSONALIZADA</li>
            <li>✔️ RESPONSABILIDAD Y ORGANIZACIÓN</li>
            <li>✔️ CONFIDENCIALIDAD</li>
            <li>✔️ ORIENTACIÓN HUMANA</li>
            <li>✔️ TRANSPARENCIA</li>
            <li>✔️ PROFESIONALISMO</li>
          </ul>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">APOYO PARA QUIENES DESEAN UN NUEVO COMIENZO</h2>
          <p>Muchas personas llegan al país buscando:</p>
          <ul>
            <li>Estabilidad</li>
            <li>Seguridad</li>
            <li>Oportunidades</li>
            <li>Crecimiento económico</li>
            <li>Un mejor futuro</li>
          </ul>
          <p>Sin embargo, iniciar una nueva vida puede generar incertidumbre y estrés.</p>
          <p>Por eso el acompañamiento profesional es tan importante.</p>
          <p>Asmyne Pierre trabaja para ayudar a cada cliente a:</p>
          <ul>
            <li>✔️ Comprender sus procesos</li>
            <li>✔️ Organizar correctamente sus documentos</li>
            <li>✔️ Evitar errores administrativos</li>
            <li>✔️ Ahorrar tiempo</li>
            <li>✔️ Avanzar con mayor tranquilidad</li>
            <li>✔️ Sentirse acompañado en cada etapa</li>
          </ul>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">UNA ASESORÍA BASADA EN VALORES</h2>
          <p>Los valores son fundamentales en cualquier servicio profesional.</p>
          <p>Por esa razón, el trabajo de Asmyne Pierre está basado en:</p>
          <ul>
            <li>Honestidad</li>
            <li>Respeto</li>
            <li>Organización</li>
            <li>Empatía</li>
            <li>Responsabilidad</li>
            <li>Transparencia</li>
            <li>Compromiso humano</li>
          </ul>
          <p>Cada cliente merece atención digna y orientación clara.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">MENSAJE PROFESIONAL</h2>
          <p>Con más de 25 años viviendo en República Dominicana, Asmyne Pierre conoce de cerca los desafíos, necesidades y procesos que enfrentan las personas que desean regularizar su situación migratoria o construir nuevas oportunidades en el país.</p>
          <p>Nuestro compromiso es ofrecerte tranquilidad, acompañamiento profesional y orientación organizada para que puedas realizar tus trámites de manera legal, segura y confiable.</p>
          <p>Entendemos que cada caso es importante y merece atención responsable y personalizada.</p>
          <p>Si necesitas ayuda con:</p>
          <ul>
            <li>✔️ Residencia dominicana</li>
            <li>✔️ Visas</li>
            <li>✔️ Regularización migratoria</li>
            <li>✔️ Nacionalidad dominicana</li>
            <li>✔️ Traducción y legalización de documentos</li>
            <li>✔️ Procesos administrativos</li>
            <li>✔️ Servicios empresariales migratorios</li>
          </ul>
          <p>Estamos aquí para ayudarte paso a paso.</p>
          <p>Tu tranquilidad, tu estabilidad y tu futuro merecen una asesoría confiable, humana y profesional.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">TEXTO PARA PUBLICIDAD Y REDES SOCIALES</h2>
          <h3 className="text-xl md:text-2xl font-bold text-[#e6b85c] mb-6 text-center">¿NECESITAS AYUDA CON TRÁMITES MIGRATORIOS EN REPÚBLICA DOMINICANA? 🇩🇴</h3>
          <p>Asmyne Pierre, con más de 25 años viviendo en República Dominicana, te ofrece asesoría migratoria profesional y acompañamiento personalizado para ayudarte a realizar tus procesos de manera organizada, legal y segura.</p>
          <ul>
            <li>✔️ Residencia Dominicana</li>
            <li>✔️ Regularización Migratoria</li>
            <li>✔️ Visas</li>
            <li>✔️ Nacionalidad Dominicana</li>
            <li>✔️ Traducción y Legalización de Documentos</li>
            <li>✔️ Servicios para Extranjeros</li>
            <li>✔️ Procesos Empresariales Migratorios</li>
            <li>✔️ Acompañamiento Administrativo</li>
          </ul>
          <p>✨ Atención humana, responsable y confiable.</p>
          <p>Nuestro objetivo es ayudarte a avanzar con tranquilidad y confianza en cada etapa de tu proceso.</p>
          <p>📞 Contáctanos hoy mismo y recibe la orientación profesional que necesitas para construir nuevas oportunidades en República Dominicana.</p>
          <hr className="my-8 border-[#e6b85c]/30" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#e6b85c] mb-8 text-center">MENSAJE FINAL DE MOTIVACIÓN ✨</h2>
          <p>Migrar no significa solamente cambiar de país. También significa comenzar una nueva etapa llena de desafíos y oportunidades.</p>
          <p>Cada persona merece sentirse orientada, respetada y acompañada durante sus procesos.</p>
          <p>Con organización, orientación correcta y apoyo profesional, es posible avanzar con mayor seguridad y tranquilidad.</p>
          <div className="mt-8 italic text-blue-100 text-center text-lg">🌟 “Cada trámite representa una oportunidad para construir un futuro mejor. Con paciencia, organización y acompañamiento profesional, los procesos pueden convertirse en pasos importantes hacia nuevas oportunidades y mayor estabilidad.”</div>
        </section>
      </div>
    </div>
  );
}
