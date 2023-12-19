import { HttpService, RunService } from '@rbxts/services';
import { setInterval } from '@rbxts/set-timeout';

import { config } from './config';
import { debuglog, debugwarn } from './debug';
import { findAssets } from './find-assets';

const SERVER_URL = `http://127.0.0.1:${config.port}`;

const getURL = (route: string) => `${SERVER_URL}/${route}`;

function poll() {
	const response = HttpService.RequestAsync({
		Method: 'GET',
		Url: getURL('poll'),
	});

	if (!response.Success) {
		throw 'Failed to poll';
	}
}

function main() {
	debuglog('Started with debug mode enabled');

	let skipPolling = false;
	setInterval(() => {
		if (skipPolling) {
			return;
		}

		try {
			poll();

			skipPolling = true;

			const promise = new Promise((resolve, reject) => {
				const assets = findAssets();

				const response = HttpService.RequestAsync({
					Body: HttpService.JSONEncode(assets),
					Headers: {
						['Content-Type']: 'application/json',
					},
					Method: 'POST',
					Url: getURL('submit'),
				});

				if (!response.Success) {
					reject('Failed to submit');
				}

				resolve('Ok');
			});

			// Wait for CLI to remove the plugin
			promise
				.catch((err) => {
					error(err);
				})
				.finally(() => {
					debuglog('Completed.');
				});
		} catch (err) {
			debugwarn(err);
			return;
		}
	}, config.pollInterval);
}

if (RunService.IsStudio() && RunService.IsEdit()) {
	main();
}
