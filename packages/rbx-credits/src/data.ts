import ky, { HTTPError, TimeoutError } from 'ky';
import * as fs from 'node:fs/promises';
import { ZodError } from 'zod';

import { getAssetIdsFromData } from './asset-id-parser.js';
import { AssetStore } from './asset-store.js';
import { Cache, getCachedDataPath } from './cache.js';
import { logger } from './logger.js';
import { DeveloperProductInfo } from './schema.js';

function endpoint(assetId: number): string {
	return `https://economy.roblox.com/v2/developer-products/${assetId}/info`;
}

class FetchAssetInfoError extends Error {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'FetchError';
	}
}

async function fetchAssetInfo(assetId: number): Promise<DeveloperProductInfo> {
	try {
		logger.info(`Fetching asset info for ${assetId}`);
		const response = await ky.get(endpoint(assetId)).json();

		const result = DeveloperProductInfo.parse(response);

		return result;
	} catch (err) {
		if (err instanceof HTTPError) {
			throw new FetchAssetInfoError(`Failed to fetch product info for ${assetId}`, {
				cause: err,
			});
		}

		if (err instanceof TimeoutError) {
			throw new FetchAssetInfoError(`Timed out fetching product info for ${assetId}`, {
				cause: err,
			});
		}

		if (err instanceof ZodError) {
			throw new FetchAssetInfoError(`Failed to parse product info for ${assetId}`, {
				cause: err,
			});
		}

		throw err;
	}
}

async function createAssetStore(data: object, cache: Cache): Promise<AssetStore> {
	const assetStore = new AssetStore();

	for (const [property, assetIds] of getAssetIdsFromData(data)) {
		for (const assetId of assetIds) {
			let asset = cache.findById(assetId);

			if (!asset) {
				asset = await fetchAssetInfo(assetId);
				cache.push(asset);
			}

			assetStore.add(property, asset);
		}
	}

	return assetStore;
}

export async function emitAssetCredits(data: object): Promise<void> {
	let exitCode = 0;

	const cachePath = await getCachedDataPath();
	const cache = await new Cache(cachePath).init();

	try {
		const assetStore = await createAssetStore(data, cache);

		logger.info('Emitting asset credits');

		await fs.writeFile('asset-credits.txt', assetStore.formatData());
	} catch (err) {
		if (err instanceof FetchAssetInfoError) {
			logger.error(err.message);

			if (err.cause instanceof Error) {
				delete err.cause.stack;
				logger.error(err.cause);
			}
		} else {
			logger.fatal(err);
		}
		exitCode = 1;
	}

	await cache.writeFile();
	process.exit(exitCode);
}
