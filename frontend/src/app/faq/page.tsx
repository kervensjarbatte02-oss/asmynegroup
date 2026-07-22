import Link from "next/link";

const faqItems = [
  {
    question: "Asesoria migratoria: que incluye el servicio?",
    answer:
      "Incluye evaluacion del caso, revision de documentos, hoja de ruta por etapas y acompanamiento para residencia, visas, regularizacion y nacionalidad.",
  },
  {
    question: "Asesoria empresarial: en que me pueden ayudar?",
    answer:
      "Te apoyamos en estructura de negocio, estrategia comercial, formalizacion, optimizacion de procesos y toma de decisiones para crecer de forma sostenible.",
  },
  {
    question: "Soluciones capilares: que tipo de productos ofrecen?",
    answer:
      "Ofrecemos productos y soluciones capilares seleccionadas segun necesidad: hidratacion, reparacion, crecimiento, mantenimiento y cuidado personalizado.",
  },
  {
    question: "Yontikonsey Blog: que contenido voy a encontrar?",
    answer:
      "Encontraras consejos practicos, educacion migratoria y empresarial, actualidad util y guias orientadas a decisiones reales del dia a dia.",
  },
  {
    question: "Agencia de viajes: pueden ayudar con reservas y planificacion?",
    answer:
      "Si. Te ayudamos con planificacion, reservas y coordinacion de viaje para una experiencia organizada, segura y adaptada a tu presupuesto.",
  },
  {
    question: "Red social: que beneficios ofrece la comunidad?",
    answer:
      "Te permite conectar con personas afines, compartir contenido, crear relaciones estrategicas y participar en una comunidad activa y positiva.",
  },
  {
    question: "Encuentros: como funciona la plataforma?",
    answer:
      "Funciona por perfiles, intereses y filtros de seguridad para fomentar conexiones autenticas en un entorno respetuoso y moderado.",
  },
  {
    question: "Chatbot inteligente: que tipo de preguntas responde?",
    answer:
      "Responde preguntas frecuentes, orienta sobre servicios, sugiere proximos pasos y puede escalar a soporte humano cuando el caso lo requiere.",
  },
  {
    question: "Mercado global: puedo vender y comprar desde un solo lugar?",
    answer:
      "Si. El marketplace permite publicar productos, gestionar pedidos y conectar con compradores/proveedores en un entorno centralizado.",
  },
  {
    question: "Plataforma de monetizacion: como genero ingresos?",
    answer:
      "Puedes monetizar mediante servicios, comisiones, suscripciones y promociones, con herramientas para seguimiento y crecimiento de ingresos.",
  },
];

export default function FaqPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0d1a38] via-[#13254d] to-[#0e1c3f] text-white px-4 md:px-16 py-12 md:py-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-[#e6b85c]/15 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-10 p-1 md:p-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[#7db2ff] font-bold uppercase tracking-[0.18em] text-xs md:text-sm">
                Centro de Ayuda
              </p>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">
                FAQ de todos los servicios
              </h1>
              <p className="mt-4 text-white/80 max-w-2xl leading-7">
                Encuentra respuestas claras sobre asesoria migratoria, negocios, viajes, tecnologia y monetizacion.
                Si no ves tu caso aqui, nuestro equipo te orienta de forma personalizada.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#2563eb] px-5 py-3 font-semibold hover:bg-[#1b4fa0] transition-colors shadow-lg"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        <div className="space-y-1">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="group border-b border-white/20 pb-1"
            >
              <summary className="list-none flex items-center justify-between gap-4 font-bold cursor-pointer text-base md:text-xl py-5 text-white/95">
                <span className="leading-7">{item.question}</span>
                <span className="shrink-0 text-[#7db2ff] flex items-center justify-center text-2xl font-extrabold transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-5 md:pb-6">
                <p className="text-sm md:text-base text-white/80 leading-7 font-medium">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
