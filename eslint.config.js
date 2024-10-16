import nodePlugin from "eslint-plugin-node";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

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
			"unused-imports": unusedImportsPlugin,
		},
		rules: {
			"no-unused-vars": [
				"warn",
				{ vars: "all", args: "after-used", ignoreRestSiblings: false },
			],
			"unused-imports/no-unused-imports": "warn",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],
		},
	},
];
