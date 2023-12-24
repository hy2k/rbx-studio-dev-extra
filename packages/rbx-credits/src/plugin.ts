import fs from 'node:fs';
import path from 'node:path';
import { getRobloxStudioPath } from 'roblox-studio-pathutil';

import { logger } from './logger.js';

const fileName = 'rbx-credits.rbxm';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const pluginSrc = path.join(dirname, '..', 'plugin', fileName);

export async function copyPlugin() {
	const robloxStudioPath = await getRobloxStudioPath();

	const dest = path.join(robloxStudioPath.plugins, fileName);

	await fs.promises.copyFile(pluginSrc, dest);
	logger.info(`Copied plugin to ${dest}`);

	process.on('exit', () => {
		if (fs.existsSync(dest)) {
			logger.info(`Cleaning up ${dest}`);
			fs.rmSync(dest);
		}
	});
}
