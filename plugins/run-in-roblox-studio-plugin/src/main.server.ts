import { HttpService } from '@rbxts/services';
import { t } from '@rbxts/t';

const PREFIX = '[run-in-roblox-studio]';
const DEFAULT_POLL_INTERVAL = 5;
const DEFAULT_PORT = 34567;

const debugConfig = script.Parent?.FindFirstChild('Debug');
const isDebug = debugConfig?.IsA('BoolValue') ? debugConfig.Value : false;

if (isDebug) {
	print(PREFIX, 'Started with debug mode enabled');
}

function createModuleScript(source: string) {
	const module = new Instance('ModuleScript');

	// Wrap in a function and return it to prevent the following error:
	// "Module code did not return exactly one value "
	module.Source = `return function () ${source} end`;

	return module;
}

function startTask(serverUrl: string) {
	const response = HttpService.RequestAsync({
		Method: 'POST',
		Url: `${serverUrl}/start`,
	});

	if (!response.Success) {
		throw 'Failed to start';
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
		throw 'Module did not return a function';
	}
}

function endTask(serverUrl: string) {
	const response = HttpService.RequestAsync({
		Method: 'POST',
		Url: `${serverUrl}/end`,
	});

	if (!response.Success) {
		throw 'Failed to end';
	}
}

function poll(serverUrl: string) {
	const response = HttpService.RequestAsync({
		Method: 'GET',
		Url: `${serverUrl}/poll`,
	});

	if (!response.Success) {
		throw 'Failed to poll';
	}
}

let isFirstRun = true;
let isRunning = false;

// eslint-disable-next-line no-constant-condition
while (true) {
	if (!isFirstRun) {
		task.wait(DEFAULT_POLL_INTERVAL);
	}
	isFirstRun = false;

	if (isRunning) {
		continue;
	}

	// TODO: Allow custom port to be set in the plugin setting
	const serverUrl = `http://127.0.0.1:${DEFAULT_PORT}`;

	try {
		poll(serverUrl);
	} catch (err) {
		if (isDebug) {
			warn(PREFIX, err);
		}
		continue;
	}

	isRunning = true;
	try {
		startTask(serverUrl);
	} catch (err) {
		if (isDebug) {
			warn(PREFIX, err);
		}
		isRunning = false;
		continue;
	}
}
