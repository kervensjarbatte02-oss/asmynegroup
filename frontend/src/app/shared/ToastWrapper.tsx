"use client";
import React from "react";
import { ToastProvider } from "./ToastContext";

export default function ToastWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
