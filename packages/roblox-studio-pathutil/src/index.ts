import isWsl from 'is-wsl';

export * from './errors.js';

import { getRobloxStudioPathInternal } from './internal.js';

export function getRobloxStudioPath(studioRoot?: string) {
	return getRobloxStudioPathInternal({
		isWsl: isWsl,
		platform: process.platform,
		studioRoot: studioRoot,
	});
}
