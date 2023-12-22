import { readFile } from 'node:fs/promises';

import { logger } from './logger.js';
import { copyPlugin } from './plugin.js';
import { server } from './server.js';
import { store } from './store.js';

interface StartOptions {
	port: number;
	scriptPath: string;
}

let cleanupPlugin = () => {};

export async function start({ port, scriptPath }: StartOptions) {
	const luaSource = await readFile(scriptPath, 'utf8');
	store.luaSource = luaSource;

	copyPlugin()
		.then((cleanup) => {
			cleanupPlugin = cleanup;
		})
		.catch((err) => {
			logger.fatal(err);
		});

	try {
		await server.listen({ port: port });
	} catch (err) {
		server.log.error(err);
	}
}

process.on('SIGINT', () => {
	logger.info('SIGINT received, closing server');

	cleanupPlugin();

	void server.close();

	process.exit(0);
});
