import type { IFs } from 'memfs';
import type { Mock } from 'vitest';

import { Volume, createFsFromVolume } from 'memfs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
vi.spyOn(process, 'exit').mockImplementation((_code?: number) => undefined as never);

let vol: InstanceType<typeof Volume>;
let fs: IFs['promises'];

beforeEach(() => {
	vi.clearAllMocks();
	vol = Volume.fromNestedJSON({
		'test-cache': {
			'bad-schema.json': JSON.stringify([{}]),
			'corrupted.json': '{ ',
			'valid-schema.json': JSON.stringify([asset]),
		},
	});
	fs = createFsFromVolume(vol).promises;
	vi.mock('node:fs/promises', () => fs);
});

describe('init', () => {
	it('should not fail when cache file does not exist', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();

		expect(cache.data).toStrictEqual([]);
	});

	it('should fail when cache file is corrupted', async () => {
		const { Cache } = await import('./cache.js');

		await new Cache('test-cache/corrupted.json').init();

		expect(logger.error).toHaveBeenCalledWith('Cached data is corrupted.');
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it('should fail when schema validation fails for cached data', async () => {
		const { Cache } = await import('./cache.js');

		await new Cache('test-cache/bad-schema.json').init();

		expect(logger.error).toHaveBeenCalledWith('Schema validation failed for cached data.');
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it('should not fail when schema validation passes for cached data', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/valid-schema.json').init();

		expect(cache.data).toStrictEqual([asset]);
	});
});

describe('findById', () => {
	it('should find data by id when findById is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		cache.push(asset);

		const result = cache.findById(asset.AssetId);

		expect(result).toStrictEqual(asset);
	});
});

describe('writeFile', () => {
	let writer: Mock;

	beforeEach(() => {
		writer = vi.fn();
	});

	afterEach(() => {
		writer.mockRestore();
	});

	it('should write data to file and log info when writeFile is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		cache.push(asset);

		await cache.writeFile(writer);

		expect(writer).toHaveBeenCalledWith('test-cache/data.json', JSON.stringify(cache.data), 'utf-8');
		expect(logger.info).toHaveBeenCalledWith(`Completed writing ${cache.data.length} cached data`);
	});
});

describe('push', () => {
	it('should add data when push is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		const initialLength = cache.data.length;

		cache.push(asset);

		expect(cache.data.length).toBe(initialLength + 1);
		expect(cache.data).toStrictEqual([asset]);
	});

	it('should not add duplicate data when push is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		const initialLength = cache.data.length;

		cache.push(asset);
		cache.push(asset);

		expect(cache.data.length).toBe(initialLength + 1);
		expect(cache.data).toStrictEqual([asset]);
	});
});
