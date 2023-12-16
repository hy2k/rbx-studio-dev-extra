import ky from 'ky';
import * as fs from 'node:fs/promises';
import { z } from 'zod';

import { getCachedData, getCachedDataPath } from './cache.js';
import { logger } from './logger.js';
import { DeveloperProductInfo } from './schema.js';

const endpoint = (assetId: number) => `https://economy.roblox.com/v2/developer-products/${assetId}/info`;

async function fetchProductInfo(assetId: number) {
	logger.info(`Fetching product info for ${assetId}`);
	const response = await ky.get(endpoint(assetId)).json();

	const result = DeveloperProductInfo.parse(response);

	return result;
}

function parseStringAssetId(value: string) {
	if (typeof value === 'number') {
		return value;
	}

	// TODO: Fix this naive number parsing
	const match = value.match(/\d+/);

	if (!match) {
		logger.warn(`Failed to parse asset ID: ${value}`);
		return;
	}

	return parseInt(match[0]);
}

const RawAssetValue = z.union([z.number(), z.string().transform(parseStringAssetId)]);
type RawAssetValue = z.infer<typeof RawAssetValue>;

const cachedData: DeveloperProductInfo[] = await getCachedData();

async function parseData(data: object) {
	const assetEntries = Object.entries(data);
	logger.info(`Parsing ${assetEntries.length} assets`);
	logger.debug(data);

	const assets: DeveloperProductInfo[] = [];

	for (const [property, assetValues] of assetEntries) {
		const resultAssetIds = RawAssetValue.array().safeParse(assetValues);

		if (!resultAssetIds.success) {
			logger.warn(`Failed to parse asset IDs for property ${property}`);
			continue;
		}

		for (const rawAssetValue of resultAssetIds.data) {
			if (!rawAssetValue || isNaN(rawAssetValue)) {
				continue;
			}

			const cacheFound = cachedData.find((cached) => cached.TargetId === rawAssetValue);
			if (cacheFound) {
				logger.info(`Found data for ${rawAssetValue} from cache`);
				assets.push(cacheFound);
				continue;
			}

			const fetched = await fetchProductInfo(rawAssetValue);
			assets.push(fetched);
			cachedData.push(fetched);
		}
	}

	return assets;
}

async function writeCachedData() {
	const cachedDataPath = await getCachedDataPath();

	await fs.writeFile(cachedDataPath, JSON.stringify(cachedData));
	logger.info(`Completed writing ${cachedData.length} cached data`);
}

export async function emitAssetCredits(data: object) {
	try {
		const assets = await parseData(data);
	} finally {
		await writeCachedData();

		process.exit(0);
	}
}
