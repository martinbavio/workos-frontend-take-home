import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: "chromium",
        },
      ],
    },
  },
});
