// @ts-check

// Cross platform watch script for rojo plugins

import { $ } from 'execa';
import path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

const $$ = $({
	stdio: 'inherit',
	verbose: true,
});

const ENV_VAR_ROBLOX_STUDIO_PATH = 'ROBLOX_STUDIO_PATH';
const DEV_PLUGIN_NAME = 'run-in-roblox-studio-dev.rbxm';

const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

$$`rojo build -o ${path.join(robloxStudioPath.plugins, DEV_PLUGIN_NAME)} --watch`;
