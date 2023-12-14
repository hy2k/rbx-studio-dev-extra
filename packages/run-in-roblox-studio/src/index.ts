import * as fs from 'fs/promises';
import { open } from 'open-rbxl';

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
		server.log.error(err);
	}

	open(placePath, {});

	const luaSource = await fs.readFile(scriptPath, 'utf8');
	store.luaSource = luaSource;
}
