import { config } from './config';

const PREFIX = '[run-in-roblox-studio]';

export function debuglog(...args: unknown[]): void {
	if (!config.debugMode) {
		return;
	}

	print(PREFIX, ...args);
}

export function debugwarn(...args: unknown[]): void {
	if (!config.debugMode) {
		return;
	}

	warn(PREFIX, ...args);
}
