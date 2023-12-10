import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

const ENV_VAR_ROBLOX_STUDIO_PATH = 'ROBLOX_STUDIO_PATH';

async function checkStudioOpen(placePath: string): Promise<boolean> {
	// Assumming if a lock file is there, studio is open. Maybe there is a better approach.
	const lockFile = `${placePath}.lock`;

	try {
		const stat = await fs.stat(lockFile);
		if (stat.isFile()) {
			return true;
		}
	} catch {
		// Noop
	}
	return false;
}

export async function launchRobloxStudio(placePath: string) {
	if (await checkStudioOpen(placePath)) {
		console.log('Roblox Studio is already open');
		return;
	}

	const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
	const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

	spawn(robloxStudioPath.application, [placePath]);
}
