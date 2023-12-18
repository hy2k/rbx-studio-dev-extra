import { config } from './config';

const PREFIX = '[rbx-credits]';

export function debuglog(...args: unknown[]) {
	if (!config.debugMode) {
		return;
	}

	print(PREFIX, ...args);
}

export function debugwarn(...args: unknown[]) {
	if (!config.debugMode) {
		return;
	}

	warn(PREFIX, ...args);
}
