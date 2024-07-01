import { server } from './server.js';

export async function startServer(port: number): Promise<void> {
	try {
		await server.listen({ port: port });
	} catch (err) {
		server.log.error(err);
	}
}
