import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
} from "nuqs";
import type { TabValue } from "./types";

// Hook for getting app search params
export function useAppSearchParams() {
  return useQueryStates({
    tab: parseAsStringEnum<TabValue>(["users", "roles"]).withDefault("users"),
    q: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
  });
}
