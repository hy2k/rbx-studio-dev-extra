import { HttpService } from '@rbxts/services';
import { t } from '@rbxts/t';

const DEFAULT_POLL_INTERVAL = 10;
const DEFAULT_PORT = 34567;

function createModuleScript(source: string) {
	const module = new Instance('ModuleScript');

	// Wrap in a function and return it to prevent the following error:
	// "Module code did not return exactly one value "
	module.Source = `return function () ${source} end`;

	return module;
}

function start(serverUrl: string) {
	const response = HttpService.RequestAsync({
		Method: 'GET',
		Url: `${serverUrl}/start`,
	});

	if (!response.Success) {
		throw error('Failed to start');
	}

	const body = HttpService.JSONDecode(response.Body);

	const bodyCheck = t.strictInterface({
		source: t.string,
	});

	assert(bodyCheck(body));

	const { source } = body;

	const module = createModuleScript(source);

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const fn = require(module);

	if (typeIs(fn, 'function')) {
		fn();
	} else {
		// This should never happen or error in createModuleScript function
		throw error('Module did not return a function');
	}
}

function poll(serverUrl: string) {
	print('Polling...');

	const response = HttpService.RequestAsync({
		Method: 'GET',
		Url: `${serverUrl}/poll`,
	});

	if (!response.Success) {
		throw error('Failed to poll');
	}
}

let isRunning = false;

// eslint-disable-next-line no-constant-condition
while (true) {
	task.wait(DEFAULT_POLL_INTERVAL);

	if (isRunning) {
		continue;
	}

	// TODO: Allow custom port to be set in the plugin setting
	const serverUrl = `http://127.0.0.1:${DEFAULT_PORT}`;

	try {
		poll(serverUrl);
	} catch (err) {
		warn(err);
		continue;
	}

	isRunning = true;
	try {
		start(serverUrl);
	} catch (err) {
		warn(err);
		isRunning = false;
		continue;
	}
}
