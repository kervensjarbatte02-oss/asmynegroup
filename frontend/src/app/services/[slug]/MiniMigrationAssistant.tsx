"use client";

import React, { useEffect, useMemo, useState } from "react";

type Message = {
  role: "assistant" | "user";
  text: string;
};

type ChatLanguage = "fr" | "es" | "en";

const suggestedQuestions: Record<ChatLanguage, string[]> = {
  fr: [
    "Quels documents faut-il pour une residence en Republique dominicaine ?",
    "Combien de temps prend une demande de visa ?",
    "Comment regulariser mon statut migratoire ?",
    "Quels sont les couts administratifs a prevoir ?",
    "Comment renouveler une residence temporaire ?",
    "Quelles sont les etapes pour demander la nationalite ?",
  ],
  es: [
    "Que documentos necesito para la residencia en Republica Dominicana?",
    "Cuanto tarda una solicitud de visa?",
    "Como regularizar mi estatus migratorio?",
    "Que costos administrativos debo prever?",
    "Como renovar una residencia temporal?",
    "Cuales son los pasos para solicitar la nacionalidad?",
  ],
  en: [
    "What documents are required for residency in the Dominican Republic?",
    "How long does a visa application take?",
    "How can I regularize my migration status?",
    "What administrative costs should I plan for?",
    "How do I renew a temporary residency?",
    "What are the steps to apply for nationality?",
  ],
};

const uiText: Record<
  ChatLanguage,
  {
    title: string;
    welcome: string;
    outOfScope: string;
    typing: string;
    handoffQuestion: string;
    yes: string;
    no: string;
    transferConfirm: string;
    continueHere: string;
    placeholder: string;
    send: string;
    close: string;
    outageQuota: string;
    outageRate: string;
    outageConfig: string;
    outageNetwork: string;
    outageGeneric: string;
    localPrefix: string;
    whatsappText: string;
    fallbackUnknown: string;
  }
> = {
  fr: {
    title: "Migration Assistant",
    welcome:
      "Bonjour, je suis votre assistant en asesoria migratoria. Je reponds uniquement aux questions migratoires.",
    outOfScope:
      "Je reponds uniquement aux questions d'asesoria migratoria (visa, residence, regularisation, nationalite, documents legaux).",
    typing: "Assistant en train d'ecrire...",
    handoffQuestion: "Souhaitez-vous parler avec quelqu'un maintenant ?",
    yes: "Oui",
    no: "Non",
    transferConfirm: "Parfait. Je te transfere maintenant sur WhatsApp au +1 (809) 308-6370.",
    continueHere: "Tres bien, je continue a vous assister ici.",
    placeholder: "Posez une question migratoire",
    send: "Envoyer",
    close: "Fermer l'assistant",
    outageQuota: "Le service IA est temporairement limite (quota/facturation).",
    outageRate: "Le service IA est surcharge pour le moment.",
    outageConfig: "Le service IA est en maintenance de configuration.",
    outageNetwork: "Connexion au service IA indisponible pour le moment.",
    outageGeneric: "Le service IA est temporairement indisponible.",
    localPrefix: "Je continue en mode local :",
    whatsappText: "Bonjour, je souhaite parler avec un conseiller en asesoria migratoria.",
    fallbackUnknown:
      "Je peux t'aider sur les visas, residence, regularisation, nationalite et documents legaux en Republique dominicaine.",
  },
  es: {
    title: "Asistente Migratorio",
    welcome:
      "Hola, soy su asistente de asesoria migratoria. Respondo solo preguntas migratorias.",
    outOfScope:
      "Respondo solo preguntas de asesoria migratoria (visa, residencia, regularizacion, nacionalidad y documentos legales).",
    typing: "El asistente esta escribiendo...",
    handoffQuestion: "Desea hablar con una persona ahora?",
    yes: "Si",
    no: "No",
    transferConfirm: "Perfecto. Le transfiero ahora a WhatsApp al +1 (809) 308-6370.",
    continueHere: "Perfecto, sigo ayudandole aqui.",
    placeholder: "Escriba una pregunta migratoria",
    send: "Enviar",
    close: "Cerrar asistente",
    outageQuota: "El servicio de IA esta temporalmente limitado (cuota/facturacion).",
    outageRate: "El servicio de IA esta saturado por el momento.",
    outageConfig: "El servicio de IA esta en mantenimiento de configuracion.",
    outageNetwork: "No hay conexion con el servicio de IA por el momento.",
    outageGeneric: "El servicio de IA esta temporalmente no disponible.",
    localPrefix: "Continuo en modo local:",
    whatsappText: "Hola, deseo hablar con un asesor de asesoria migratoria.",
    fallbackUnknown:
      "Puedo ayudarle con visas, residencia, regularizacion, nacionalidad y documentos legales en Republica Dominicana.",
  },
  en: {
    title: "Migration Assistant",
    welcome:
      "Hello, I am your migration advisory assistant. I only answer migration-related questions.",
    outOfScope:
      "I only answer migration advisory questions (visa, residency, regularization, nationality and legal documents).",
    typing: "Assistant is typing...",
    handoffQuestion: "Would you like to talk to someone now?",
    yes: "Yes",
    no: "No",
    transferConfirm: "Great. I am transferring you now to WhatsApp at +1 (809) 308-6370.",
    continueHere: "Great, I will continue assisting you here.",
    placeholder: "Ask a migration question",
    send: "Send",
    close: "Close assistant",
    outageQuota: "AI service is temporarily limited (quota/billing).",
    outageRate: "AI service is currently overloaded.",
    outageConfig: "AI service is under configuration maintenance.",
    outageNetwork: "Cannot connect to AI service right now.",
    outageGeneric: "AI service is temporarily unavailable.",
    localPrefix: "I will continue in local fallback mode:",
    whatsappText: "Hello, I would like to speak with a migration advisory agent.",
    fallbackUnknown:
      "I can help with visas, residency, regularization, nationality and legal documents in the Dominican Republic.",
  },
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isMigrationQuestion(value: string) {
  const text = normalizeText(value);
  const keywords = [
    "migration",
    "migratoire",
    "migratorio",
    "visa",
    "residence",
    "residencia",
    "regularisation",
    "regularizacion",
    "nationalite",
    "nacionalidad",
    "passeport",
    "pasaporte",
    "document",
    "permis",
    "permiso",
    "republique dominicaine",
    "dominicana",
    "rd",
    "renouvellement",
    "renouveler",
    "apostille",
    "traduction",
    "casier",
    "etudiant",
    "travail",
    "mariage",
    "mineur",
    "familial",
    "immigration",
    "citizenship",
    "nationality",
    "passport",
    "residency",
    "renewal",
    "family reunification",
    "work permit",
    "student visa",
  ];

  return keywords.some((keyword) => text.includes(keyword));
}

function getLocalMigrationReply(question: string, language: ChatLanguage) {
  const text = normalizeText(question);
  const t = uiText[language];

  if (text.includes("residence temporaire") || text.includes("residencia temporal")) {
    if (language === "es") {
      return "Para residencia temporal, normalmente se requiere pasaporte vigente, formularios oficiales, certificado de antecedentes/constancia segun el caso, comprobantes de ingresos y documentos legalizados. El expediente exacto depende de su categoria.";
    }
    if (language === "en") {
      return "For temporary residency, you usually need a valid passport, official forms, background certificate depending on the case, proof of income, and legalized documents. Exact requirements depend on your category.";
    }
    return "Pour une residence temporaire, il faut generalement un passeport valide, les formulaires officiels, certificat de bonne vie et moeurs/casier selon le cas, justificatifs de revenus et documents legalises. Le dossier exact depend de votre categorie.";
  }

  if (text.includes("residence permanente") || text.includes("residencia permanente")) {
    if (language === "es") {
      return "La residencia permanente se realiza por etapas: verificacion de elegibilidad, expediente legalizado, deposito administrativo y seguimiento hasta aprobacion. El tiempo depende del tipo de solicitud.";
    }
    if (language === "en") {
      return "Permanent residency is handled in stages: eligibility review, legalized file preparation, administrative filing, and follow-up until approval. Timing depends on the case type.";
    }
    return "La residence permanente se fait en plusieurs etapes: verification d'eligibilite, dossier complet legalise, depot administratif, puis suivi jusqu'a approbation. Le delai depend du type de dossier.";
  }

  if (text.includes("renouvel") || text.includes("venc") || text.includes("expiration")) {
    if (language === "es") {
      return "Para renovacion, anticipe antes del vencimiento: revise documentos vigentes, pague tasas aplicables, deposite a tiempo y haga seguimiento. Un expediente incompleto puede retrasar el proceso.";
    }
    if (language === "en") {
      return "For renewals, plan before expiration: verify updated documents, pay applicable fees, file on time, and track the case. Incomplete files can delay processing.";
    }
    return "Pour un renouvellement, anticipez avant expiration: verifier les pieces a jour, payer les frais applicables, deposer a temps et suivre l'etat du dossier. Un dossier incomplet peut rallonger les delais.";
  }

  if (text.includes("nationalite") || text.includes("nacionalidad")) {
    if (language === "es") {
      return "La solicitud de nacionalidad requiere verificar elegibilidad, documentos civiles legalizados, pruebas de residencia/estatus y tramites administrativos. El proceso se realiza por etapas.";
    }
    if (language === "en") {
      return "Nationality requests usually require eligibility review, legalized civil documents, proof of residence/status, and administrative formalities handled in stages.";
    }
    return "La demande de nationalite exige une verification d'eligibilite, pieces d'etat civil legalisees, preuves de residence/statut et formalites administratives. Le processus se fait par etapes avec controles documentaires.";
  }

  if (text.includes("apostille") || text.includes("traduction") || text.includes("legalisation")) {
    if (language === "es") {
      return "Los documentos extranjeros suelen requerir legalizacion (apostilla segun el pais) y traduccion oficial al espanol cuando aplique. Esta etapa es clave antes del deposito.";
    }
    if (language === "en") {
      return "Foreign documents often require legalization (apostille depending on country) and official Spanish translation when required. This is a key step before filing.";
    }
    return "Les documents etrangers doivent souvent etre legalises (apostille selon le pays) puis traduits en espagnol par un traducteur autorise si necessaire. Cette etape est cruciale avant depot.";
  }

  if (text.includes("mineur") || text.includes("enfant") || text.includes("hijo")) {
    if (language === "es") {
      return "Para menores, normalmente se requieren autorizaciones parentales, actas de nacimiento legalizadas y documentos de identidad de los representantes. Los requisitos cambian segun el caso familiar.";
    }
    if (language === "en") {
      return "For minors, parental authorizations, legalized birth certificates, and representatives' ID documents are commonly required. Requirements vary by family situation.";
    }
    return "Pour les mineurs, les autorisations parentales, actes de naissance legalises et documents d'identite des representants sont generalement requis. Les exigences changent selon la situation familiale.";
  }

  if (text.includes("mariage") || text.includes("conjoint") || text.includes("familial")) {
    if (language === "es") {
      return "Para casos por matrimonio/familia, normalmente se requieren pruebas de vinculo familiar, actas legalizadas y documentos de identidad vigentes. El tramite exacto depende de la categoria.";
    }
    if (language === "en") {
      return "For marriage/family cases, you generally need proof of family relationship, legalized records, and valid identity documents. Exact requirements depend on the case category.";
    }
    return "Pour un dossier lie au mariage/famille, il faut en general des preuves de lien familial, actes legalises et pieces d'identite a jour. Le type de procedure determine les documents exacts.";
  }

  if (text.includes("document") || text.includes("passeport") || text.includes("pasaporte")) {
    if (language === "es") {
      return "Para un expediente migratorio, generalmente se requiere: pasaporte vigente, fotos, acta de nacimiento, antecedentes penales, comprobantes y formularios oficiales. La lista final depende del tipo de tramite.";
    }
    if (language === "en") {
      return "For a migration file, you usually need: valid passport, photos, birth certificate, criminal record, supporting documents, and official forms. The final list depends on the procedure type.";
    }
    return "Pour un dossier migratoire, il faut en general: passeport valide, photos, acte de naissance, casier judiciaire, justificatifs et formulaires officiels. La liste exacte depend du type de demande.";
  }

  if (text.includes("visa")) {
    if (language === "es") {
      return "Los plazos de visa varian segun la categoria y la carga administrativa. Prepare un expediente completo para reducir retrasos.";
    }
    if (language === "en") {
      return "Visa timelines vary by category and administrative workload. Prepare a complete file to reduce delays.";
    }
    return "Les delais de visa varient selon la categorie et la charge administrative. Prepare un dossier complet pour eviter les retards.";
  }

  if (text.includes("regularisation") || text.includes("regularizacion")) {
    if (language === "es") {
      return "La regularizacion inicia con analisis del estatus actual, luego preparacion de documentos, deposito del expediente y seguimiento hasta decision.";
    }
    if (language === "en") {
      return "Regularization starts with status analysis, then document preparation, case filing, and follow-up until decision.";
    }
    return "La regularisation commence par l'analyse de ton statut, puis la preparation des pieces, le depot du dossier et le suivi jusqu'a la decision.";
  }

  if (text.includes("cout") || text.includes("cost") || text.includes("frais")) {
    if (language === "es") {
      return "Los costos incluyen normalmente tasas administrativas, legalizaciones/traducciones y posibles honorarios de acompanamiento.";
    }
    if (language === "en") {
      return "Costs generally include administrative fees, legalization/translation expenses, and possible advisory fees.";
    }
    return "Les couts incluent generalement frais administratifs, legalisations/traductions et eventuels honoraires d'accompagnement.";
  }

  if (text.includes("delai") || text.includes("temps") || text.includes("tiempo") || text.includes("plazo")) {
    if (language === "es") {
      return "Los plazos varian segun el tipo de tramite, la calidad del expediente y la carga administrativa del momento. Un expediente completo reduce retrasos.";
    }
    if (language === "en") {
      return "Timelines vary by procedure type, file quality, and current administrative workload. A complete file helps reduce delays.";
    }
    return "Les delais varient selon le type de demande, la qualite du dossier et la charge administrative du moment. Un dossier complet et coherent reduit les retards.";
  }

  return t.fallbackUnknown;
}

function getApiOutageMessage(rawError: unknown, language: ChatLanguage) {
  const errorText = normalizeText(typeof rawError === "string" ? rawError : "");
  const t = uiText[language];

  if (errorText.includes("quota") || errorText.includes("billing")) {
    return `${t.outageQuota} ${t.localPrefix}`;
  }

  if (errorText.includes("rate") || errorText.includes("too many requests")) {
    return `${t.outageRate} ${t.localPrefix}`;
  }

  if (errorText.includes("invalid") || errorText.includes("api key") || errorText.includes("unauthorized")) {
    return `${t.outageConfig} ${t.localPrefix}`;
  }

  if (errorText.includes("timeout") || errorText.includes("network") || errorText.includes("failed")) {
    return `${t.outageNetwork} ${t.localPrefix}`;
  }

  return `${t.outageGeneric} ${t.localPrefix}`;
}

export default function MiniMigrationAssistant() {
  const [language, setLanguage] = useState<ChatLanguage>("es");
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assistantRepliesCount, setAssistantRepliesCount] = useState(0);
  const [showHumanHandoff, setShowHumanHandoff] = useState(false);
  const [handoffHandled, setHandoffHandled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: uiText.es.welcome,
    },
  ]);
  const t = uiText[language];

  const hasOnlyWelcomeMessage = useMemo(() => messages.length === 1, [messages.length]);

  useEffect(() => {
    if (messages.length === 1 && messages[0]?.role === "assistant") {
      setMessages([{ role: "assistant", text: t.welcome }]);
    }
  }, [language]);

  const appendAssistantMessage = (text: string, options?: { skipHandoffPrompt?: boolean }) => {
    setMessages((prev) => [...prev, { role: "assistant", text }]);
    setAssistantRepliesCount((prev) => {
      const next = prev + 1;
      if (next >= 8 && !handoffHandled && !options?.skipHandoffPrompt) {
        setShowHumanHandoff(true);
      }
      return next;
    });
  };

  const askQuestion = async (question: string) => {
    const userMessage: Message = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (!isMigrationQuestion(question)) {
      appendAssistantMessage(t.outOfScope);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question, language }),
      });

      const data = await response.json();
      const reply =
        typeof data?.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : t.outageGeneric;

      if (!response.ok) {
        const fallback = getLocalMigrationReply(question, language);
        const outage = getApiOutageMessage(data?.error, language);
        appendAssistantMessage(`${outage}\n\n${fallback}`);
        return;
      }

      appendAssistantMessage(reply);
    } catch {
      const fallback = getLocalMigrationReply(question, language);
      const outage = getApiOutageMessage("network_error", language);
      appendAssistantMessage(`${outage}\n\n${fallback}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferYes = () => {
    setShowHumanHandoff(false);
    setHandoffHandled(true);
    appendAssistantMessage(t.transferConfirm, { skipHandoffPrompt: true });
    const phone = "18093086370";
    const text = encodeURIComponent(t.whatsappText);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleTransferNo = () => {
    setShowHumanHandoff(false);
    setHandoffHandled(true);
    appendAssistantMessage(t.continueHere, {
      skipHandoffPrompt: true,
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[70] w-[320px] max-w-[calc(100vw-1.5rem)] h-[430px] rounded-2xl border border-[#e6b85c]/50 bg-[#0a174e] shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6b85c]/30 bg-[#0f225f]">
            <div className="text-sm font-bold text-[#e6b85c]">{t.title}</div>
            <div className="flex items-center gap-1">
              {(["fr", "es", "en"] as ChatLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`text-[10px] px-2 py-1 rounded ${
                    language === lang
                      ? "bg-[#e6b85c] text-[#0a174e]"
                      : "bg-white/10 text-[#f7d99a]"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#e6b85c] hover:text-white transition-colors"
              aria-label={t.close}
            >
              x
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#09194d]">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-lg px-3 py-2 text-xs leading-5 ${
                  message.role === "assistant"
                    ? "bg-white/10 text-[#f7d99a]"
                    : "ml-auto bg-[#e6b85c] text-[#0a174e]"
                }`}
              >
                {message.text}
              </div>
            ))}

            {hasOnlyWelcomeMessage && (
              <div className="pt-1 space-y-2">
                {suggestedQuestions[language].map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      void askQuestion(question);
                    }}
                    className="w-full text-left text-xs rounded-lg border border-[#e6b85c]/40 px-3 py-2 text-[#f7d99a] hover:bg-[#ffffff14] transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="max-w-[90%] rounded-lg px-3 py-2 text-xs leading-5 bg-white/10 text-[#f7d99a]">
                {t.typing}
              </div>
            )}

            {showHumanHandoff && (
              <div className="max-w-[95%] rounded-lg px-3 py-2 text-xs leading-5 bg-[#102a6f] text-[#f7d99a] border border-[#e6b85c]/40 space-y-2">
                <div>{t.handoffQuestion}</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTransferYes}
                    className="rounded-md bg-[#e6b85c] text-[#0a174e] font-semibold px-3 py-1 hover:bg-[#f1c777] transition-colors"
                  >
                    {t.yes}
                  </button>
                  <button
                    type="button"
                    onClick={handleTransferNo}
                    className="rounded-md bg-white/10 text-[#f7d99a] font-semibold px-3 py-1 hover:bg-white/20 transition-colors"
                  >
                    {t.no}
                  </button>
                </div>
              </div>
            )}
          </div>

          <form
            className="p-3 border-t border-[#e6b85c]/30 bg-[#0f225f] flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const question = input.trim();
              if (!question || isLoading) return;
              void askQuestion(question);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.placeholder}
              disabled={isLoading}
              className="flex-1 rounded-md bg-white/95 text-[#0a174e] text-xs px-3 py-2 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-[#e6b85c] text-[#0a174e] text-xs font-semibold px-3 py-2 hover:bg-[#f1c777] transition-colors"
            >
              {t.send}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label="Ouvrir l'assistant IA"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[80] h-14 w-14 rounded-full bg-[#e6b85c] text-[#0a174e] shadow-2xl flex items-center justify-center hover:scale-105 hover:bg-[#f1c777] focus:outline-none focus:ring-4 focus:ring-[#e6b85c]/50 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2" />
          <rect x="5" y="7" width="14" height="10" rx="3" />
          <circle cx="10" cy="12" r="1" fill="currentColor" />
          <circle cx="14" cy="12" r="1" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6M8 20h2M14 20h2" />
        </svg>
      </button>
    </>
  );
}
