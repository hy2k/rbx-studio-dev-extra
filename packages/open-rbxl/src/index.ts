import { spawn } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

import { OpenRbxlError } from './errors.js';

export * from './errors.js';

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
async function spawnRobloxStudio(placePath: string) {
	const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
	const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

	const child = spawn(robloxStudioPath.application, [placePath], {
		detached: true,
		stdio: 'ignore',
	});
	child.unref();
}

export interface RbxlOptions {
	/**
	 * Allows dependency injection for testing.
	 *
	 * @internal
	 */
	_spawnFn?: typeof spawnRobloxStudio;

	/**
	 * Custom function to check if Roblox Studio is already open.
	 *
	 * Defaults to checking for a lock file.
	 */
	checkFn?: (placePath: string) => Promise<boolean> | boolean;

	/**
	 * Force open Roblox Studio even if it is already open.
	 *
	 * Defaults to `false`.
	 */
	force?: boolean;

	/**
	 * Function to log messages.
	 *
	 * Defaults to `console.log`.
	 */
	log?: (message: string) => void;
}

export async function open(
	placePath: string,
	{ _spawnFn = spawnRobloxStudio, checkFn = checkStudioOpen, force = false, log = console.log }: RbxlOptions,
) {
	// Check if the place file exists
	try {
		const stat = await fs.stat(placePath);
		if (!stat.isFile()) {
			throw new OpenRbxlError('Not a file');
		}
	} catch (err) {
		if (err instanceof OpenRbxlError) {
			throw err;
		}
		throw new OpenRbxlError(`Invalid place path`, { cause: err });
	}

	if (!force) {
		if (await checkFn(placePath)) {
			log('[open-rbxl] Roblox Studio is already open');
			return;
		}
	}

	log('[open-rbxl] Opening Roblox Studio...');
	return _spawnFn(placePath);
}
