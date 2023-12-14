import { server } from './server.js';

interface StartOptions {
	port: number;
}

export async function start({ port }: StartOptions) {
	try {
		await server.listen({ port: port });
	} catch (err) {
		server.log.error(err);
	}
}
