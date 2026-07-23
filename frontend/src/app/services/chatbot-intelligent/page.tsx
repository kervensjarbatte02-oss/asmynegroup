"use client";

import React from "react";
import { useState } from "react";
import { FaPlus, FaRegCommentDots, FaSearch, FaRegFolder, FaRegCompass, FaUserCircle, FaMicrophone, FaRegEdit, FaGlobe, FaImage } from "react-icons/fa";

type Message = {
  role: 'user'|'ai',
  text: string,
  fileType?: 'image' | 'video' | 'file'
};



export default function ChatbotPage() {
  // Chat state
  const [messages, setMessages] = React.useState<Message[]>([]);
  // ...existing code...
  // Pour les prompts contextuels
  const [prompt, setPrompt] = React.useState<string | null>(null);
  const [promptValue, setPromptValue] = React.useState("");
  // Pour la galerie
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  // Pour le texte et l'envoi
  const [inputValue, setInputValue] = React.useState("");
  // Pour la reconnaissance vocale
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);
  const transcriptRef = React.useRef<string>("");

  const [plusMenuOpen, setPlusMenuOpen] = React.useState(false);
  const plusBtnRef = React.useRef<HTMLButtonElement | null>(null);

  // Fermer le menu si on clique ailleurs
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
    <div className="min-h-screen w-full bg-black text-white flex font-sans">
      {/* Sidebar icônes */}
      <aside className="w-20 bg-black border-r border-[#23272f] flex flex-col h-screen items-center justify-between py-4">
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="mb-4 w-full flex justify-center">
            <span className="text-xs font-bold tracking-wide text-[#ececf1] uppercase">Asmyne Group</span>
          </div>
          {/* Plus sidebar : supprimé, déplacé au centre */}
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Conversations" onClick={() => alert('Conversations')}>
            <FaRegCommentDots />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Search" onClick={() => alert('Recherche')}>
            <FaSearch />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Projects" onClick={() => alert('Projets')}>
            <FaRegFolder />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded hover:bg-[#23272f] text-white mx-auto" title="Explore" onClick={() => alert('Explorer')}>
            <FaRegCompass />
          </button>
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#23272f] text-white mx-auto" title="Profile" onClick={() => alert('Profil')}>
            <span className="text-lg"><FaUserCircle /></span>
          </button>
        </div>
      </aside>
      {/* Zone centrale moderne */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-xl flex flex-col items-center justify-center mt-[-80px]">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-8 mt-8 text-[#ececf1]">Par quoi commençons-nous ?</h1>
          {/* Zone de chat sans cadre ni fond */}
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
                placeholder="Poser une question"
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
                    // Appel API
                    setMessages(msgs => [...msgs, {role: 'ai', text: '⏳ Réponse en cours...'}]);
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
                        // Fallback automatique en espagnol
                        setMessages(msgs => [
                          ...msgs.slice(0, -1),
                          {role: 'ai', text: getAutoReply(userMsg)}
                        ]);
                      }
                    } catch (e) {
                      setMessages(msgs => [
                        ...msgs.slice(0, -1),
                        {role: 'ai', text: getAutoReply(userMsg)}
                      ]);
                    }
                  // Réponses automatiques fallback en espagnol
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
                    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
                      alert('Reconnaissance vocale non supportée');
                      return;
                    }
                    if (!recognitionRef.current) {
                      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                      recognitionRef.current = new SpeechRecognition();
                      recognitionRef.current.lang = 'fr-FR';
                      recognitionRef.current.continuous = false;
                      recognitionRef.current.interimResults = false;
                      recognitionRef.current.onresult = (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        transcriptRef.current = transcript;
                        setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
                      };
                      recognitionRef.current.onerror = () => setIsListening(false);
                      recognitionRef.current.onend = async () => {
                        setIsListening(false);
                        // Si du texte a été reconnu, on l'envoie automatiquement
                        const finalText = (inputValue + (inputValue && transcriptRef.current ? ' ' : '') + transcriptRef.current).trim();
                        transcriptRef.current = "";
                        if (finalText) {
                          setMessages(msgs => [...msgs, {role: 'user', text: finalText}]);
                          setInputValue("");
                          setMessages(msgs => [...msgs, {role: 'ai', text: '⏳ Réponse en cours...'}]);
                          try {
                            const res = await fetch("/api/chat", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ message: finalText })
                            });
                            const data = await res.json();
                            setMessages(msgs => [
                              ...msgs.slice(0, -1),
                              {role: 'ai', text: data.reply || data.error || 'Erreur AI'}
                            ]);
                          } catch (e) {
                            setMessages(msgs => [
                              ...msgs.slice(0, -1),
                              {role: 'ai', text: 'Erreur lors de la requête AI'}
                            ]);
                          }
                        }
                      };
                    }
                    if (isListening) return; // Empêche le double démarrage
                    setIsListening(true);
                    recognitionRef.current.start();
                  }}
                  title="Parler"
                >
                  <FaMicrophone />
                </button>
              )}
              {/* Menu Plus central */}
              {plusMenuOpen && (
                <div className="absolute left-0 top-12 z-30 min-w-[220px] bg-[#23272f] border border-[#343541] rounded-xl shadow-lg py-2 flex flex-col text-sm text-[#ececf1]">
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); fileInputRef.current?.click(); }}>Ajouter photos/fichiers</button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={async e => {
                      const files = e.target.files;
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
                          } catch (err) {
                            setMessages(msgs => [...msgs, { role: 'ai', text: `Erreur lors de l'envoi du fichier : ${file.name}` }]);
                          }
                        }
                      }
                    }}
                  />
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); fileInputRef.current?.click(); }}>Créer une image</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Réfléchis : Donnez une idée ou question'); }}>Réfléchis</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Recherche approfondie : Entrez votre requête'); }}>Recherche approfondie</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Recherche sur le Web : Entrez votre recherche'); }}>Recherche sur le Web</button>
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Je parle de lieu : Entrez un lieu'); }}>Je parle de lieu</button>
                  <div className="border-t border-[#343541] my-1" />
                  <button className="px-4 py-2 hover:bg-[#343541] text-left" onClick={() => { setPlusMenuOpen(false); setPrompt('Projets : Décrivez votre projet'); }}>Projets</button>
                  <div className="relative group">
                    <button className="px-4 py-2 w-full text-left hover:bg-[#343541] flex items-center justify-between" onClick={() => { setPlusMenuOpen(false); setPrompt('Plus : Autre action'); }}>Plus <span className="ml-2">›</span></button>
                    <div className="absolute left-full top-0 z-40 min-w-[160px] bg-[#23272f] border border-[#343541] rounded-xl shadow-lg py-2 hidden group-hover:block">
                      <button className="px-4 py-2 hover:bg-[#343541] text-left w-full" onClick={() => { setPlusMenuOpen(false); setPrompt('Canevas : Décrivez votre canevas'); }}>Canevas</button>
                      <button className="px-4 py-2 hover:bg-[#343541] text-left w-full" onClick={() => { setPlusMenuOpen(false); setPrompt('OpenAI Platform : Entrez une commande'); }}>OpenAI Platform</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 w-full justify-center mt-2">
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-[#ececf1] hover:bg-[#343541] text-sm font-medium" onClick={() => fileInputRef.current?.click()}><FaImage />Créer une image</button>
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-[#ececf1] hover:bg-[#343541] text-sm font-medium" onClick={() => setPrompt('Rédiger ou modifier : Entrez votre texte') }><FaRegEdit />Rédiger ou modifier</button>
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#23272f] bg-[#23272f] text-[#ececf1] hover:bg-[#343541] text-sm font-medium" onClick={() => setPrompt('Faire une recherche : Entrez votre recherche') }><FaGlobe />Faire une recherche</button>
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
            >Valider</button>
            <button
              className="px-4 py-2 rounded bg-[#343541] text-[#ececf1] hover:bg-[#e74c3c]"
              onClick={() => {
                setPrompt(null);
                setPromptValue("");
              }}
            >Annuler</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
