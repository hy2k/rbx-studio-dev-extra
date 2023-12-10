import fs from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';

import type { RobloxStudioPath } from '../util.js';

import { InvalidStudioRootError, StudioNotFoundError } from '../errors.js';

async function findRobloxStudioExe(studioRoot: string) {
	const versionsPath = path.join(studioRoot, 'Versions');
	try {
		await fs.access(versionsPath);
	} catch (err) {
		throw new InvalidStudioRootError('Roblox Studio root path is invalid', {
			cause: err,
		});
	}
	const versions = await fs.readdir(path.join(studioRoot, 'Versions'));

	for (const version of versions) {
		const exe = path.join(studioRoot, 'Versions', version, 'RobloxStudioBeta.exe');

		try {
			await fs.access(exe);
		} catch (err) {
			continue;
		}

		return exe;
	}

	throw new StudioNotFoundError('Roblox Studio executable is not found');
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
