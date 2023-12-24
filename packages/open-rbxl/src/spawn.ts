import { spawn } from 'node:child_process';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

export type HandleSpawn = (placePath: string) => Promise<void>;

export const spawnRobloxStudio: HandleSpawn = async (placePath: string) => {
	const robloxStudioPath = await getRobloxStudioPath();

	const child = spawn(robloxStudioPath.application, [placePath], {
		detached: true,
		stdio: 'ignore',
	});
	child.unref();
};
