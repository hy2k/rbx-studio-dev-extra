import { homedir } from 'node:os';
import path from 'node:path';

import type { RobloxStudioPath } from '../util';

export function getRobloxStudioRootMac() {
	// FIXME: This is not tested
	return path.join(homedir(), 'Library', 'Application Support', 'Roblox');
}

export async function getRobloxStudioPathMac(_studioRoot: string): Promise<RobloxStudioPath> {
	// TODO
	throw new Error('Not implemented');
}
