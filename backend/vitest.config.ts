import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: "./.env.test" });

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/tests/mongoDb_helper.ts"],
    environment: "node",
    globals: true,
    maxConcurrency: 1, // Run tests one at a time
    sequence: {
      shuffle: false, // Don't shuffle test order
      concurrent: false, // Don't run tests concurrently
    },
    hookTimeout: 5000, // Increase hook timeout to accommodate the delay
    testTimeout: 10000, // Increase test timeout as well
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      thresholds: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60,
      },
      exclude: [
        "**/src/errorHandlers/errorHandlers.ts",
        "**/src/db/dbConnection.ts",
        "**/src/db/seed.ts",
        "**/dist**",
        "**/vitest.config.ts",
        "**/src/types",
        "**/src/index.ts",
      ],
    },
  },
});
