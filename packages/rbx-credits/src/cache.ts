import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { DeveloperProductInfo } from './schema.js';

export async function getCachedDataPath() {
	// TODO: Allow custom cache path
	const cacheDir = path.join(os.homedir(), '.cache', 'rbx-credits');

	try {
		await fs.mkdir(cacheDir, { recursive: true });
	} catch {
		// Ignore
	}

	return path.join(cacheDir, 'data.json');
}

export async function getCachedData() {
	const cachedDataPath = await getCachedDataPath();

	let content: string;
	try {
		const data = await fs.readFile(cachedDataPath, 'utf-8');
		content = JSON.parse(data);
	} catch {
		return [];
	}

	return DeveloperProductInfo.array().parse(content);
}
