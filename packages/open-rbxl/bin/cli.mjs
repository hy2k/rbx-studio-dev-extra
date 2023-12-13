#!/usr/bin/env node

// @ts-check

import { cli } from 'cleye';

import { open } from '../dist/index.js';
import pkg from '../package.json' with { type: 'json' };

const argv = cli({
	flags: {
		force: {
			default: false,
			description: 'Force open another Roblox Studio instance even if one is already open.',
			type: Boolean,
		},
		verbose: {
			default: false,
			description: 'Print verbose output.',
			type: Boolean,
		},
	},
	name: pkg.name,
	parameters: [
		// Required
		'<rbxl file>',
	],
	version: pkg.version,
});

await open(argv._.rbxlFile, {
	force: argv.flags.force,
});
