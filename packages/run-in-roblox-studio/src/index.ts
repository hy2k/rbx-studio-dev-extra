import * as fs from 'node:fs/promises';

import { program } from 'commander';
import { startServer } from './server.js';
import { spawn } from 'node:child_process';

interface CLIOptions {
	readonly placePath: string;
	readonly scriptPath: string;
	readonly studioPath: string;
	readonly pluginsPath: string;
}

program
	.name('run-in-roblox-studio')
	.requiredOption('-script, --script-path <file.lua>', 'path to the script to run in Roblox Studio')
	.requiredOption('-place, --place-path <file.rbxl>', 'path to the place file to run in Roblox Studio')
	.option('-studio, --studio-path <RobloxStudio.{exe|app}>', '(optional) path to the Roblox Studio executable')
	.option('-plugins, --plugins-path <path/to/Roblox/Plugins>', '(optional) path to the Roblox Studio plugins folder')
	.showHelpAfterError();

class FsError extends Error {}

async function validateOptions(options: CLIOptions) {
	if (options.placePath) {
		try {
			await fs.access(options.placePath, fs.constants.R_OK);
		} catch (err) {
			throw new FsError(`Unable to read place file: ${options.placePath}`, {
				cause: err,
			});
		}
	}

	if (!options.studioPath) {
		throw new Error('TODO: Try to find Roblox Studio');
	}

	try {
		await fs.access(options.studioPath, fs.constants.X_OK);
	} catch (err) {
		throw new FsError(`Roblox Studio is not executable: ${options.studioPath}`, {
			cause: err,
		});
	}

	if (options.pluginsPath) {
		try {
			// Make sure it's a directory
			const stat = await fs.stat(options.pluginsPath);
			if (!stat.isDirectory()) {
				throw new FsError(`Plugins path is not a directory: ${options.pluginsPath}`);
			}
		} catch (err) {
			if (err instanceof FsError) {
				throw err;
			}
			throw new FsError(`Plugins path does not exists: ${options.pluginsPath}`, { cause: err });
		}
	}
}

program.parse();

const options: CLIOptions = program.opts();

await validateOptions(options);

startServer().then(async () => {
	const response = await fetch('http://127.0.0.1:3000/');

	console.log(await response.json());
});

console.log(options);

if (options.studioPath) {
	spawn(options.studioPath, [options.placePath]);
}
