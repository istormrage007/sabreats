"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  getVerticalConfig,
  type VerticalConfig,
} from "@/lib/verticals";
import type { VerticalId } from "@/types/vertical";

const VerticalContext = createContext<VerticalConfig | null>(null);

export function VerticalProvider({
  vertical,
  children,
}: {
  vertical: VerticalId;
  children: ReactNode;
}) {
  const config = getVerticalConfig(vertical);
  return (
    <VerticalContext.Provider value={config}>{children}</VerticalContext.Provider>
  );
}

export function useVerticalConfig(): VerticalConfig {
  const context = useContext(VerticalContext);
  if (!context) {
    throw new Error("useVerticalConfig must be used within VerticalProvider");
  }
  return context;
}

export function useVerticalCopy() {
  return useVerticalConfig().copy;
}

export function useVerticalId(): VerticalId {
  return useVerticalConfig().id;
}
