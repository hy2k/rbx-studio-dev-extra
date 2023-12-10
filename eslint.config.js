/* eslint-disable import/no-default-export */

import eslint from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import robloxTsPlugin from 'eslint-plugin-roblox-ts';
import path from 'node:path';

const robloxTsPath = './packages/plugin';

/** @type  {import("eslint").Linter.FlatConfig} */
const robloxTsConfig = {
	files: [path.resolve(robloxTsPath, '**/*.ts')],
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
			ecmaVersion: 2018,
			project: path.resolve(robloxTsPath, 'tsconfig.json'),
			sourceType: 'module',
		},
	},
	plugins: {
		'@typescript-eslint': typescriptPlugin,
		'roblox-ts': robloxTsPlugin,
	},
	rules: {
		...typescriptPlugin.configs.recommended.rules,
		...robloxTsPlugin.configs.recommended.rules,

		// Roblox-ts does not allow this
		'@typescript-eslint/ban-ts-comment': 'error',

		// Luau can throw string errors, so this is fine
		'@typescript-eslint/no-throw-literal': 'off',
	},
};

/** @type  {import("eslint").Linter.RulesRecord} */
const stylisticPreferences = {
	curly: ['warn', 'all'],
	'function-paren-newline': ['warn', 'multiline-arguments'],
	'import/max-dependencies': [
		'warn',
		{
			ignoreTypeImports: true,
			max: 20,
		},
	],
	'import/no-default-export': 'warn',

	'import/no-duplicates': 'warn',
	'import/no-mutable-exports': 'warn',
	'object-shorthand': ['warn', 'never'],
	'perfectionist/sort-array-includes': [
		'warn',
		{
			order: 'asc',
			'spread-last': true,
			type: 'natural',
		},
	],

	'perfectionist/sort-classes': [
		'warn',
		{
			groups: [
				'index-signature',
				'static-property',
				'private-property',
				'property',
				'constructor',
				'static-method',
				'private-method',
				'static-private-method',
				'method',
				['get-method', 'set-method'],
				'unknown',
			],
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-enums': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-exports': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-imports': [
		'warn',
		{
			'newlines-between': 'always',
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-imports': [
		'warn',
		{
			groups: [
				'type',
				['builtin', 'external'],
				'internal-type',
				'internal',
				['parent-type', 'sibling-type', 'index-type'],
				['parent', 'sibling', 'index'],
				'object',
				'unknown',
			],
			'newlines-between': 'always',
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-interfaces': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-jsx-props': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-maps': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-named-exports': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-named-imports': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-object-types': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-objects': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'perfectionist/sort-union-types': [
		'warn',
		{
			order: 'asc',
			type: 'natural',
		},
	],
	'prefer-arrow-callback': 'error',
};

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	{
		files: ['**/*.ts', '**/*.js'],
		ignores: ['**/node_modules/*', '**/dist/*', '**/out/*'],
		plugins: {
			import: importPlugin,
			perfectionist: perfectionistPlugin,
		},
		rules: {
			...eslint.configs.recommended.rules,

			...stylisticPreferences,
		},
	},

	// Disable rules that are incompatible with or better handled by TypeScript
	{
		rules: typescriptPlugin.configs['eslint-recommended'].overrides[0].rules,
	},

	// Enable TypeScript-specific rules
	{
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: path.resolve('./tsconfig.json'),
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptPlugin,
		},
		rules: {
			...typescriptPlugin.configs.recommended.rules,

			'@typescript-eslint/consistent-indexed-object-style': ['warn', 'index-signature'],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					disallowTypeAnnotations: true,
					fixStyle: 'separate-type-imports',
					prefer: 'type-imports',
				},
			],

			'@typescript-eslint/indent': 'off',
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
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],

			'@typescript-eslint/switch-exhaustiveness-check': 'error',
			// Perf
			indent: 'off',

			'no-shadow': 'off',

			'no-unused-vars': 'off',
		},
	},

	robloxTsConfig,
];
