// @ts-check

// Workaround for rojo build --plugin not working from WSL

import fs from 'node:fs/promises';
import path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

const ENV_VAR_ROBLOX_STUDIO_PATH = 'ROBLOX_STUDIO_PATH';
const DEV_PLUGIN_NAME = 'run-in-roblox-studio-dev.rbxm';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const pluginPath = path.resolve(dirname, '..', DEV_PLUGIN_NAME);

const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

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
		const watcher = fs.watch(pluginPath, { signal: signal });
		console.log(`Watching ${DEV_PLUGIN_NAME} for changes...`);

		for await (const _event of watcher) {
			if (debounce) {
				continue;
			}

			try {
				await fs.copyFile(pluginPath, path.join(robloxStudioPath.plugins, DEV_PLUGIN_NAME));
				console.log(`️Copied ${DEV_PLUGIN_NAME} to Roblox Plugins folder.`);
			} catch (err) {
				console.error(`️Failed to copy ${DEV_PLUGIN_NAME}`);
				console.error(err);
			} finally {
				debounce = true;
			}
		}
	} catch (err) {
		if (err.name === 'AbortError') {
			return;
		}
		throw err;
	}
})();
