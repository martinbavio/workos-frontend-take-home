import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs, Box } from "@radix-ui/themes";

import { UsersTab } from "./features/users/components";
import { RolesTab } from "./features/roles/components";
import { useAppSearchParams } from "./features/shared/hooks";
import type { TabValue } from "./features/shared/types";
import { ToastProvider } from "./features/shared/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme accentColor="iris">
        <ToastProvider>
          <AppTabs />
        </ToastProvider>
      </Theme>
    </QueryClientProvider>
  );
}

function AppTabs() {
  const [searchParams, setSearchParams] = useAppSearchParams();

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value as TabValue, q: "", page: 1 });
  };

  return (
    <Box maxWidth="850px" mx="auto" p="5">
      <Tabs.Root value={searchParams.tab} onValueChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Trigger value="users">Users</Tabs.Trigger>
          <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
        </Tabs.List>
        <Box mt="5">
          <Tabs.Content value="users">
            <UsersTab />
          </Tabs.Content>
          <Tabs.Content value="roles">
            <RolesTab />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
