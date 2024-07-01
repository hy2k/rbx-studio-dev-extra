import isWsl from 'is-wsl';

export * from './errors.js';

import type { RobloxStudioPath } from './type.js';

import { getRobloxStudioPathInternal } from './internal.js';

export function getRobloxStudioPath(studioRoot?: string): Promise<RobloxStudioPath> {
	return getRobloxStudioPathInternal({
		isWsl: isWsl,
		platform: process.platform,
		studioRoot: studioRoot,
	});
}
