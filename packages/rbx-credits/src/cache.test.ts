import type { IFs } from 'memfs';

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Volume, createFsFromVolume } from 'memfs';

import type { DeveloperProductInfo } from './schema.js';

import { logger } from './logger.js';

const info: Readonly<DeveloperProductInfo> = {
	Created: 'test',
	Creator: {
		Id: 1,
		Name: 'test',
	},
	Description: 'test',
	Name: 'test',
	TargetId: 1,
	Updated: 'test',
};

jest.spyOn(logger, 'error').mockImplementation(() => {});
jest.spyOn(logger, 'info').mockImplementation(() => {});
jest.spyOn(process, 'exit').mockImplementation((_code?: number) => undefined as never);

afterEach(() => {
	jest.clearAllMocks();
});

describe('init', () => {
	let vol: InstanceType<typeof Volume>;
	let fs: IFs['promises'];

	beforeEach(() => {
		vol = Volume.fromNestedJSON({
			'test-cache': {
				'bad-schema.json': JSON.stringify([{}]),
				'corrupted.json': '{ ',
				'valid-schema': JSON.stringify([info]),
			},
		});
		fs = createFsFromVolume(vol).promises;
		jest.unstable_mockModule('node:fs/promises', () => fs);
	});

	it('should not fail when cache file does not exist', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();

		expect(cache.data).toStrictEqual([]);
	});

	it('should fail when cache file is corrupted', async () => {
		vol.writeFileSync('corrupted.json', '{ ');

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

		const cache = await new Cache('test-cache/valid-schema').init();

		expect(cache.data).toStrictEqual([info]);
	});
});

describe('findById', () => {
	let vol: InstanceType<typeof Volume>;
	let fs: IFs['promises'];

	beforeEach(() => {
		vol = new Volume();
		fs = createFsFromVolume(vol).promises;
		jest.unstable_mockModule('node:fs/promises', () => fs);
	});

	it('should find data by id when findById is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		cache.push(info);

		const result = cache.findById(info.TargetId);

		expect(result).toStrictEqual(info);
	});
});

describe('writeFile', () => {
	let vol: InstanceType<typeof Volume>;
	let fs: IFs['promises'];
	let writer: jest.Mock;

	beforeEach(() => {
		vol = new Volume();
		fs = createFsFromVolume(vol).promises;
		writer = jest.fn();
		jest.unstable_mockModule('node:fs/promises', () => fs);
	});

	afterEach(() => {
		vol.reset();
		writer.mockRestore();
	});

	it('should write data to file and log info when writeFile is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		cache.push(info);

		// @ts-expect-error - mock
		await cache.writeFile(writer);

		expect(writer).toHaveBeenCalledWith('test-cache/data.json', JSON.stringify(cache.data));
		expect(logger.info).toHaveBeenCalledWith(`Completed writing ${cache.data.length} cached data`);
	});
});

describe('push', () => {
	let vol: InstanceType<typeof Volume>;
	let fs: IFs['promises'];

	beforeEach(() => {
		vol = new Volume();
		fs = createFsFromVolume(vol).promises;
		jest.unstable_mockModule('node:fs/promises', () => fs);
	});

	afterEach(() => {
		vol.reset();
	});

	it('should add data when push is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		const initialLength = cache.data.length;

		cache.push(info);

		expect(cache.data.length).toBe(initialLength + 1);
		expect(cache.data).toStrictEqual([info]);
	});

	it('should not add duplicate data when push is called', async () => {
		const { Cache } = await import('./cache.js');

		const cache = await new Cache('test-cache/data.json').init();
		const initialLength = cache.data.length;

		cache.push(info);
		cache.push(info);

		expect(cache.data.length).toBe(initialLength + 1);
		expect(cache.data).toStrictEqual([info]);
	});
});
