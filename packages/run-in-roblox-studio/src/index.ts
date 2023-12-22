import * as fs from 'fs/promises';

import { IS_DEV } from './constants.js';
import { server } from './server.js';
import { store } from './store.js';

interface StartOptions {
	port: number;
	scriptPath: string;
}

export async function startServer({ port, scriptPath }: StartOptions) {
	try {
		await server.listen({ port: port });
	} catch (err) {
		if (IS_DEV) {
			server.log.error(err);
		}
	}

	const luaSource = await fs.readFile(scriptPath, 'utf8');
	store.luaSource = luaSource;
}
