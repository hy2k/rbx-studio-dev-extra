import { cli } from 'cleye';

import pkg from '../package.json' with { type: 'json' };
import { open } from './index.js';

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

open(argv._.rbxlFile, {
	force: argv.flags.force,
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
