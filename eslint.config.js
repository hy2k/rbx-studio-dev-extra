import eslint from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import robloxTsPlugin from 'eslint-plugin-roblox-ts';
import { dirname } from 'node:path';

/** @type {import("eslint").Linter.FlatConfig} */
const baseConfig = {
	files: ['**/*'],
	rules: {
		...eslint.configs.recommended.rules,

		curly: ['warn', 'all'],
		'function-paren-newline': ['warn', 'multiline-arguments'],
		'object-shorthand': ['warn', 'never'],
		'prefer-arrow-callback': 'error',
	},
};

/** @type {import("eslint").Linter.RulesRecord} */
const typescriptRules = {
	...typescriptPlugin.configs['recommended-type-checked'].rules,

	'@typescript-eslint/consistent-indexed-object-style': ['warn', 'index-signature'],
	'@typescript-eslint/consistent-type-imports': [
		'warn',
		{
			disallowTypeAnnotations: true,
			fixStyle: 'separate-type-imports',
			prefer: 'type-imports',
		},
	],
	'@typescript-eslint/method-signature-style': ['warn', 'property'],
	'@typescript-eslint/no-shadow': 'error',
	'@typescript-eslint/no-unused-vars': [
		'warn',
		{
			args: 'all',
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
		},
	],
	'@typescript-eslint/switch-exhaustiveness-check': 'error',

	'no-shadow': 'off',
	'no-unused-vars': 'off',
};

/** @type {import("eslint").Linter.FlatConfig} */
const typescriptConfig = {
	files: ['**/*.ts'],
	languageOptions: {
		parser: typescriptParser,
		parserOptions: {
			project: `${dirname(new URL(import.meta.url).pathname)}/packages/**/tsconfig.json`,
			sourceType: 'module',
		},
	},
	plugins: {
		'@typescript-eslint': typescriptPlugin,
	},
	rules: typescriptRules,
};

/** @type  {import("eslint").Linter.FlatConfig} */
const robloxTsConfig = {
	files: ['**/plugin/**/*.ts'],
	ignores: ['**/out/**'],
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
			ecmaVersion: 'latest',
			project: '**/plugin/tsconfig.json',
			sourceType: 'module',
		},
	},
	plugins: {
		'@typescript-eslint': typescriptPlugin,
		'roblox-ts': robloxTsPlugin,
	},
	rules: {
		...robloxTsPlugin.configs.recommended.rules,

		// Overrides some rules roblox-ts config turns off
		...typescriptRules,

		// Roblox-ts does not allow this
		'@typescript-eslint/ban-ts-comment': 'error',

		// Luau can throw string errors, so this is fine
		'@typescript-eslint/no-throw-literal': 'off',
	},
};

/** @type {import("eslint").Linter.FlatConfig} */
const importConfig = {
	files: ['**/*.ts'],
	plugins: {
		import: importPlugin,
	},
	rules: {
		'import/max-dependencies': [
			'warn',
			{
				ignoreTypeImports: true,
				max: 20,
			},
		],
		'import/no-default-export': 'warn',
		'import/no-duplicates': 'warn',
		'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
		'import/no-mutable-exports': 'warn',
	},
};

/** @type {import("eslint").Linter.FlatConfig} */
const testingConfig = {
	files: ['**/*.test.*'],
	plugins: {
		jest: jestPlugin,
	},
	rules: {
		...jestPlugin.configs.recommended.rules,
		'@typescript-eslint/unbound-method': 'off',
		'import/no-extraneous-dependencies': 'off',
	},
};

/**
 * Ref: https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting
 * @type {import("eslint").Linter.FlatConfig}
 */
const performanceConfig = {
	files: ['**/*'],
	rules: {
		'@typescript-eslint/indent': 'off',
		'import/default': 'off',
		'import/named': 'off',
		'import/namespace': 'off',
		'import/no-cycle': 'off',
		'import/no-deprecated': 'off',
		'import/no-named-as-default': 'off',
		'import/no-named-as-default-member': 'off',
		'import/no-unused-modules': 'off',
		indent: 'off',
	},
};

/** @type {import("eslint").Linter.FlatConfig} */
const perfectionistConfig = {
	files: ['**/*'],
	plugins: {
		perfectionist: perfectionistPlugin,
	},
	rules: Object.entries(perfectionistPlugin.configs['recommended-natural'].rules)
		.map(([key, value]) => {
			return [key, ['warn', value[1]]];
		})
		.reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {}),
};

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	{
		ignores: ['**/node_modules/**', '**/dist/**'],
	},

	baseConfig,

	typescriptConfig,
	robloxTsConfig,

	// Disable rules that are incompatible with or better handled by TypeScript
	{
		rules: typescriptPlugin.configs['eslint-recommended'].overrides[0].rules,
	},

	importConfig,
	testingConfig,
	performanceConfig,
	perfectionistConfig,
];
