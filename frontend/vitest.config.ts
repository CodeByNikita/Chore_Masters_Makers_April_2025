import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom", // or 'happy-dom' if preferred
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        branches: 5,
        functions: 5,
        lines: 5,
        statements: 5,
      },
      exclude: [
        "**/src/types",
        "**eslint.config.js",
        "**/vite.config.ts",
        "**/vitest.config.ts",
        "**/vite-env.d.ts",
        // Entry point
        "**/main.tsx",

        // Test setup
        "**/setupTests.ts",
      ],
    },
    setupFiles: "./tests/setupTests",
  },
});
