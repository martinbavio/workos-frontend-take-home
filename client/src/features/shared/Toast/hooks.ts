import { createContext, useContext } from "react";

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
