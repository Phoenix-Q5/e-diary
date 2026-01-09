import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module"
    },
    plugins: { import: importPlugin },
    rules: {
      "no-unused-vars": "off"
    }
  },
  prettier
];
