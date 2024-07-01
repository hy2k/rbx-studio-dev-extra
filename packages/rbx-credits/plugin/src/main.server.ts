import { HttpService, RunService } from '@rbxts/services';
import { setInterval } from '@rbxts/set-timeout';

import { config } from './config';
import { debuglog, debugwarn } from './debug';
import { findAssets } from './find-assets';

const SERVER_URL = `http://127.0.0.1:${config.port}`;

function getURL(route: string): string {
	return `${SERVER_URL}/${route}`;
}

function poll(): void {
	try {
		const response = HttpService.RequestAsync({
			Method: 'GET',
			Url: getURL('poll'),
		});

		if (!response.Success) {
			error('Failed to poll');
		}
	} catch (err) {
		debugwarn(err);
		return;
	}
}

function main(): void {
	debuglog('Started with debug mode enabled');

	let skipPolling = false;
	setInterval(() => {
		if (skipPolling) {
			return;
		}

		try {
			poll();

			skipPolling = true;

			const promise = Promise.try(() => {
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
					error('Failed to submit');
				}
			});

			// Wait for CLI to remove the plugin
			promise
				.catch((err: unknown) => {
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
