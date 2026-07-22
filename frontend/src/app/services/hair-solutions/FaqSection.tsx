"use client";
import React from "react";

const faqs = [
  {
    question: "¿Es adecuado para todo tipo de cabello?",
    answer:
      "Sí. Los productos Shebas están formulados para adaptarse a distintos tipos de cabello, incluyendo rizado, crespo, liso, ondulado y texturizado. Ayudan a mantener la hidratación, la suavidad y el manejo sin pesar el cabello."
  },
  {
    question: "¿Están hechos con ingredientes naturales?",
    answer:
      "Sí. Nuestras fórmulas están enriquecidas con ingredientes naturales cuidadosamente seleccionados, conocidos por sus propiedades nutritivas y fortalecedoras, que ayudan a proteger el cabello y realzar su belleza natural."
  },
  {
    question: "¿Se pueden usar a diario?",
    answer:
      "Claro. El shampoo, acondicionador, aceite y pomada de Shebas son suaves para uso diario y ayudan a mantener el cabello sano, hidratado y equilibrado con el tiempo."
  },
  {
    question: "¿Son cruelty-free?",
    answer:
      "Sí. Shebas se compromete con prácticas libres de crueldad animal y no prueba sus productos en animales."
  }
];

export default function FaqSection() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <section className="w-full py-16 flex flex-col items-center" style={{background: "linear-gradient(120deg, #2d2a1f 0%, #f7e1b5 100%)"}}>
      <h2 className="text-4xl font-extrabold text-yellow-400 mb-2 text-center">PREGUNTAS FRECUENTES</h2>
      <p className="text-lg text-yellow-100 mb-8 text-center">Todo lo que necesitas saber sobre nuestros productos</p>
      <div className="w-full max-w-3xl">
        {faqs.map((faq, idx) => (
          <div key={idx} className="mb-4 border-b border-yellow-200">
            <button
              className="w-full flex justify-between items-center py-4 text-left font-semibold text-yellow-400 focus:outline-none"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              aria-controls={`faq-panel-${idx}`}
            >
              <span className="text-yellow-400">{faq.question}</span>
              <span className="ml-2 text-2xl text-yellow-400">{open === idx ? "▲" : "▼"}</span>
            </button>
            <div
              id={`faq-panel-${idx}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${open === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              aria-hidden={open !== idx}
            >
              <div className="py-2 text-white text-base">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
