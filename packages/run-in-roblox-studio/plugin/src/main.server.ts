import { RunService } from '@rbxts/services';
import { setInterval } from '@rbxts/set-timeout';
import { requestLuaSource, requestStop } from 'http';

import { config } from './config';
import { debuglog, debugwarn } from './debug';

function main(): void {
	debuglog('Started with debug mode enabled');

	let isRunning = false;

	setInterval(() => {
		if (isRunning) {
			return;
		}

		const [ok, luaSource] = pcall(requestLuaSource);
		if (!ok) {
			debugwarn(luaSource);
			return;
		}

		isRunning = true;

		debuglog('Request to start completed.');

		let isError = false;
		try {
			runScript(luaSource);
			debuglog('Script finished, stopping server');
		} catch (error) {
			debugwarn(error);
			isError = true;
		} finally {
			requestStop(isError);
		}
	}, config.pollInterval);
}

function createModuleScript(source: string): ModuleScript {
	const module = new Instance('ModuleScript');

	// Wrap in a function and return it to prevent the following error:
	// "Module code did not return exactly one value "
	module.Source = `return function () ${source} end`;

	return module;
}

function runScript(source: string): void {
	const module = createModuleScript(source);

	const [ok, fn] = pcall(require, module);
	if (!ok) {
		throw fn;
	}

	if (typeIs(fn, 'function')) {
		fn();

		return;
	}

	// This should never happen or error in createModuleScript function
	error('Module did not return a function');
}

if (RunService.IsStudio() && RunService.IsEdit()) {
	main();
}
