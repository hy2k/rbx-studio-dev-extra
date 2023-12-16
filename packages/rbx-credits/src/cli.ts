import { cli as cleye } from 'cleye';
import * as fs from 'node:fs';
import { open } from 'open-rbxl';

import pkg from '../package.json' with { type: 'json' };
import { startServer } from './index.js';

function File(str: string) {
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
			default: 34568,
			description: 'Port to use for the server',
			type: Number,
		},
	},
	name: pkg.name,
	version: pkg.version,
});

const { place: placePath, port } = cli.flags;

if (!placePath) {
	cli.showHelp({
		description: 'Missing required options',
		usage: '--place <place.rbxl>',
	});
	process.exit(1);
}

startServer(port);

open(placePath, {});
