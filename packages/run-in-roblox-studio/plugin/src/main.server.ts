import { HttpService, RunService } from '@rbxts/services';
import { setInterval } from '@rbxts/set-timeout';
import { t } from '@rbxts/t';

import { config } from './config';
import { debuglog, debugwarn } from './debug';

const SERVER_URL = `http://127.0.0.1:${config.port}`;

const getURL = (route: string) => `${SERVER_URL}/${route}`;

function main() {
	debuglog('Started with debug mode enabled');

	let isRunning = false;

	setInterval(() => {
		if (isRunning) {
			return;
		}

		const [ok, response] = pcall(start);
		if (!ok) {
			debugwarn(response);
			return;
		}

		isRunning = true;

		debuglog('Got response from server, starting script');

		const source = bodyParser(response);

		runScript(source);

		debuglog('Script finished, stopping server');

		stop();
	}, config.pollInterval);
}

function createModuleScript(source: string) {
	const module = new Instance('ModuleScript');

	// Wrap in a function and return it to prevent the following error:
	// "Module code did not return exactly one value "
	module.Source = `return function () ${source} end`;

	return module;
}

function start() {
	const response = HttpService.RequestAsync({
		Method: 'POST',
		Url: getURL('start'),
	});

	if (!response.Success) {
		throw 'Failed to start';
	}

	return response;
}

function runScript(source: string) {
	const module = createModuleScript(source);

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const fn = require(module);

	if (typeIs(fn, 'function')) {
		fn();
	} else {
		// This should never happen or error in createModuleScript function
		throw 'Module did not return a function';
	}
}

function bodyParser(response: RequestAsyncResponse) {
	const body = HttpService.JSONDecode(response.Body);
	const bodyCheck = t.strictInterface({
		source: t.string,
	});
	assert(bodyCheck(body));

	const { source } = body;

	return source;
}

function stop() {
	const response = HttpService.RequestAsync({
		Method: 'POST',
		Url: getURL('stop'),
	});

	if (!response.Success) {
		throw 'Failed to stop';
	}
}

if (RunService.IsStudio() && RunService.IsEdit()) {
	main();
}
