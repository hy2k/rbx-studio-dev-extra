import fs from 'node:fs/promises';

import type { RobloxStudioPath } from './type.js';

import { InvalidStudioRootError, PlatformNotSupportedError } from './errors.js';
import { getRobloxStudioPathMac, getRobloxStudioRootMac } from './platform/mac.js';
import { getDefaultStudioRootWindows, getRobloxStudioPathWindows } from './platform/windows.js';

async function validateStudioRoot(studioRoot?: string) {
	if (studioRoot) {
		// Make sure the studio root is a valid directory
		try {
			const stat = await fs.stat(studioRoot);
			if (!stat.isDirectory()) {
				throw new InvalidStudioRootError('Not a directory');
			}
		} catch (err) {
			if (err instanceof InvalidStudioRootError) {
				throw err;
			}
			throw new InvalidStudioRootError(`Does not exist`, {
				cause: err,
			});
		}
	}
}

/**
 * This function only exists to configure the platform during testing.
 *
 * @internal
 **/
export async function getRobloxStudioPathInternal({
	isWsl = false,
	platform,
	studioRoot,
}: {
	isWsl?: boolean;
	platform: NodeJS.Platform;
	studioRoot?: string;
}): Promise<RobloxStudioPath> {
	switch (platform) {
		case 'win32': {
			await validateStudioRoot(studioRoot);
			return getRobloxStudioPathWindows(studioRoot ?? getDefaultStudioRootWindows());
		}
		case 'linux': {
			if (isWsl) {
				if (!studioRoot) {
					throw new Error('studioRoot is required when using WSL');
				}
				await validateStudioRoot(studioRoot);
				return getRobloxStudioPathWindows(studioRoot);
			}
			throw new PlatformNotSupportedError("Linux isn't supported without WSL");
		}
		case 'darwin': {
			return getRobloxStudioPathMac(studioRoot ?? getRobloxStudioRootMac());
		}
		default: {
			throw new PlatformNotSupportedError(`Platform ${platform} isn't supported`);
		}
	}
}
