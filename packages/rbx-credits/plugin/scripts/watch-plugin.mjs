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
const DEV_PLUGIN_NAME = 'rbx-credits-dev.rbxm';

const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

if (!fs.existsSync('./out')) {
	await $$`rbxtsc --type model`;
}

$$`rojo build dev.project.json -o ${path.join(robloxStudioPath.plugins, DEV_PLUGIN_NAME)} --watch`;
