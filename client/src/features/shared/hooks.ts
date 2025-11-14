import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs";
import type { DialogFieldContextProps, TabValue } from "./types";
import { createContext, useContext } from "react";

// Hook for getting app search params
export function useAppSearchParams() {
  return useQueryStates({
    tab: parseAsStringEnum<TabValue>(["users", "roles"]).withDefault("users"),
    q: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
  });
}

export const DialogFieldContext = createContext<DialogFieldContextProps | null>(
  null,
);

export function useDialogFieldContext() {
  const context = useContext(DialogFieldContext);
  if (!context) {
    throw new Error(
      "useDialogFieldContext must be used within a DialogFormField",
    );
  }
  return context;
}
