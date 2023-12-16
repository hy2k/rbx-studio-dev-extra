import ky, { HTTPError, TimeoutError } from 'ky';
import * as fs from 'node:fs/promises';
import { z } from 'zod';

import { getCachedData, getCachedDataPath } from './cache.js';
import { logger } from './logger.js';
import { DeveloperProductInfo } from './schema.js';

const endpoint = (assetId: number) => `https://economy.roblox.com/v2/developer-products/${assetId}/info`;

class FetchAssetInfoError extends Error {
	constructor(string?: string, options?: ErrorOptions) {
		super(string, options);
		this.name = 'FetchError';
	}
}

async function fetchAssetInfo(assetId: number) {
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

		if (err instanceof z.ZodError) {
			throw new FetchAssetInfoError(`Failed to parse product info for ${assetId}`, {
				cause: err,
			});
		}

		throw err;
	}
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

type AssetData = Map<string, DeveloperProductInfo[]>;

async function parseData(data: object) {
	const assetEntries = Object.entries(data);
	logger.info(`Parsing ${assetEntries.length} assets`);
	logger.debug(data);

	const assetData: AssetData = new Map();

	for (const [property, assetValues] of assetEntries) {
		const assets: DeveloperProductInfo[] = [];

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

			const fetched = await fetchAssetInfo(rawAssetValue);
			assets.push(fetched);
			cachedData.push(fetched);
		}
		assetData.set(property, assets);
	}

	return assetData;
}

async function writeCachedData() {
	const cachedDataPath = await getCachedDataPath();

	await fs.writeFile(cachedDataPath, JSON.stringify(cachedData));
	logger.info(`Completed writing ${cachedData.length} cached data`);
}

function formatAssetData(assetData: AssetData): string {
	let formatted = '';

	for (const [property, assets] of assetData) {
		formatted += `**${property}**\n`;

		for (const asset of assets) {
			formatted += `${asset.Creator.Name}\n`;
		}
	}

	return formatted;
}

export async function emitAssetCredits(data: object) {
	let exitCode = 0;

	try {
		const assetData = await parseData(data);

		const formatted = formatAssetData(assetData);

		logger.info('Emitting asset credits');

		await fs.writeFile('asset-credits.txt', formatted);
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

	await writeCachedData();
	process.exit(exitCode);
}
