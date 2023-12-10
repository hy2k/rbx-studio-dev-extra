import fs from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';

import type { RobloxStudioPath } from '../type.js';

import { InvalidStudioRootError, StudioNotInstalledError } from '../errors.js';

async function getVersions(studioRoot: string) {
	try {
		return await fs.readdir(path.join(studioRoot, 'Versions'));
	} catch (err) {
		throw new InvalidStudioRootError('Versions directory does not exist', {
			cause: err,
		});
	}
}

async function findRobloxStudioExe(studioRoot: string) {
	for (const version of await getVersions(studioRoot)) {
		const exe = path.join(studioRoot, 'Versions', version, 'RobloxStudioBeta.exe');

		try {
			await fs.access(exe);
		} catch (err) {
			continue;
		}

		return exe;
	}

	throw new StudioNotInstalledError('Roblox Studio is not installed');
}

export async function getRobloxStudioPathWindows(studioRoot: string): Promise<RobloxStudioPath> {
	const plugins = path.join(studioRoot, 'Plugins');
	const executable = await findRobloxStudioExe(studioRoot);

	return {
		application: executable,
		plugins: plugins,
	};
}

export function getDefaultStudioRootWindows() {
	return path.join(path.join(homedir(), 'AppData', 'Local'), 'Roblox');
}
