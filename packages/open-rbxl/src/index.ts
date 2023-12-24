import * as fs from 'node:fs/promises';
import { extname } from 'node:path';

import type { HandleSpawn } from './spawn.js';

import { OpenRbxlError } from './errors.js';
import { spawnRobloxStudio } from './spawn.js';

export * from './errors.js';

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

export interface RbxlOptions {
	/**
	 * Force open Roblox Studio even if it is already open.
	 *
	 * Defaults to `false`.
	 */
	force?: boolean;

	/**
	 * Custom function to check if Roblox Studio is already open.
	 *
	 * Checks for a *.rbxl.lock file by default.
	 */
	handleCheck?: (placePath: string) => Promise<boolean> | boolean;

	/**
	 * Function to spawn Roblox Studio.
	 *
	 * Calls `process.spawn` by default.
	 */
	handleSpawn?: HandleSpawn;

	/**
	 * Function to log messages.
	 *
	 * Defaults to `console.log`.
	 */
	log?: (message: string) => void;
}

export async function openRbxl(
	placePath: string,
	{ force = false, handleCheck = checkStudioOpen, handleSpawn = spawnRobloxStudio, log = console.log }: RbxlOptions,
) {
	try {
		const stat = await fs.stat(placePath);
		if (!stat.isFile()) {
			throw new OpenRbxlError('Not a file');
		}

		if (!extname(placePath).match(/\.rbxlx?/)) {
			throw new OpenRbxlError('Must be a .rbxl or .rbxlx file');
		}
	} catch (err) {
		if (err instanceof OpenRbxlError) {
			throw err;
		}
		throw new OpenRbxlError(`Invalid place path`, { cause: err });
	}

	if (!force) {
		if (await handleCheck(placePath)) {
			log('[open-rbxl] Roblox Studio is already open');
			return;
		}
	}

	log('[open-rbxl] Opening Roblox Studio...');
	return handleSpawn(placePath);
}
