import { program } from 'commander';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

import { startServer } from './server.js';

const ENV_VAR_ROBLOX_STUDIO_PATH = 'ROBLOX_STUDIO_PATH';

interface CLIOptions {
	readonly placePath: string;
	readonly scriptPath: string;
}

program
	.name('run-in-roblox-studio')
	.requiredOption('-script, --script-path <file.lua>', 'path to the script to run in Roblox Studio')
	.requiredOption('-place, --place-path <file.rbxl>', 'path to the place file to run in Roblox Studio')
	.showHelpAfterError();

async function validateOptions(options: CLIOptions) {
	if (options.placePath) {
		try {
			await fs.access(options.placePath);
		} catch (err) {
			throw new Error(`Place file "${options.placePath}" does not exis`);
		}
	}
}

program.parse();

const options: CLIOptions = program.opts();

await validateOptions(options);

try {
	const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
	const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

	spawn(robloxStudioPath.application, [options.placePath]);
} catch (err) {
	console.log(err);
	process.exit(1);
}

startServer().then(async () => {
	const response = await fetch('http://127.0.0.1:3000/');

	console.log(await response.json());
});

console.log(options);
