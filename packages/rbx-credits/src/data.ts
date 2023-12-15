import ky from 'ky';
import * as fs from 'node:fs/promises';
import { z } from 'zod';

import { getCachedData, getCachedDataPath } from './cache.js';
import { logger } from './logger.js';
import { DeveloperProductInfo } from './schema.js';

const endpoint = (assetId: number) => `https://economy.roblox.com/v2/developer-products/${assetId}/info`;

async function fetchProductInfo(assetId: number) {
	const response = await ky.get(endpoint(assetId)).json();

	const result = DeveloperProductInfo.parse(response);

	return result;
}

function parseStringAssetId(value: string) {
	if (typeof value === 'number') {
		return value;
	}

	// TODO: Fix this naive number parsing
	const match = value.match('%d+');

	if (!match) {
		return;
	}

	return parseInt(match[0]);
}

const RawAssetValue = z.union([z.number(), z.string().transform(parseStringAssetId)]);
type RawAssetValue = z.infer<typeof RawAssetValue>;

const cachedData: DeveloperProductInfo[] = await getCachedData();

export async function parseData(data: object) {
	const assetEntries = Object.entries(data);
	logger.info(`Parsing ${assetEntries.length} assets`);
	logger.debug('Parsing data', data);

	const assetData: DeveloperProductInfo[] = [];

	for (const [property, assetValues] of assetEntries) {
		const resultAssetIds = RawAssetValue.array().safeParse(assetValues);

		if (!resultAssetIds.success) {
			logger.warn(`Property ${property} contains invalid asset IDs`, assetValues);
			continue;
		}

		for (const rawAssetValue of resultAssetIds.data) {
			if (!rawAssetValue || isNaN(rawAssetValue)) {
				console.warn(`Property ${property} contains invalid asset ID`, rawAssetValue);
				continue;
			}

			const cacheFound = cachedData.find((cached) => cached.TargetId === rawAssetValue);
			if (cacheFound) {
				assetData.push(cacheFound);
				continue;
			}

			const fetched = await fetchProductInfo(rawAssetValue);
			assetData.push(fetched);
			cachedData.push(fetched);
		}
	}

	console.log(JSON.stringify(assetData, null, 4));
}

process.on('exit', async () => {
	const cachedDataPath = await getCachedDataPath();

	await fs.writeFile(cachedDataPath, JSON.stringify(cachedData));
});
