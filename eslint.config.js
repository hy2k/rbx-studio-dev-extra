// @ts-check

import {
	baseConfig,
	ignoresConfig,
	importConfig,
	perfConfig,
	robloxConfig,
	sortConfig,
	testConfig,
	tsConfig,
	tsOverrideRules,
} from 'eslint-config-y2';
import vitestPlugin from 'eslint-plugin-vitest';
import { dirname } from 'node:path';

tsConfig.languageOptions = {
	...tsConfig.languageOptions,
	parserOptions: {
		project: `${dirname(new URL(import.meta.url).pathname)}/packages/**/tsconfig.json`,
		sourceType: 'module',
	},
};

robloxConfig.files = ['**/plugin/**/*.ts'];
robloxConfig.ignores = ['**/out/**'];
robloxConfig.languageOptions = {
	...robloxConfig.languageOptions,
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		project: '**/plugin/tsconfig.json',
		sourceType: 'module',
	},
};

testConfig.plugins = {
	...testConfig.plugins,
	vitest: vitestPlugin,
};
testConfig.rules = {
	...vitestPlugin.configs.recommended.rules,
	...testConfig.rules,
};

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	//
	ignoresConfig,

	baseConfig,

	tsConfig,
	robloxConfig,

	{
		files: ['**/*'],
		rules: tsOverrideRules,
	},

	importConfig,
	testConfig,
	perfConfig,
	sortConfig,
];
