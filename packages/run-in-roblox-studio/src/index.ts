import { open } from 'open-rbxl';

import { server } from './server.js';

interface StartOptions {
	port: number;
	placePath: string;
}

export async function start({ placePath, port }: StartOptions) {
	try {
		await server.listen({ port: port });
	} catch (err) {
		server.log.error(err);
	}

	open(placePath, {});

	console.log("It's running!");
}
