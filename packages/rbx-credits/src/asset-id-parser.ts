import { z } from 'zod';

import { logger } from './logger.js';

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

export function getAssetIdsFromData(data: object) {
	// Just checking object has shape of record. Here I don't want to use z.record(..) because I
	// want to parse each property independently.
	const resultRecord = z.object({}).safeParse(data);
	if (!resultRecord.success) {
		throw new Error(`Got invalid data`, {
			cause: resultRecord.error,
		});
	}

	const assetIdsByProperty = new Map<string, Set<number>>();

	for (const [rbxProperty, assetValues] of Object.entries(data)) {
		const assetIds = new Set<number>();

		const resultAssetIds = RawAssetValue.array().safeParse(assetValues);

		if (!resultAssetIds.success) {
			logger.warn(`Failed to parse asset IDs for property: ${rbxProperty}`);
			continue;
		}

		for (const rawAssetValue of resultAssetIds.data) {
			if (!rawAssetValue || isNaN(rawAssetValue)) {
				continue;
			}

			assetIds.add(rawAssetValue);
		}

		logger.info(`Found ${assetIds.size} unique asset IDs for property: ${rbxProperty}`);
		assetIdsByProperty.set(rbxProperty, assetIds);
	}

	return assetIdsByProperty;
}
