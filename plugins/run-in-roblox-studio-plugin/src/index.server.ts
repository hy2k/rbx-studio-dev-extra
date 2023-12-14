import { HttpService } from '@rbxts/services';

const POLL_INTERVAL = 10;

const DEFAULT_PORT = 34567;

let isRunning = false;

// eslint-disable-next-line no-constant-condition
while (true) {
	task.wait(POLL_INTERVAL);

	if (isRunning) {
		continue;
	}

	// TODO: Allow custom port to be set in the plugin setting
	const serverUrl = `http://127.0.0.1:${DEFAULT_PORT}`;

	print('Waiting');

	try {
		const response = HttpService.RequestAsync({
			Url: `${serverUrl}/poll`,
		});

		if (!response.Success) {
			continue;
		}
	} catch {
		continue;
	}

	isRunning = true;
	print("It's running!")
}
