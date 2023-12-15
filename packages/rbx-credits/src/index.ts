import { open } from 'open-rbxl';

import { server } from './server.js';

interface StartOptions {
	placePath: string;
	port: number;
}

export async function start({ placePath, port }: StartOptions) {
	try {
		await server.listen({ port: port });
	} catch (err) {
		server.log.error(err);
	}

	open(placePath, {});
}
