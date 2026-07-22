"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CartProvider } from "./CartContext";

type CartProviderBridgeProps = {
  children: React.ReactNode;
  userCartPrefix: string;
};

function getScopeFromPath(pathname: string) {
  if (pathname.startsWith("/services/hair-solutions") || pathname.startsWith("/produit")) {
    return "hair-solutions";
  }
  if (pathname.startsWith("/services/marketplace-global")) {
    return "marketplace-global";
  }
  return "shared";
}

export default function CartProviderBridge({ children, userCartPrefix }: CartProviderBridgeProps) {
  const pathname = usePathname();
  const pathScope = getScopeFromPath(pathname);
  const storageKey = useMemo(() => `${userCartPrefix}:${pathScope}`, [userCartPrefix, pathScope]);
  return <CartProvider storageKey={storageKey}>{children}</CartProvider>;
}