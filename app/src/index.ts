import * as fs from 'fs/promises';

import { program } from 'commander';

interface CLIOptions {
	readonly placePath: string;
	readonly scriptPath: string;
}

program
	.name('run-in-roblox-studio')
	.requiredOption('-script, --script-path <file.lua>', 'path to the script to run in Roblox Studio')
	.option('-place, --place-path <file.rbxl>', '(optional) path to the place file to run in Roblox Studio')
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
}

async function run() {
	program.parse();

	const options: CLIOptions = program.opts();

	await validateOptions(options);

	console.log(options);
}

run()
	.then(() => {
		process.exit();
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
