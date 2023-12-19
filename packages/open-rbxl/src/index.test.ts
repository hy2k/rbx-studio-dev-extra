import type { IFs } from 'memfs';

import { Volume, createFsFromVolume } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RbxlOptions } from './index.js';

const options: Readonly<RbxlOptions> = {
	// Prevents Roblox Studio from opening in tests.
	_spawnFn: async () => {},

	// Uses fake, platform-agnostic check function in tests.
	checkFn: () => true,
};

vi.spyOn(console, 'log');

let vol: InstanceType<typeof Volume>;
let fs: IFs['promises'];

beforeEach(() => {
	vi.resetAllMocks();

	vol = Volume.fromNestedJSON({
		'test-places': {
			'place.rbxl': '',
		},
	});

	fs = createFsFromVolume(vol).promises;
	vi.mock('node:fs/promises', () => fs);
});

const testPlaceFile = './test-places/place.rbxl';

describe('spawn', () => {
	it('should call spawn function when force is true', async () => {
		const fn = vi.fn(async () => {});

		const { open } = await import('./index.js');

		await open(testPlaceFile, { ...options, _spawnFn: fn, force: true });

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(testPlaceFile);
	});
});

describe('error', () => {
	it('should throw when place file does not exist', async () => {
		const { OpenRbxlError, open } = await import('./index.js');

		const fn = open('./test-places/does-not-exist.rbxl', options);

		await expect(fn).rejects.toThrow(OpenRbxlError);
		await expect(fn).rejects.toThrow('Invalid place path');
	});

	it("should throw when place file isn't a file", async () => {
		const { OpenRbxlError, open } = await import('./index.js');

		const fn = open('./test-places', options);

		await expect(fn).rejects.toThrow(OpenRbxlError);
		await expect(fn).rejects.toThrow('Not a file');
	});
});

describe('check', () => {
	it('should call check function when force is false', async () => {
		const fn = vi.fn(() => true);

		const { open } = await import('./index.js');

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(testPlaceFile);
	});

	it('should not call check function when force is true', async () => {
		const fn = vi.fn(() => true);

		const { open } = await import('./index.js');

		await open(testPlaceFile, { ...options, checkFn: fn, force: true });

		expect(fn).not.toHaveBeenCalled();
	});
});

describe('log', () => {
	it('should log before calling spawn function', async () => {
		const fn = vi.fn(async () => {});

		const { open } = await import('./index.js');

		await open(testPlaceFile, { ...options, _spawnFn: fn, force: true });

		expect(console.log).toHaveBeenCalledWith('[open-rbxl] Opening Roblox Studio...');
	});

	it('should log when check function is called and returns true', async () => {
		const fn = vi.fn(() => true);

		const { open } = await import('./index.js');

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(console.log).toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});

	it("should not log when check function is called and doesn't return true", async () => {
		const fn = vi.fn(() => false);

		const { open } = await import('./index.js');

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(console.log).not.toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});
});

describe('log parameter', () => {
	it('should call the log function passed as a parameter', async () => {
		const logFn = vi.fn();
		const checkFn = vi.fn(() => false);
		const spawnFn = vi.fn(async () => {});

		const { open } = await import('./index.js');

		await open(testPlaceFile, { _spawnFn: spawnFn, checkFn: checkFn, force: false, log: logFn });

		expect(logFn).toHaveBeenCalledWith('[open-rbxl] Opening Roblox Studio...');
	});

	it('should call the log function when checkFn returns true', async () => {
		const logFn = vi.fn();
		const checkFn = vi.fn(() => true);
		const spawnFn = vi.fn(async () => {});

		const { open } = await import('./index.js');

		await open(testPlaceFile, { _spawnFn: spawnFn, checkFn: checkFn, force: false, log: logFn });

		expect(logFn).toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});
});
