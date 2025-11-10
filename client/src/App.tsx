import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs, Box } from "@radix-ui/themes";
import { useRef } from "react";

import { UsersTab } from "./features/users/components";
import { RolesTab } from "./features/roles/components";
import { useAppSearchParams } from "./features/shared/hooks";
import type { TabValue } from "./features/shared/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function App() {
  const [allParams, setAllParams] = useAppSearchParams();

  const isInitialMount = useRef(true);

  const handleTabChange = (value: string) => {
    // Only reset params if this is not the initial mount
    if (!isInitialMount.current) {
      // Set all params atomically in one update
      setAllParams({ tab: value as TabValue, q: null, page: null });
    } else {
      isInitialMount.current = false;
      setAllParams({ tab: value as TabValue });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Theme accentColor="iris">
        <Box maxWidth="850px" mx="auto" p="5">
          <Tabs.Root value={allParams.tab} onValueChange={handleTabChange}>
            <Tabs.List>
              <Tabs.Trigger value="users">Users</Tabs.Trigger>
              <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
            </Tabs.List>
            <Box mt="5">
              {allParams.tab === "users" && <UsersTab />}
              {allParams.tab === "roles" && <RolesTab />}
            </Box>
          </Tabs.Root>
        </Box>
      </Theme>
    </QueryClientProvider>
  );
}
