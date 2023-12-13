import { HttpService } from '@rbxts/services';

const POLL_INTERVAL = 10;

const SERVER_URL = 'http://127.0.0.1:3000';

// eslint-disable-next-line no-constant-condition
while (true) {
	task.wait(POLL_INTERVAL);

	print('Waiting');

	try {
		HttpService.RequestAsync({
			Url: `${SERVER_URL}/poll`,
		});
	} catch (err) {
		warn(err);
	}
}
