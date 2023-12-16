// @ts-check

// Workaround for `rojo build -p` for WSL

import { $ } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

const $$ = $({
	stdio: 'inherit',
	verbose: true,
});

const ENV_VAR_ROBLOX_STUDIO_PATH = 'ROBLOX_STUDIO_PATH';

const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

if (!fs.existsSync('./out')) {
	await $$`rbxtsc --type model`;
}

const plugin = path.join(robloxStudioPath.plugins, 'rbx-credits-dev.rbxm');

$$`rojo build dev.project.json -o ${plugin} --watch`;

process.on('SIGINT', () => {
	if (fs.existsSync(plugin)) {
		console.info(`Cleaning up ${plugin}`);
		fs.rmSync(plugin);
	}
});
