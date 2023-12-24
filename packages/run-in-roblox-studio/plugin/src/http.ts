import { HttpService } from '@rbxts/services';
import { t } from '@rbxts/t';

import { config } from './config';

const SERVER_URL = `http://127.0.0.1:${config.port}`;

const post = (route: string, payload: object) => {
	const response = HttpService.RequestAsync({
		Body: HttpService.JSONEncode(payload),
		Headers: {
			['Content-Type']: 'application/json',
		},
		Method: 'POST',
		Url: `${SERVER_URL}/${route}`,
	});

	if (!response.Success) {
		throw response;
	}

	return response;
};

export function requestLuaSource() {
	const response = post('start', {
		placeName: game.Name,
	});

	const body = HttpService.JSONDecode(response.Body);
	const bodyCheck = t.strictInterface({
		source: t.string,
	});
	assert(bodyCheck(body));

	const { source } = body;

	return source;
}

export function requestStop(isError: boolean) {
	post('stop', {
		isError: isError,
	});
}
