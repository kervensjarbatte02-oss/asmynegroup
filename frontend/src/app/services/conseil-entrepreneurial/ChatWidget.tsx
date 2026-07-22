"use client";
import { useState, useRef } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

const SUGGESTIONS = [
  "¿Cómo crear una empresa en República Dominicana?",
  "¿Qué documentos necesito para registrar mi empresa?",
  "¿Cuáles son los pasos para formalizar un negocio?",
  "¿Qué tipo de empresa me conviene (SRL, EIRL, etc.)?",
  "¿Cuánto cuesta constituir una empresa?",
  "¿Cómo obtener el RNC para mi empresa?",
  "¿Qué impuestos debe pagar una empresa nueva?",
  "¿Cómo abrir una cuenta bancaria empresarial?",
  "¿Qué permisos o licencias necesito para operar?",
  "¿Cómo proteger mi marca o nombre comercial?",
  "¿Qué es la factura con comprobante fiscal?",
  "¿Cómo contratar empleados legalmente?",
  "¿Qué obligaciones laborales tengo como empleador?",
  "¿Cómo llevar la contabilidad de mi empresa?",
  "¿Qué beneficios tiene formalizar mi negocio?",
  "¿Cómo acceder a financiamiento para pymes?",
  "¿Qué es la mentoría empresarial?",
  "¿Cómo puedo internacionalizar mi empresa?",
  "¿Qué servicios ofrece Asmyne Group para emprendedores?",
  "¿Cómo recibir asesoría personalizada para mi proyecto?"
];

type ChatWidgetProps = {
  onClose?: () => void;
};

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [lang, setLang] = useState<'es'|'fr'|'en'>("es");
  const [loading, setLoading] = useState(false);

  async function sendMessage(msg: string) {
    setMessages((msgs) => [...msgs, { role: "user", text: msg }]);
    setInputValue("");
    setLoading(true);
    setMessages((msgs) => [...msgs, { role: "ai", text: "⏳ Respondiendo..." }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, language: lang }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.reply) {
        setMessages((msgs) => [...msgs.slice(0, -1), { role: "ai", text: data.reply }]);
      } else {
        setMessages((msgs) => [...msgs.slice(0, -1), { role: "ai", text: getAutoReply(msg) }]);
      }
    } catch {
      setLoading(false);
      setMessages((msgs) => [...msgs.slice(0, -1), { role: "ai", text: getAutoReply(msg) }]);
    }
  }

  function getAutoReply(msg: string) {
    const txt = msg.toLowerCase();
    if (txt.includes("crear una empresa")) {
      return "Para crear una empresa en República Dominicana necesitas definir el tipo de empresa, reservar el nombre comercial, elaborar los estatutos y registrarla en la Cámara de Comercio. Podemos acompañarte en cada paso.";
    }
    if (txt.includes("documentos") && txt.includes("empresa")) {
      return "Los documentos básicos son: copia de cédula/pasaporte de los socios, estatutos sociales, comprobante de reserva de nombre, formulario de registro y pago de tasas.";
    }
    if (txt.includes("formalizar") || txt.includes("negocio formal")) {
      return "Formalizar un negocio implica registrarlo legalmente, obtener RNC, inscribirse en la DGII y cumplir con las obligaciones fiscales y laborales.";
    }
    if (txt.includes("tipo de empresa") || txt.includes("srl") || txt.includes("eirl")) {
      return "La SRL es ideal para varios socios, la EIRL para un solo propietario. Te ayudamos a elegir la mejor estructura según tu proyecto.";
    }
    if (txt.includes("cuesta") && txt.includes("empresa")) {
      return "El costo depende del tipo de empresa y los servicios requeridos. Contáctanos para una cotización personalizada.";
    }
    if (txt.includes("rnc")) {
      return "El RNC (Registro Nacional de Contribuyentes) se obtiene tras registrar la empresa en la DGII. Es obligatorio para operar legalmente.";
    }
    if (txt.includes("impuestos")) {
      return "Las empresas nuevas deben declarar y pagar ITBIS, ISR y cumplir con las obligaciones fiscales mensuales y anuales.";
    }
    if (txt.includes("cuenta bancaria")) {
      return "Para abrir una cuenta bancaria empresarial necesitas los documentos de la empresa, RNC y acta de asamblea. Te guiamos en el proceso.";
    }
    if (txt.includes("permisos") || txt.includes("licencias")) {
      return "Dependiendo de la actividad, puedes necesitar permisos municipales, sanitarios o sectoriales. Te ayudamos a gestionarlos.";
    }
    if (txt.includes("marca") || txt.includes("nombre comercial")) {
      return "Registrar tu marca o nombre comercial protege tu identidad empresarial. Podemos realizar el trámite ante ONAPI por ti.";
    }
    if (txt.includes("comprobante fiscal") || txt.includes("factura")) {
      return "El comprobante fiscal es obligatorio para facturar legalmente. Se solicita en la DGII tras obtener el RNC.";
    }
    if (txt.includes("contratar empleados")) {
      return "Debes registrar la empresa en la TSS, firmar contratos y cumplir con las leyes laborales. Te asesoramos en todo el proceso.";
    }
    if (txt.includes("obligaciones laborales")) {
      return "Como empleador debes pagar seguridad social, INFOTEP, vacaciones, bonificaciones y cumplir con el Código de Trabajo.";
    }
    if (txt.includes("contabilidad")) {
      return "Llevar la contabilidad es clave para el éxito. Ofrecemos servicios de contabilidad y asesoría fiscal para tu empresa.";
    }
    if (txt.includes("beneficios") && txt.includes("formalizar")) {
      return "Formalizar tu negocio te permite acceder a créditos, licitaciones, protección legal y mayor confianza de tus clientes.";
    }
    if (txt.includes("financiamiento")) {
      return "Existen programas de financiamiento para pymes. Te ayudamos a preparar tu expediente y buscar opciones adecuadas.";
    }
    if (txt.includes("mentoría")) {
      return "La mentoría empresarial consiste en acompañamiento experto para potenciar tu negocio. Consulta nuestros programas de mentoría.";
    }
    if (txt.includes("internacionalizar")) {
      return "Te asesoramos para exportar, abrir filiales o buscar socios internacionales. ¡Lleva tu empresa al siguiente nivel!";
    }
    if (txt.includes("servicios") && txt.includes("asmyne")) {
      return "Asmyne Group ofrece: creación de empresas, asesoría fiscal, formación, mentoría, networking y más. ¡Consulta nuestros servicios!";
    }
    if (txt.includes("asesoría personalizada")) {
      return "Puedes solicitar una asesoría personalizada escribiéndonos por WhatsApp o completando el formulario de contacto.";
    }
    // Garde les anciennes réponses génériques
    if (txt.includes("horario") || txt.includes("horaire") || txt.includes("abierto")) {
      return "Nuestro horario de atención es de lunes a viernes, de 9:00 a 18:00.";
    }
    if (txt.includes("servicio") || txt.includes("ofrecen") || txt.includes("qué pueden hacer")) {
      return "Ofrecemos consultoría empresarial, formación, acompañamiento y soluciones para emprendedores y pymes.";
    }
    if (txt.includes("contacto") || txt.includes("correo") || txt.includes("email") || txt.includes("whatsapp")) {
      return "Puedes contactarnos por WhatsApp al +1 (809) 308-6370 o por correo a contact@asmyne.com.";
    }
    if (txt.includes("ubicación") || txt.includes("dirección") || txt.includes("dónde están")) {
      return "Nuestra oficina está en Casa 12 Calle primera Urb Mirador Isabela, Villa Mella, Santo Domingo Norte, Rep. Dom.";
    }
    if (txt.includes("precio") || txt.includes("tarifa") || txt.includes("cuánto cuesta")) {
      return "Nuestras tarifas varían según el servicio. ¡Contáctanos para una cotización personalizada!";
    }
    if (txt.includes("gracias") || txt.includes("merci") || txt.includes("thank you")) {
      return "¡Gracias por tu interés! ¿En qué más puedo ayudarte?";
    }
    return "Lo siento, no puedo responder a esa pregunta en este momento. Por favor, intenta reformular o contáctanos directamente.";
  }

  // Header, suggestions, chat, input stylés
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div className="w-72 max-w-full flex flex-col h-[370px] bg-black rounded-xl shadow-2xl border-2 border-yellow-500">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-black border-b-2 border-yellow-500 rounded-t-xl">
          <span className="font-bold text-yellow-400 text-sm">Asesoría Empresarial</span>
          <div className="flex gap-1 items-center">
            <button onClick={() => setLang('fr')} className={`px-2 py-1 rounded text-xs font-bold ${lang==='fr' ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-400 border border-yellow-500'}`}>FR</button>
            <button onClick={() => setLang('es')} className={`px-2 py-1 rounded text-xs font-bold ${lang==='es' ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-400 border border-yellow-500'}`}>ES</button>
            <button onClick={() => setLang('en')} className={`px-2 py-1 rounded text-xs font-bold ${lang==='en' ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-400 border border-yellow-500'}`}>EN</button>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-yellow-400 bg-black rounded-full w-7 h-7 flex items-center justify-center hover:bg-yellow-500 hover:text-black border border-yellow-500 transition"
                title="Cerrar"
                aria-label="Cerrar"
              >✕</button>
            )}
          </div>
        </div>
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-black">
          {messages.length === 0 && (
            <div className="bg-black text-yellow-400 text-xs mb-2 rounded-xl p-2 shadow">Hola, soy tu asistente empresarial. ¿En qué puedo ayudarte?</div>
          )}
          {messages.map((msg, idx) =>
            msg.role === "user" ? (
              <div key={idx} className="flex justify-end">
                <div className="px-2 py-1 rounded-2xl max-w-[80%] text-xs bg-yellow-400 text-black">{msg.text}</div>
              </div>
            ) : (
              <div key={idx} className="flex flex-col items-start">
                <span className="text-xs bg-yellow-900 text-yellow-200 mb-1 rounded-xl px-2 py-1 shadow">{msg.text}</span>
              </div>
            )
          )}
          {/* Suggestions */}
          {messages.length === 0 && (
            <div className="flex flex-col gap-1 mt-1">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="w-full text-left px-2 py-1 rounded bg-yellow-900 text-yellow-300 hover:bg-yellow-400 hover:text-black border border-yellow-500 transition font-semibold text-xs"
                  onClick={() => sendMessage(s)}
                >{s}</button>
              ))}
            </div>
          )}
        </div>
        {/* Input */}
        <form
          className="w-full flex items-center bg-black px-2 py-2 border-t-2 border-yellow-500 rounded-b-xl"
          onSubmit={e => {
            e.preventDefault();
            if (inputValue.trim() && !loading) sendMessage(inputValue.trim());
          }}
        >
          <input
            type="text"
            className="flex-1 bg-black text-yellow-400 border border-yellow-500 py-1 px-2 rounded-l focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 text-xs"
            placeholder={lang === 'es' ? "Escriba una pregunta empresarial" : lang === 'fr' ? "Écrivez une question d'entreprise" : "Type a business question"}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="ml-1 px-3 py-1 rounded-r bg-yellow-400 text-black font-bold text-xs border border-yellow-500 hover:bg-yellow-500 transition disabled:opacity-60"
            title={lang === 'es' ? "Enviar" : lang === 'fr' ? "Envoyer" : "Send"}
            disabled={loading}
          >
            {lang === 'es' ? "Enviar" : lang === 'fr' ? "Envoyer" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
