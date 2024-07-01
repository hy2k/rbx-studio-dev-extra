import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DeveloperProductInfo } from './schema.js';

import { logger } from './logger.js';

const asset: Readonly<DeveloperProductInfo> = {
	AssetId: 1,
	Created: 'test',
	Creator: {
		Id: 1,
		Name: 'test',
	},
	Name: 'test',
	Updated: 'test',
};

vi.spyOn(logger, 'error').mockImplementation(() => {});
vi.spyOn(logger, 'info').mockImplementation(() => {});
vi.spyOn(process, 'exit');

const fs = await vi.hoisted(async () => {
	const { Volume, createFsFromVolume } = await import('memfs');

	// IDK why but, without this, writing to volume fails
	const vol = Volume.fromNestedJSON({
		'': {},
	});

	return createFsFromVolume(vol).promises;
});

vi.mock('node:fs/promises', () => fs);

beforeEach(() => {
	vi.resetAllMocks();
});

describe('init', () => {
	it('should not fail when cache file does not exist', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('data.json').init();

		expect(cache.data).toStrictEqual([]);
	});

	it('should fail when cache file is corrupted', async () => {
		await fs.writeFile('corrupted.json', '{');

		const { Cache } = await import('./cache.js');

		await new Cache('corrupted.json').init();

		expect(logger.error).toHaveBeenCalledWith('Cached data is corrupted.');
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it('should fail when schema validation fails for cached data', async () => {
		await fs.writeFile('bad-schema.json', JSON.stringify([{}]));

		const { Cache } = await import('./cache.js');

		await new Cache('bad-schema.json').init();

		expect(logger.error).toHaveBeenCalledWith('Schema validation failed for cached data.');
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it('should not fail when schema validation passes for cached data', async () => {
		await fs.writeFile('valid-schema.json', JSON.stringify([asset]));

		const { Cache } = await import('./cache.js');
		const cache = await new Cache('valid-schema.json').init();

		expect(cache.data).toStrictEqual([asset]);
	});
});

describe('findById', () => {
	it('should find data by id when findById is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('data.json').init();
		cache.push(asset);

		const result = cache.findById(asset.AssetId);

		expect(result).toStrictEqual(asset);
	});
});

describe('writeFile', () => {
	it('should write data to file and log info when writeFile is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('data.json').init();
		cache.push(asset);

		const writer = vi.fn();

		await cache.writeFile(writer);

		expect(writer).toHaveBeenCalledWith('data.json', JSON.stringify(cache.data), 'utf-8');
		expect(logger.info).toHaveBeenCalledWith(`Completed writing ${cache.data.length} cached data`);
	});
});

describe('push', () => {
	it('should add data when push is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('data.json').init();
		const initialLength = cache.data.length;

		cache.push(asset);

		expect(cache.data.length).toBe(initialLength + 1);
		expect(cache.data).toStrictEqual([asset]);
	});

	it('should not add duplicate data when push is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('data.json').init();
		const initialLength = cache.data.length;

		cache.push(asset);
		cache.push(asset);

		expect(cache.data.length).toBe(initialLength + 1);
		expect(cache.data).toStrictEqual([asset]);
	});
});
