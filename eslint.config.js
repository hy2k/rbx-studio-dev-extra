import eslint from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import robloxTsPlugin from 'eslint-plugin-roblox-ts';

import path from 'node:path';

const robloxTsPath = './packages/plugin';

/** @type  {import("eslint").Linter.FlatConfig} */
const robloxTsConfig = {
	plugins: {
		'@typescript-eslint': typescriptPlugin,
		'roblox-ts': robloxTsPlugin,
	},
	files: [path.resolve(robloxTsPath, '**/*.ts')],
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
			ecmaVersion: 2018,
			sourceType: 'module',
			project: path.resolve(robloxTsPath, 'tsconfig.json'),
		},
	},
	rules: {
		...typescriptPlugin.configs.recommended.rules,
		...robloxTsPlugin.configs.recommended.rules,
	},
};

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	// Enable baseline ruleset
	{
		files: ['**/*.ts'],
		ignores: ['**/node_modules/*'],
		rules: eslint.configs.recommended.rules,
	},

	// Disable rules that are incompatible with or better handled by TypeScript
	{
		rules: typescriptPlugin.configs['eslint-recommended'].overrides[0].rules,
	},

	// Enable TypeScript-specific rules
	{
		plugins: {
			'@typescript-eslint': typescriptPlugin,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				sourceType: 'module',
				project: path.resolve('./tsconfig.json'),
			},
		},
		rules: {
			...typescriptPlugin.configs.recommended.rules,

			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					args: 'all',
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
				},
			],
		},
	},

	robloxTsConfig,
];
