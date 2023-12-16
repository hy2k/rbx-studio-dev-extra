const rbxCredits = script.FindFirstAncestor('rbx-credits');

const PREFIX = '[rbx-credits]';
const debugConfig = rbxCredits?.FindFirstChild('Debug');
const isDebug = debugConfig?.IsA('BoolValue') ? debugConfig.Value : false;

export function debuglog(...args: unknown[]) {
	if (!isDebug) {
		return;
	}

	print(PREFIX, ...args);
}

export function debugwarn(...args: unknown[]) {
	if (!isDebug) {
		return;
	}

	warn(PREFIX, ...args);
}
