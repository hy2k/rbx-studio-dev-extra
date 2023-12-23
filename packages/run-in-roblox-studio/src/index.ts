import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import { logger } from './logger.js';
import { copyPlugin } from './plugin.js';
import { getServer } from './server.js';
import { store } from './store.js';

interface StartOptions {
	placePath: string;
	port: number;
	scriptPath: string;
}

let cleanupPlugin = () => {};

const server = getServer({
	logger: logger,
});

export async function start({ placePath, port, scriptPath }: StartOptions) {
	const luaSource = await readFile(scriptPath, 'utf8');
	store.luaSource = luaSource;
	store.placeName = basename(placePath);

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
