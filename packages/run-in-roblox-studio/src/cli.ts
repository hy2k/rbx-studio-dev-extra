import { cli as cleye } from 'cleye';
import * as fs from 'node:fs';
import { openRbxl } from 'open-rbxl';

import pkg from '../package.json' with { type: 'json' };
import { start } from './index.js';
import { logger } from './logger.js';

function File(str: string) {
	const stat = fs.statSync(str);
	if (!stat.isFile()) {
		throw new Error(`"${str}" is not a file`);
	}
	return str;
}

const cli = cleye({
	flags: {
		name: {
			alias: 'n',
			description: 'Name of the place to use for the server',
			type: String,
		},
		place: {
			description: '(Required) Path to the place file to run in Roblox Studio',
			placeholder: '<place.rbxl>',
			type: File,
		},
		port: {
			alias: 'p',
			default: 14105,
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

const { name: placeName, place: placePath, port, script: scriptPath } = cli.flags;

if (!placePath || !scriptPath) {
	cli.showHelp({
		description: 'Missing required options',
		usage: '--place <place.rbxl> --script <script.lua>',
	});
	process.exit(1);
}

start({
	placeName: placeName,
	placePath: placePath,
	port: port,
	scriptPath: scriptPath,
}).catch((err) => {
	logger.fatal(err);
	process.exit(1);
});

openRbxl(placePath, {
	log: (message) => {
		logger.info(message);
	},
}).catch((err) => {
	logger.fatal(err);
	process.exit(1);
});
