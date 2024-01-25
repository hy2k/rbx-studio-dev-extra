import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import { logger } from './logger.js';
import { copyPlugin } from './plugin.js';
import { getServer } from './server.js';
import { store } from './store.js';

interface StartOptions {
	placeName?: string;
	placePath: string;
	port: number;
	scriptPath: string;
}

let cleanupPlugin = () => {};

const server = getServer({
	logger: logger,
});

export async function start({ placeName, placePath, port, scriptPath }: StartOptions) {
	const luaSource = await readFile(scriptPath, 'utf8');
	store.luaSource = luaSource;
	store.placeName = placeName ?? basename(placePath);

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

	void server.close();

	process.exit();
});

process.on('exit', () => {
	cleanupPlugin();
});
