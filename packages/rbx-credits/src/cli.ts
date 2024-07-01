import { cli as cleye } from 'cleye';
import * as fs from 'node:fs';
import { openRbxl } from 'open-rbxl';

import pkg from '../package.json' with { type: 'json' };
import { startServer } from './index.js';
import { logger } from './logger.js';
import { copyPlugin } from './plugin.js';

const DEFAULT_PORT = 11499;

function File(str: string): string {
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
			default: DEFAULT_PORT,
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

copyPlugin().catch((err: unknown) => {
	logger.fatal(err);
	process.exit(1);
});

startServer(port).catch((err: unknown) => {
	logger.fatal(err);
});

openRbxl(placePath, {
	log: (message) => {
		logger.info(message);
	},
}).catch((err: unknown) => {
	logger.fatal(err);
});
