#!/usr/bin/env node

// @ts-check

import { cli as cleye } from 'cleye';
import * as fs from 'node:fs';

import { start } from '../dist/index.js';
import pkg from '../package.json' with { type: 'json' };

/**
 * @param {string} str
 */
function File(str) {
	const stat = fs.statSync(str);
	if (!stat.isFile()) {
		throw new Error(`"${str}" is not a file`);
	}
	return str;
}

const cli = cleye({
	flags: {
		place: {
			description: '(Required) Path to the place file to run in Roblox Studio',
			placeholder: '<place.rbxl>',
			type: File,
		},
		port: {
			alias: 'p',
			default: 34567,
			description: 'Port to use for the server',
			type: Number,
		},
		script: {
			description: '(Required) Path to the script to run in Roblox Studio',
			placeholder: '<script.lua>',
			type: File,
		},
	},
	name: pkg.name,
	version: pkg.version,
});

const { place: placePath, port, script: scriptPath } = cli.flags;

if (!placePath || !scriptPath) {
	cli.showHelp({
		description: 'Missing required options',
		usage: '--place <place.rbxl> --script <script.lua>',
	});
	process.exit(1);
}

start({ port: port });
