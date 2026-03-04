import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist", "storybook-static", "coverage"],
    languageOptions: {
      ecmaVersion: 2020
    },
    settings: {
      // Explicitly set the React version to bypass eslint-plugin-react's
      // auto-detection (which calls context.getFilename(), removed in ESLint v10).
      // Track: https://github.com/vercel/next.js/issues/89764
      react: { version: "19" }
    },
    rules: {
      ...nextVitals.rules
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage",
    "**/*.mjs"
  ]),
]);

export default eslintConfig;
