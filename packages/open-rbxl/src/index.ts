import { spawn } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
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

async function spawnRobloxStudio(placePath: string) {
	const robloxStudioRoot = process.env[ENV_VAR_ROBLOX_STUDIO_PATH];
	const robloxStudioPath = await getRobloxStudioPath(robloxStudioRoot ? path.resolve(robloxStudioRoot) : undefined);

	spawn(robloxStudioPath.application, [placePath]);
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
	 * Print verbose output.
	 *
	 * Defaults to `false`.
	 */
	verbose?: boolean;
}

export async function open(
	placePath: string,
	{ _spawnFn = spawnRobloxStudio, checkFn = checkStudioOpen, force = false, verbose = false }: RbxlOptions,
) {
	if (!force) {
		if (await checkFn(placePath)) {
			if (verbose) {
				console.log('Roblox Studio is already open');
			}
			return;
		}
	}

	_spawnFn(placePath);
}
