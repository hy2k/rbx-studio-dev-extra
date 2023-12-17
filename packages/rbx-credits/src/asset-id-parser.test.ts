import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { getAssetIdsFromData } from './asset-id-parser.js';
import { logger } from './logger.js';

afterEach(() => {
	jest.clearAllMocks();
});

jest.spyOn(logger, 'warn').mockImplementation(() => {});
jest.spyOn(logger, 'info').mockImplementation(() => {});

describe('getAssetIdsFromData', () => {
	it('should parse asset IDs from data', () => {
		const data = {
			prop1: [1, 2, 3],
			prop2: [4, 5, 6],
		};

		const map = getAssetIdsFromData(data);

		expect(map.size).toBe(2);
		expect(map.get('prop1')).toStrictEqual(new Set([1, 2, 3]));
		expect(map.get('prop2')).toStrictEqual(new Set([4, 5, 6]));

		expect(logger.warn).not.toHaveBeenCalled();
		expect(logger.info).toHaveBeenCalledTimes(2);
		expect(logger.info).toHaveBeenCalledWith('Found 3 unique asset IDs for property: prop1');
		expect(logger.info).toHaveBeenCalledWith('Found 3 unique asset IDs for property: prop2');
	});

	it('should handle case when schema is correct but contains invalid asset id', () => {
		const data = {
			prop1: [1, 2, 'three'],
			prop2: [4, 'five', 6],
		};

		const map = getAssetIdsFromData(data);

		expect(map.size).toBe(2);
		expect(map.get('prop1')).toStrictEqual(new Set([1, 2]));
		expect(map.get('prop2')).toStrictEqual(new Set([4, 6]));

		expect(logger.info).toHaveBeenCalledTimes(2);
		expect(logger.warn).toHaveBeenCalledTimes(2);
		expect(logger.warn).toHaveBeenCalledWith('Failed to parse asset ID: three');
		expect(logger.warn).toHaveBeenCalledWith('Failed to parse asset ID: five');
	});

	it('should handle each property independently even if there is a property with invalid schema', () => {
		const data = {
			prop1: {},
			prop2: [1, 2, 3],
		};

		const map = getAssetIdsFromData(data);

		expect(map.size).toBe(1);
		expect(map.get('prop2')).toStrictEqual(new Set([1, 2, 3]));

		expect(logger.info).toHaveBeenCalledTimes(1);
		expect(logger.warn).toHaveBeenCalledTimes(1);
		expect(logger.warn).toHaveBeenCalledWith('Failed to parse asset IDs for property: prop1');
	});

	it('should consider null to be invalid asset id', () => {
		const data = {
			prop1: [1, 2, null],
			prop2: [4, 5, 6],
		};

		const map = getAssetIdsFromData(data);

		expect(map.size).toBe(1);
		expect(map.get('prop2')).toStrictEqual(new Set([4, 5, 6]));

		expect(logger.info).toHaveBeenCalledTimes(1);
		expect(logger.warn).toHaveBeenCalledTimes(1);
		expect(logger.warn).toHaveBeenCalledWith('Failed to parse asset IDs for property: prop1');
	});

	it('should throw an error when data is not shaped like a record', () => {
		expect(() => getAssetIdsFromData([])).toThrowError('Got invalid data');
	});

	it('should correctly parse string asset ids', () => {
		const data = {
			prop1: ['rbxassetid://1', 'rbxassetid://2', 'rbxassetid://3'],
			prop2: [
				'http://www.roblox.com/asset/?id=4',
				'http://www.roblox.com/asset/?id=5',
				'http://www.roblox.com/asset/?id=6',
			],
		};

		const map = getAssetIdsFromData(data);

		expect(map.size).toBe(2);
		expect(map.get('prop1')).toStrictEqual(new Set([1, 2, 3]));
		expect(map.get('prop2')).toStrictEqual(new Set([4, 5, 6]));

		expect(logger.warn).not.toHaveBeenCalled();
		expect(logger.info).toHaveBeenCalledTimes(2);
		expect(logger.info).toHaveBeenCalledWith('Found 3 unique asset IDs for property: prop1');
		expect(logger.info).toHaveBeenCalledWith('Found 3 unique asset IDs for property: prop2');
	});
});
