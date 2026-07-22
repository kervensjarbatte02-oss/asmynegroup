"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

type Toast = { id: string; type: "success" | "error" | "info"; message: string };

const ToastContext = createContext<{ addToast: (t: Omit<Toast, "id">) => void } | undefined>(undefined);

export function useToast() {
  const c = useContext(ToastContext);
  if (!c) throw new Error("useToast must be used within ToastProvider");
  return c;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    const next: Toast = { id, ...t };
    setToasts((s) => [next, ...s]);
    window.setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-3">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm rounded-xl p-3 shadow-lg border ${t.type === "success" ? "bg-white border-green-100 text-green-800" : t.type === "error" ? "bg-white border-red-100 text-red-800" : "bg-white border-gray-100 text-gray-800"}`}>
            <div className="text-sm font-semibold">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
