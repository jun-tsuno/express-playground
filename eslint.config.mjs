import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettierConfig,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		rules: {
			// TypeScriptの型チェックでカバーされるルールは無効化
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			// その他の推奨ルール
			// indent: ["error", "tab", { SwitchCase: 1 }],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"no-unused-vars": ["error", { vars: "all", args: "none" }],
			"no-console": ["off"],
			"prefer-const": "error",
			"no-var": "error",
		},
	},
	{
		ignores: [
			"node_modules/**",
			"dist/**",
			"*.config.js",
			"*.config.mjs",
			"pnpm-lock.yaml",
			"src/db/migrations/**",
		],
	},
];
