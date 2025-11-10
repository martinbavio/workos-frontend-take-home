import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs, Box } from "@radix-ui/themes";

import { UsersTab } from "./features/users/components";
import { RolesTab } from "./features/roles/components";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

type TabValue = "users" | "roles";

export function App() {
  const [activeTab, setActiveTab] = useState<TabValue>("users");

  return (
    <QueryClientProvider client={queryClient}>
      <Theme accentColor="iris">
        <Box maxWidth="850px" mx="auto" p="5">
          <Tabs.Root
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabValue)}
          >
            <Tabs.List>
              <Tabs.Trigger value="users">Users</Tabs.Trigger>
              <Tabs.Trigger value="roles">Roles</Tabs.Trigger>
            </Tabs.List>
            <Box mt="5">
              {activeTab === "users" && <UsersTab />}
              {activeTab === "roles" && <RolesTab />}
            </Box>
          </Tabs.Root>
        </Box>
      </Theme>
    </QueryClientProvider>
  );
}
