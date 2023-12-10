import { program } from 'commander';
import fs from 'node:fs/promises';

import { launchRobloxStudio } from './launch-studio.js';
import { startServer } from './server.js';

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
			throw new Error(`Place file does not exist: ${options.placePath}`);
		}
	}
}

program.parse();

const options: CLIOptions = program.opts();
await validateOptions(options);
await launchRobloxStudio(options.placePath);

startServer().then(async () => {
	const response = await fetch('http://127.0.0.1:3000/');

	console.log(await response.json());
});

console.log(options);
