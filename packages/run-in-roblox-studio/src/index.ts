import * as fs from 'fs/promises';
import { open } from 'open-rbxl';

import { IS_DEV } from './constants.js';
import { server } from './server.js';
import { store } from './store.js';

interface StartOptions {
	placePath: string;
	port: number;
	scriptPath: string;
}

export async function start({ placePath, port, scriptPath }: StartOptions) {
	try {
		await server.listen({ port: port });
	} catch (err) {
		if (IS_DEV) {
			server.log.error(err);
		}
	}

	open(placePath, {});

	const luaSource = await fs.readFile(scriptPath, 'utf8');
	store.luaSource = luaSource;
}
