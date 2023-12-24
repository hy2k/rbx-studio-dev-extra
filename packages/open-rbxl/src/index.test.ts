import type { IFs } from 'memfs';

import { Volume, createFsFromVolume } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RbxlOptions } from './index.js';

const options: Readonly<RbxlOptions> = {
	// Uses fake, platform-agnostic check function in tests.
	handleCheck: () => true,

	// Prevents Roblox Studio from opening in tests.
	handleSpawn: async () => {},
};

vi.spyOn(console, 'log');

let vol: InstanceType<typeof Volume>;
let fs: IFs['promises'];

beforeEach(() => {
	vi.resetAllMocks();

	vol = Volume.fromNestedJSON({
		folder: {},
		'not-place.rbxm': '',
		'place.rbxl': '',
		'place.rbxlx': '',
	});

	fs = createFsFromVolume(vol).promises;
	vi.mock('node:fs/promises', () => fs);
});

const testPlaceFile = 'place.rbxl';

describe('spawn', () => {
	it('should call spawn function when force is true', async () => {
		const fn = vi.fn(async () => {});

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { ...options, force: true, handleSpawn: fn });

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(testPlaceFile);
	});
});

describe('error', () => {
	it('should throw when place file does not exist', async () => {
		const { OpenRbxlError, openRbxl } = await import('./index.js');

		const fn = openRbxl('does-not-exist.rbxl', options);

		await expect(fn).rejects.toThrow(OpenRbxlError);
		await expect(fn).rejects.toThrow('Invalid place path');
	});

	it("should throw when place file isn't a file", async () => {
		const { OpenRbxlError, openRbxl } = await import('./index.js');

		const fn = openRbxl('folder', options);

		await expect(fn).rejects.toThrow(OpenRbxlError);
		await expect(fn).rejects.toThrow('Not a file');
	});

	it("should throw when place file isn't a .rbxl or .rbxlx file", async () => {
		const { OpenRbxlError, openRbxl } = await import('./index.js');

		const fn = openRbxl('not-place.rbxm', options);

		await expect(fn).rejects.toThrow(OpenRbxlError);
		await expect(fn).rejects.toThrow('Must be a .rbxl or .rbxlx file');
	});

	it('should not throw when place file is rbxlx', async () => {
		const { openRbxl } = await import('./index.js');

		const fn = openRbxl('place.rbxlx', options);

		await expect(fn).resolves.toBeUndefined();
	});
});

describe('check', () => {
	it('should call check function when force is false', async () => {
		const fn = vi.fn(() => true);

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { ...options, force: false, handleCheck: fn });

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(testPlaceFile);
	});

	it('should not call check function when force is true', async () => {
		const fn = vi.fn(() => true);

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { ...options, force: true, handleCheck: fn });

		expect(fn).not.toHaveBeenCalled();
	});
});

describe('log', () => {
	it('should log before calling spawn function', async () => {
		const fn = vi.fn(async () => {});

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { ...options, force: true, handleSpawn: fn });

		expect(console.log).toHaveBeenCalledWith('[open-rbxl] Opening Roblox Studio...');
	});

	it('should log when check function is called and returns true', async () => {
		const fn = vi.fn(() => true);

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { ...options, force: false, handleCheck: fn });

		expect(console.log).toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});

	it("should not log when check function is called and doesn't return true", async () => {
		const fn = vi.fn(() => false);

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { ...options, force: false, handleCheck: fn });

		expect(console.log).not.toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});
});

describe('log parameter', () => {
	it('should call the log function passed as a parameter', async () => {
		const logFn = vi.fn();
		const checkFn = vi.fn(() => false);
		const spawnFn = vi.fn(async () => {});

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { force: false, handleCheck: checkFn, handleSpawn: spawnFn, log: logFn });

		expect(logFn).toHaveBeenCalledWith('[open-rbxl] Opening Roblox Studio...');
	});

	it('should call the log function when checkFn returns true', async () => {
		const logFn = vi.fn();
		const checkFn = vi.fn(() => true);
		const spawnFn = vi.fn(async () => {});

		const { openRbxl } = await import('./index.js');

		await openRbxl(testPlaceFile, { force: false, handleCheck: checkFn, handleSpawn: spawnFn, log: logFn });

		expect(logFn).toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});
});
