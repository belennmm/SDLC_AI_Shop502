import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.js"],
      exclude: ["src/index.js"],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80
      }
    }
  }
});
