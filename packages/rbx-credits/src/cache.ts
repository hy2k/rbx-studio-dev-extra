import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { isNativeError } from 'node:util/types';
import { ZodError } from 'zod';

import { logger } from './logger.js';
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

export class Cache {
	#cachePath: string;

	#data: DeveloperProductInfo[] = [];

	constructor(private cachePath: string) {
		this.#cachePath = cachePath;
	}

	findById(assetId: number) {
		return this.#data.find((data) => data.AssetId === assetId);
	}

	async init(): Promise<Cache> {
		try {
			const content = await fs.readFile(this.#cachePath, 'utf-8');
			this.#data = DeveloperProductInfo.array().parse(JSON.parse(content));
		} catch (err) {
			// instanceof check fails in jest environment
			// See https://github.com/jestjs/jest/issues/2549
			if (isNativeError(err)) {
				if ('code' in err && err.code === 'ENOENT') {
					// This is not an error. It is expected for the first time.
					logger.info('No cached data found');
					return this;
				}

				if (err instanceof SyntaxError) {
					logger.error('Cached data is corrupted.');
				} else if (err instanceof ZodError) {
					logger.error('Schema validation failed for cached data.');
				}

				delete err.stack;
				logger.error(err);
			} else {
				logger.fatal('Unknown error when reading cached data.');
				logger.fatal(err);
			}

			process.exit(1);
		}

		return this;
	}

	push(data: DeveloperProductInfo) {
		// Prevents duplicate data
		if (this.findById(data.AssetId)) {
			return;
		}

		this.#data.push(data);
	}

	async writeFile(writer = fs.writeFile) {
		await writer(this.#cachePath, JSON.stringify(this.#data), 'utf-8');
		logger.info(`Completed writing ${this.#data.length} cached data`);
	}

	get data() {
		return this.#data;
	}
}
