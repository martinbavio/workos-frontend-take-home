import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs";
import type { TabValue } from "./types";
import { createContext, useContext } from "react";

// Hook for getting app search params
export function useAppSearchParams() {
  return useQueryStates({
    tab: parseAsStringEnum<TabValue>(["users", "roles"]).withDefault("users"),
    q: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
  });
}

interface ToastContextValue {
  showToast: (
    title: string,
    description?: string,
    type?: "error" | "success" | "info",
  ) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
