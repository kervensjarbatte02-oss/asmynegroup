"use client";

import React from "react";
import dynamic from "next/dynamic";

const ToastWrapper = dynamic(() => import("./ToastWrapper"), { ssr: false });

export default function ClientToastWrapper({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      {/* @ts-ignore dynamic client import */}
      <ToastWrapper>{children}</ToastWrapper>
    </React.Suspense>
  );
}
