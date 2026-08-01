"use client";

import React from "react";
import { FaPlus, FaRegCommentDots, FaSearch, FaRegFolder, FaRegCompass, FaUserCircle, FaMicrophone, FaRegEdit, FaGlobe, FaImage } from "react-icons/fa";

type Message = {
  role: 'user'|'ai',
  text: string,
  fileType?: 'image' | 'video' | 'file'
};

type SpeechRecognitionConstructorType = new () => SpeechRecognition;

export default function ChatbotPage() {
  // Chat state
  const [messages, setMessages] = React.useState<Message[]>([]);
  // ...existing code...
  // Para los prompts contextuales
  const [prompt, setPrompt] = React.useState<string | null>(null);
  const [promptValue, setPromptValue] = React.useState("");
  // Para la galería
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  // Para el texto y el envío
  const [inputValue, setInputValue] = React.useState("");
  // Para el reconocimiento de voz
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const transcriptRef = React.useRef<string>("");

  const [plusMenuOpen, setPlusMenuOpen] = React.useState(false);
  const plusBtnRef = React.useRef<HTMLButtonElement | null>(null);

  // Cerrar el menú si se hace clic fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        plusBtnRef.current &&
        event.target instanceof Node &&
        !plusBtnRef.current.contains(event.target)
      ) {
        setPlusMenuOpen(false);
      }
    }
    if (plusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [plusMenuOpen]);

  return (
    <div className="min-h-screen w-full bg-black text-white flex font-sans flex-col">
      {/* Barra lateral de iconos */}
      <aside className="hidden md:flex w-20 bg-black border-r border-[#23272f] flex-col h-screen items-center justify-between py-4">
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="mb-4 w-full flex justify-center">
            <span className="text-xs font-bold tracking-wide text-[#ececf1] uppercase">Asmyne Group</span>
          </div>
          {/* Menú lateral adicional: eliminado, movido al centro */}
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Conversaciones" onClick={() => alert('Conversaciones')}>
            <FaRegCommentDots />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Buscar" onClick={() => alert('Búsqueda')}>
            <FaSearch />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Proyectos" onClick={() => alert('Proyectos')}>
            <FaRegFolder />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Explorar" onClick={() => alert('Explorar')}>
            <FaRegCompass />
          </button>
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#23272f] text-white mx-auto" title="Perfil" onClick={() => alert('Perfil')}>
            <span className="text-lg"><FaUserCircle /></span>
          </button>
        </div>
      </aside>
      {/* Zona central moderna */}
      <main className="flex-1 flex flex-col items-center justify-start min-h-screen bg-black px-4 py-6">
        <div className="w-full max-w-xl flex flex-col items-center justify-center mt-4 md:mt-[-80px]">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-8 text-[#ececf1]">¿Por dónde empezamos?</h1>
          {/* Zona de chat sin marco ni fondo */}
          {messages.length > 0 && (
            <div className="w-full flex flex-col gap-2 mb-6 max-h-80 overflow-y-auto" style={{minHeight: 120}}>
              {messages.map((msg, idx) => (
                msg.role === 'user' ? (
                  <div key={idx} className="flex justify-end">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] text-sm bg-[#343541] text-[#ececf1]">
                      {msg.fileType === 'image' ? (
                        <img src={msg.text} alt="image envoyée" className="max-w-xs rounded-lg" />
                      ) : msg.fileType === 'video' ? (
                        <video src={msg.text} controls className="max-w-xs rounded-lg" />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="flex flex-col items-start">
                    <span className="text-base text-white mb-1">{msg.text}</span>
                  </div>
                )
              ))}
            </div>
          )}
          <form className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex items-center bg-[#23272f] rounded-2xl px-4 py-2 shadow focus-within:ring-2 focus-within:ring-[#ececf1] relative">
              <button
                type="button"
                className="text-[#ececf1] text-xl mr-2 flex items-center justify-center w-8 h-8 rounded hover:bg-[#343541]"
                title="Plus"
                onClick={() => setPlusMenuOpen((v) => !v)}
              >
                <FaPlus />
              </button>
              <input
                type="text"
                className="flex-1 bg-transparent text-white border-none py-3 focus:outline-none focus:ring-0 placeholder-[#ececf1]/60"
                placeholder="Haz una pregunta"
                autoFocus
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
              {inputValue.trim() ? (
                <button
                  type="button"
                  className="ml-2 text-[#ececf1] hover:text-[#e6b85c] text-xl"
                  onClick={async () => {
                    setMessages(msgs => [...msgs, {role: 'user', text: inputValue}]);
                    const userMsg = inputValue;
                    setInputValue("");
                    // Llamada a la API
                    setMessages(msgs => [...msgs, {role: 'ai', text: '⏳ Respuesta en curso...'}]);
                    try {
                      const res = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: userMsg, language: "es" })
                      });
                      const data = await res.json();
                      if (data.reply) {
                        setMessages(msgs => [
                          ...msgs.slice(0, -1),
                          {role: 'ai', text: data.reply}
                        ]);
                      } else {
                        // Fallback automático en español
                        setMessages(msgs => [
                          ...msgs.slice(0, -1),
                          {role: 'ai', text: getAutoReply(userMsg)}
                        ]);
                      }
                    } catch (_e) {
                      setMessages(msgs => [
                        ...msgs.slice(0, -1),
                        {role: 'ai', text: getAutoReply(userMsg)}
                      ]);
                    }
                  // Respuestas automáticas fallback en español
                  function getAutoReply(msg: string) {
                    const txt = msg.toLowerCase();
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
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.18-.12 1.18.492V7.5c4.97 0 8.25 1.5 8.25 7.5 0 2.25-1.5 4.5-4.5 4.5-2.25 0-4.5-1.5-4.5-4.5v-2.463c0-.612-.74-.931-1.18-.492L2.25 12z" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className={`ml-2 text-[#ececf1] hover:text-[#e6b85c] text-xl ${isListening ? 'animate-pulse' : ''}`}
                  onClick={() => {
                    const SpeechRecognitionConstructor = ((window as unknown) as {
                      SpeechRecognition?: SpeechRecognitionConstructorType;
                      webkitSpeechRecognition?: SpeechRecognitionConstructorType;
                    }).SpeechRecognition || ((window as unknown) as {
                      SpeechRecognition?: SpeechRecognitionConstructorType;
                      webkitSpeechRecognition?: SpeechRecognitionConstructorType;
                    }).webkitSpeechRecognition;
                    if (!SpeechRecognitionConstructor) {
                      alert('El reconocimiento de voz no es compatible');
                      return;
                    }
                    if (!recognitionRef.current) {
                      recognitionRef.current = new SpeechRecognitionConstructor();
                      recognitionRef.current.lang = 'es-ES';
                      recognitionRef.current.continuous = false;
                      recognitionRef.current.interimResults = false;
                      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                        const transcript = event.results[0][0].transcript;
                        transcriptRef.current = transcript;
                        setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
                      };
                      recognitionRef.current.onerror = () => setIsListening(false);
                      recognitionRef.current.onend = async () => {
                        setIsListening(false);
                        // Si se reconoció texto, se envía automáticamente
                        const finalText = (inputValue + (inputValue && transcriptRef.current ? ' ' : '') + transcriptRef.current).trim();
                        transcriptRef.current = "";
                        if (finalText) {
                          setMessages(msgs => [...msgs, {role: 'user', text: finalText}]);
                          setInputValue("");
                          setMessages(msgs => [...msgs, {role: 'ai', text: '⏳ Respuesta en curso...'}]);
                          try {
                            const res = await fetch("/api/chat", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ message: finalText })
                            });
                            const data = await res.json();
                            setMessages(msgs => [
                              ...msgs.slice(0, -1),
                              {role: 'ai', text: data.reply || data.error || 'Error de IA'}
                            ]);
                          } catch (_e) {
                            setMessages(msgs => [
                              ...msgs.slice(0, -1),
                              {role: 'ai', text: 'Error al enviar la solicitud a la IA'}
                            ]);
                          }
                        }
                      };
                    }
                    if (isListening) return; // Evita el doble arranque
                    setIsListening(true);
                    recognitionRef.current.start();
                  }}
                  title="Hablar"
                >
                  <FaMicrophone />
                </button>
              )}
              {/* Menu Plus central */}
              {plusMenuOpen && (
                <div className="absolute left-0 top-12 z-30 min-w-[220px] bg-[#23272f] border border-[#343541] rounded-xl shadow-lg py-2 flex flex-col text-sm text-[#ececf1]">
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); fileInputRef.current?.click(); }}>Agregar fotos/archivos</button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={async _e => {
                      const files = _e.target.files;
                      if (files && files.length > 0) {
                        for (const file of Array.from(files)) {
                          let url = "";
                          if (file.type.startsWith("image/")) {
                            url = URL.createObjectURL(file);
                            setMessages(msgs => [...msgs, { role: 'user', text: url, fileType: 'image' }]);
                          } else if (file.type.startsWith("video/")) {
                            url = URL.createObjectURL(file);
                            setMessages(msgs => [...msgs, { role: 'user', text: url, fileType: 'video' }]);
                          } else {
                            setMessages(msgs => [...msgs, { role: 'user', text: `Fichier : ${file.name}`, fileType: 'file' }]);
                          }
                          // Préparer l’envoi à l’API (exemple, à adapter côté backend)
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                          } catch {
                            setMessages(msgs => [...msgs, { role: 'ai', text: `Error al enviar el archivo : ${file.name}` }]);
                          }
                        }
                      }
                    }}
                  />
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); fileInputRef.current?.click(); }}>Crear una imagen</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Piensa: da una idea o una pregunta'); }}>Piensa</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Búsqueda profunda: ingrese su consulta'); }}>Búsqueda profunda</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Búsqueda en la web: ingrese su búsqueda'); }}>Búsqueda en la web</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Hablo de un lugar: ingrese un lugar'); }}>Hablo de un lugar</button>
                  <div className="border-t border-[#343541] my-1" />
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Proyectos: describa su proyecto'); }}>Proyectos</button>
                  <div className="relative group">
                    <button className="px-4 py-2 w-full text-left hover:bg-[#343541] flex items-center justify-between" onClick={() => { setPlusMenuOpen(false); setPrompt('Más: otra acción'); }}>Más <span className="ml-2">›</span></button>
                    <div className="absolute left-full top-0 z-40 min-w-[160px] bg-[#23272f] border border-[#343541] rounded-xl shadow-lg py-2 hidden group-hover:block">
                      <button className="px-4 py-2 hover:bg-[#343541] text-left w-full" onClick={() => { setPlusMenuOpen(false); setPrompt('Guion: describa su guion'); }}>Guion</button>
                      <button className="px-4 py-2 hover:bg-[#343541] text-left w-full" onClick={() => { setPlusMenuOpen(false); setPrompt('Plataforma de OpenAI: ingrese un comando'); }}>Plataforma de OpenAI</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 w-full justify-center mt-2">
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-[#ececf1] hover:bg-[#343541] text-sm font-medium" onClick={() => fileInputRef.current?.click()}><FaImage />Crear una imagen</button>
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-[#ececf1] hover:bg-[#343541] text-sm font-medium" onClick={() => setPrompt('Redactar o modificar: ingrese su texto') }><FaRegEdit />Redactar o modificar</button>
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-[#ececf1] hover:bg-[#343541] text-sm font-medium" onClick={() => setPrompt('Hacer una búsqueda: ingrese su búsqueda') }><FaGlobe />Hacer una búsqueda</button>
            </div>
          </form>
        </div>
      </main>
    {/* Prompt contextuel */}
    {prompt && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-[#23272f] rounded-xl p-6 min-w-[320px] max-w-[90vw] flex flex-col items-center">
          <div className="mb-4 text-[#ececf1] font-semibold">{prompt}</div>
          <input
            className="w-full px-3 py-2 rounded bg-[#343541] text-white mb-4 focus:outline-none"
            value={promptValue}
            onChange={e => setPromptValue(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 w-full justify-end">
            <button
              className="px-4 py-2 rounded bg-[#343541] text-[#ececf1] hover:bg-[#e6b85c]"
              onClick={() => {
                alert(`Entrée : ${promptValue}`);
                setPrompt(null);
                setPromptValue("");
              }}
            >Aceptar</button>
            <button
              className="px-4 py-2 rounded bg-[#343541] text-[#ececf1] hover:bg-[#e74c3c]"
              onClick={() => {
                setPrompt(null);
                setPromptValue("");
              }}
            >Cancelar</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
