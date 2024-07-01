import { homedir } from 'node:os';
import * as path from 'node:path';

import type { RobloxStudioPath } from '../type.js';

export function getRobloxStudioRootMac(): string {
	// FIXME: This is not tested
	return path.join(homedir(), 'Library', 'Application Support', 'Roblox');
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function getRobloxStudioPathMac(_studioRoot: string): Promise<RobloxStudioPath> {
	// TODO
	throw new Error('Not implemented');
}
