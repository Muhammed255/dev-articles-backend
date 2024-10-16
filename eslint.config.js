import nodePlugin from "eslint-plugin-node";

export default [
  {
    ignores: ["node_modules/**", ".netlify/**"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      node: nodePlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "node/no-missing-import": "error",
    },
  },
];
