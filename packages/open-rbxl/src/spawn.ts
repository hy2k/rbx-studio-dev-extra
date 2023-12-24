import { spawn } from 'node:child_process';
import * as path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

const ENV_VAR_ROBLOX_STUDIO_PATH = 'ROBLOX_STUDIO_PATH';

export type HandleSpawn = (placePath: string) => Promise<void>;

export const spawnRobloxStudio: HandleSpawn = async (placePath: string) => {
	const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
	const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

	const child = spawn(robloxStudioPath.application, [placePath], {
		detached: true,
		stdio: 'ignore',
	});
	child.unref();
};
