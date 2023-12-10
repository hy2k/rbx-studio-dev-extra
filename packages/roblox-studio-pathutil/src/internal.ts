import type { RobloxStudioPath } from './util.js';

import { PlatformNotSupportedError } from './errors.js';
import { getRobloxStudioPathMac, getRobloxStudioRootMac } from './platform/mac.js';
import { getDefaultStudioRootWindows, getRobloxStudioPathWindows } from './platform/windows.js';

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
			return getRobloxStudioPathWindows(studioRoot ?? getDefaultStudioRootWindows());
		}
		case 'linux': {
			if (isWsl) {
				if (!studioRoot) {
					throw new Error('studioRoot is required when using WSL');
				}
				return getRobloxStudioPathWindows(studioRoot);
			}
			throw new PlatformNotSupportedError("Linux isn't supported without WSL");
		}
		case 'darwin': {
			return getRobloxStudioPathMac(studioRoot ?? getRobloxStudioRootMac());
		}
		default: {
			throw new PlatformNotSupportedError(`Platform ${process.platform} isn't supported`);
		}
	}
}
