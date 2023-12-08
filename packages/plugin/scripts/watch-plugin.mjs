// @ts-check

// Workaround for rojo build --plugin not working from WSL

import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const ROBLOX_STUDIO_PATH = 'ROBLOX_STUDIO_PATH';
const DEV_PLUGIN_NAME = 'run-in-roblox-studio-dev.rbxm';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const pluginPath = path.resolve(dirname, '..', DEV_PLUGIN_NAME);

// Make sure ROBLOX_STUDIO_PATH is set
const studioStudioPath = process.env[ROBLOX_STUDIO_PATH];
if (!studioStudioPath) {
	console.error(`${ROBLOX_STUDIO_PATH} is not set`);
	process.exit(1);
}

// Make sure studioRoot is a valid directory
const pluginsFolder = path.resolve(studioStudioPath, 'Plugins');
try {
	if (!(await fs.stat(pluginsFolder)).isDirectory()) {
		throw new Error();
	}
} catch {
	console.error('Plugins folder is not a valid path:', pluginsFolder);
	process.exit(1);
}

const ac = new AbortController();
const { signal } = ac;

process.on('SIGINT', () => {
	ac.abort();
	console.log('Stopped watching file.');
	process.exit(0);
});

let debounce = false;
setInterval(() => {
	debounce = false;
}, 1000);

(async () => {
	try {
		const watcher = fs.watch(pluginPath, { signal });
		console.log(`Watching ${DEV_PLUGIN_NAME} for changes...`);

		for await (const _event of watcher) {
			if (debounce) continue;

			try {
				console.log(`️Copied ${DEV_PLUGIN_NAME} to Roblox Plugins folder.`);
			} catch {
				console.log(`️Failed to copy ${DEV_PLUGIN_NAME}.`);
			} finally {
				debounce = true;
			}
		}
	} catch (err) {
		if (err.name === 'AbortError') return;
		throw err;
	}
})();
