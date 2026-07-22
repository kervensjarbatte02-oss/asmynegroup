"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "../Navbar";

type MessageThread = {
  id: string;
  name: string;
  handle: string;
  joinedAt: string;
  preview: string;
  time: string;
  avatarClassName: string;
  isVerified?: boolean;
};

type MessageAttachment = {
  url: string;
  name: string;
  mimeType: string;
  size: number;
  kind: "image" | "video" | "audio" | "file";
  durationSec?: number;
};

type ChatMessage = {
  id: string;
  text: string;
  attachment?: MessageAttachment | null;
  time: string;
  sender: "me" | "them";
  senderName?: string;
  createdAt?: string;
  replyTo?: { messageId: string; text: string; senderName: string } | null;
};

type ForwardTarget = {
  id: string;
  name: string;
  handle: string;
  avatarClassName: string;
  isVerified?: boolean;
};

export default function MarketplaceGlobalMessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [composerValue, setComposerValue] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [forwardLoading, setForwardLoading] = useState(false);
  const [forwardTargets, setForwardTargets] = useState<ForwardTarget[]>([]);
  const [forwardSearch, setForwardSearch] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [startingMessage, setStartingMessage] = useState("Hola, me gustaría hablar sobre tu producto.");
  const [creatingThread, setCreatingThread] = useState(false);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) ?? null,
    [threads, selectedThreadId],
  );

  const selectedRecipient = useMemo(
    () => forwardTargets.find((target) => target.id === selectedRecipientId) ?? null,
    [forwardTargets, selectedRecipientId],
  );

  const loadForwardTargets = async (query = "") => {
    setForwardLoading(true);
    try {
      const url = query.startsWith("id=")
        ? `/api/messages/forward?${query}`
        : `/api/messages/forward${query ? `?q=${encodeURIComponent(query)}` : ""}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = (await response.json()) as { targets?: ForwardTarget[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "No fue posible cargar los usuarios.");
      }

      setForwardTargets(data.targets ?? []);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Error desconocido";
      setFeedback(detail);
      setForwardTargets([]);
    } finally {
      setForwardLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipientId = params.get("recipientId");
    const message = params.get("message") ?? "";

    if (!recipientId) {
      return;
    }

    setForwardSearch("");
    setSelectedRecipientId(recipientId);
    setStartingMessage(message || "Hola, me gustaría hablar sobre tu producto.");
    setNewThreadOpen(true);

    void (async () => {
      await loadForwardTargets(`id=${encodeURIComponent(recipientId)}`);
    })();
  }, []);

  useEffect(() => {
    if (!newThreadOpen || selectedRecipientId) {
      return;
    }

    void loadForwardTargets(forwardSearch);
  }, [newThreadOpen, selectedRecipientId, forwardSearch]);

  const loadThreads = async (silent = false) => {
    if (!silent) {
      setThreadsLoading(true);
    }

    try {
      const response = await fetch("/api/messages/threads", { cache: "no-store" });
      const data = (await response.json()) as { threads?: MessageThread[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Imposible cargar las conversaciones.");
      }

      const nextThreads = data.threads ?? [];
      setThreads(nextThreads);
      setSelectedThreadId((current) => {
        if (current && nextThreads.some((thread) => thread.id === current)) {
          return current;
        }
        return nextThreads.length > 0 ? nextThreads[0].id : null;
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Error desconocido";
      setFeedback(detail);
    } finally {
      if (!silent) {
        setThreadsLoading(false);
      }
    }
  };

  const loadMessages = async (threadId: string, silent = false) => {
    if (!silent) {
      setMessagesLoading(true);
    }

    try {
      const response = await fetch(`/api/messages/threads/${threadId}/messages`, { cache: "no-store" });
      const data = (await response.json()) as { messages?: ChatMessage[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Imposible cargar los mensajes.");
      }

      setMessages(data.messages ?? []);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Error desconocido";
      setFeedback(detail);
      setMessages([]);
    } finally {
      if (!silent) {
        setMessagesLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadThreads();
  }, []);

  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([]);
      return;
    }

    void loadMessages(selectedThreadId);
  }, [selectedThreadId]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const handleSendMessage = async () => {
    if (!selectedThreadId || !composerValue.trim()) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/messages/threads/${selectedThreadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: composerValue.trim() }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "No fue posible enviar el mensaje.");
      }

      setComposerValue("");
      await loadMessages(selectedThreadId, true);
      await loadThreads(true);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Error desconocido";
      setFeedback(detail);
    } finally {
      setSending(false);
    }
  };

  const handleCreateThread = async () => {
    if (!selectedRecipientId || !startingMessage.trim()) {
      setFeedback("Selecciona un destinatario y escribe un mensaje.");
      return;
    }

    setCreatingThread(true);
    try {
      const response = await fetch("/api/messages/forward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageText: startingMessage.trim(),
          recipientIds: [selectedRecipientId],
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        threadIds?: string[];
        delivered?: number;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Imposible iniciar la conversación.");
      }

      await loadThreads(true);
      if (data.threadIds && data.threadIds.length > 0) {
        setSelectedThreadId(data.threadIds[0]);
        await loadMessages(data.threadIds[0], true);
      }

      setNewThreadOpen(false);
      setSelectedRecipientId(null);
      setStartingMessage("Hola, me gustaría hablar sobre tu producto.");
      setFeedback("Conversación iniciada con éxito.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Error desconocido";
      setFeedback(detail);
    } finally {
      setCreatingThread(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mensajes</h1>
                <p className="mt-2 text-sm text-gray-600">Mensajería cargada desde la API interna.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/services/marketplace-global" className="inline-flex items-center rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700">
                  Volver al Marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => setNewThreadOpen(true)}
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 border border-gray-200"
                >
                  Nueva conversación
                </button>
                <button
                  type="button"
                  onClick={() => void loadThreads()}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Refrescar
                </button>
              </div>
            </div>

            {feedback ? (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{feedback}</div>
            ) : null}

            {newThreadOpen ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Nueva conversación</h2>
                      <p className="text-sm text-gray-500">Busca un comprador o vendedor y envía un primer mensaje.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewThreadOpen(false)}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Buscar un usuario</label>
                      <input
                        type="search"
                        value={forwardSearch}
                        onChange={(event) => setForwardSearch(event.target.value)}
                        className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                        placeholder="Nombre del vendedor o comprador"
                      />
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 max-h-72 overflow-y-auto">
                      {forwardLoading ? (
                        <div className="text-sm text-gray-500">Cargando usuarios...</div>
                      ) : forwardTargets.length === 0 ? (
                        <div className="text-sm text-gray-500">No se encontró ningún usuario.</div>
                      ) : (
                        <div className="space-y-2">
                          {forwardTargets.map((target) => (
                            <button
                              key={target.id}
                              type="button"
                              onClick={() => setSelectedRecipientId(target.id)}
                              className={`w-full rounded-3xl border px-4 py-3 text-left transition ${
                                target.id === selectedRecipientId
                                  ? "border-pink-600 bg-pink-50"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-gradient-to-br ${target.avatarClassName} text-sm font-bold text-white uppercase`}>
                                  {target.name.slice(0, 1)}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <span>{target.name}</span>
                                    {target.isVerified ? (
                                      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-pink-700">Verificado</span>
                                    ) : null}
                                  </div>
                                  <p className="text-sm text-gray-500">{target.handle}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Mensaje inicial</label>
                      <textarea
                        value={startingMessage}
                        onChange={(event) => setStartingMessage(event.target.value)}
                        rows={4}
                        className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                        placeholder="Hola, quisiera saber más sobre tu producto..."
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setNewThreadOpen(false)}
                        className="inline-flex items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateThread}
                        disabled={!selectedRecipientId || !startingMessage.trim() || creatingThread}
                        className="inline-flex items-center justify-center rounded-3xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {creatingThread ? "Iniciando..." : "Iniciar conversación"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 lg:grid-cols-[300px_1fr]">
              <aside className="rounded-3xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between text-sm font-semibold text-gray-700">
                  <span>Conversaciones</span>
                  <span>{threads.length}</span>
                </div>
                {threadsLoading ? (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">Cargando...</div>
                ) : threads.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">No se encontró ninguna conversación.</div>
                ) : (
                  <div className="space-y-2">
                    {threads.map((thread) => (
                      <button
                        key={thread.id}
                        type="button"
                        onClick={() => setSelectedThreadId(thread.id)}
                        className={`w-full rounded-3xl border px-3 py-3 text-left transition ${
                          thread.id === selectedThreadId
                            ? "border-pink-600 bg-white shadow-sm"
                            : "border-transparent bg-white/80 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br ${thread.avatarClassName} text-sm font-bold text-white uppercase`}>
                            {thread.name.slice(0, 1)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 text-sm font-semibold text-gray-900">
                              <span>{thread.name}</span>
                              <span className="text-xs text-gray-500">{thread.time}</span>
                            </div>
                            <p className="truncate text-sm text-gray-500">{thread.preview}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </aside>

              <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col">
                {selectedThread ? (
                  <>
                    <div className="mb-4 border-b border-gray-200 pb-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <span>{selectedThread.name}</span>
                            {selectedThread.isVerified ? (
                              <span className="rounded-full bg-pink-50 px-2 py-1 text-[11px] font-bold uppercase text-pink-700">Verificado</span>
                            ) : null}
                          </div>
                          <p className="text-xs text-gray-500">{selectedThread.handle} · {selectedThread.joinedAt}</p>
                        </div>
                        <span className="text-xs text-gray-500">Último mensaje: {selectedThread.time}</span>
                      </div>
                    </div>

                    <div className="min-h-[320px] flex-1 overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 p-4">
                      {messagesLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">Cargando mensajes...</div>
                      ) : messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-gray-500">
                          <div className="h-20 w-20 rounded-full bg-white p-4 shadow-sm">
                            <span className="text-4xl">💬</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">No hay mensajes en esta conversación.</p>
                            <p>Envía un mensaje para comenzar.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 overflow-y-auto px-1 py-2" style={{ maxHeight: 520 }}>
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`rounded-3xl p-4 shadow-sm ${
                                message.sender === "me"
                                  ? "ml-auto bg-pink-600 text-white"
                                  : "mr-auto bg-white text-gray-900 border border-gray-200"
                              }`}
                            >
                              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                                <span>{message.sender === "me" ? "Yo" : message.senderName ?? "Interlocutor"}</span>
                                <span>·</span>
                                <span>{message.time}</span>
                              </div>
                              {message.replyTo ? (
                                <div className="mb-3 rounded-2xl bg-white/80 p-3 text-xs text-gray-600">
                                  <div className="font-semibold">Respuesta a {message.replyTo.senderName}</div>
                                  <p>{message.replyTo.text}</p>
                                </div>
                              ) : null}
                              <p className="whitespace-pre-line break-words text-sm">{message.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                      <label className="flex-1">
                        <span className="sr-only">Nuevo mensaje</span>
                        <textarea
                          value={composerValue}
                          onChange={(event) => setComposerValue(event.target.value)}
                          rows={3}
                          className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                          placeholder="Escribe un mensaje..."
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!composerValue.trim() || sending}
                        className="inline-flex shrink-0 items-center justify-center rounded-3xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {sending ? "Enviando..." : "Enviar"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                    <p className="text-lg font-semibold text-gray-900">Selecciona una conversación</p>
                    <p className="mt-2">Elige una conversación a la izquierda para ver los mensajes.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
