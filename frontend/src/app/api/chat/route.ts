import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
type ChatLanguage = "fr" | "es" | "en";

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
    "immigration",
    "citizenship",
    "nationality",
    "passport",
    "residency",
    "residency renewal",
    "renewal",
    "family reunification",
    "apostille",
    "translation",
    "work permit",
    "student visa",
  ];

  return keywords.some((keyword) => text.includes(keyword));
}

function getSystemPrompt(language: ChatLanguage) {
  if (language === "es") {
    return "Eres un asistente de asesoria migratoria para Republica Dominicana. Responde solo sobre: visa, residencia, regularizacion, nacionalidad, documentos legales y orientacion del proceso. Si la pregunta esta fuera del tema, rechaza amablemente y redirige a temas migratorios. Responde en espanol claro y profesional.";
  }

  if (language === "en") {
    return "You are a migration advisory assistant for Dominican Republic. Answer only about migration topics: visa, residency, regularization, nationality, legal documents and process guidance. If the question is out of scope, politely refuse and redirect to migration topics. Reply in clear professional English.";
  }

  return "Tu es un assistant d'asesoria migratoria pour la Republique dominicaine. Reponds uniquement sur: visa, residence, regularisation, nationalite, documents legaux et accompagnement de procedure. Si la question est hors sujet, refuse poliment et redirige vers les sujets migratoires. Reponds en francais clair et professionnel.";
}

function getOutOfScopeReply(language: ChatLanguage) {
  if (language === "es") {
    return "Respondo solo preguntas de asesoria migratoria (visa, residencia, regularizacion, nacionalidad y documentos legales en Republica Dominicana).";
  }

  if (language === "en") {
    return "I only answer migration advisory questions (visa, residency, regularization, nationality and legal documents in the Dominican Republic).";
  }

  return "Je reponds uniquement aux questions d'asesoria migratoria (visa, residence, regularisation, nationalite, documents legaux en Republique dominicaine).";
}

export async function POST(request: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing on the server." },
      { status: 500 },
    );
  }

  let body: { message?: string; language?: ChatLanguage };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body.message?.trim();
  const language: ChatLanguage = body.language === "es" || body.language === "en" ? body.language : "fr";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (!isMigrationQuestion(message)) {
    return NextResponse.json({
      reply: getOutOfScopeReply(language),
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: getSystemPrompt(language),
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "OpenAI request failed." },
        { status: response.status },
      );
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "No reply generated." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Failed to call OpenAI API." },
      { status: 500 },
    );
  }
}
