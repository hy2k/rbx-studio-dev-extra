import { HttpService } from '@rbxts/services';
import { setInterval } from '@rbxts/set-timeout';

import { debuglog, debugwarn } from './debug';
import { findAssets } from './find-assets';

const DEFAULT_POLL_INTERVAL = 5;

// TODO: port is not configurable for now
const port = 34568;
const serverUrl = `http://127.0.0.1`;

function getURL(route: string) {
	return `${serverUrl}:${port}/${route}`;
}

function poll() {
	const response = HttpService.RequestAsync({
		Method: 'GET',
		Url: getURL('poll'),
	});

	if (!response.Success) {
		throw 'Failed to poll';
	}
}

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

		promise.finally(() => {
			skipPolling = false;
			debuglog('Completed. Restarting.');
		});
	} catch (err) {
		debugwarn(err);
		return;
	}
}, DEFAULT_POLL_INTERVAL);
