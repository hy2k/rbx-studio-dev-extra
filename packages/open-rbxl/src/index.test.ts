import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { RbxlOptions } from './index.js';

import { OpenRbxlError, open } from './index.js';

const options: Readonly<RbxlOptions> = {
	// Prevents Roblox Studio from opening in tests.
	_spawnFn: async () => {},

	// Uses fake, platform-agnostic check function in tests.
	checkFn: () => true,
};

const testPlaceFile = './fixtures/place.rbxl';

jest.spyOn(console, 'log');

beforeEach(() => {
	jest.resetAllMocks();
});

describe('spawn', () => {
	it('should call spawn function when force is true', async () => {
		const fn = jest.fn(async () => {});

		await open(testPlaceFile, { ...options, _spawnFn: fn, force: true });

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(testPlaceFile);
	});
});

describe('error', () => {
	it('should throw when place file does not exist', async () => {
		const fn = open('./fixtures/does-not-exist.rbxl', options);

		await expect(fn).rejects.toThrow(OpenRbxlError);
		await expect(fn).rejects.toThrow('Invalid place path');
	});

	it("should throw when place file isn't a file", async () => {
		const fn = open('./fixtures', options);

		await expect(fn).rejects.toThrow(OpenRbxlError);
		await expect(fn).rejects.toThrow('Not a file');
	});
});

describe('check', () => {
	it('should call check function when force is false', async () => {
		const fn = jest.fn(() => true);

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(testPlaceFile);
	});

	it('should not call check function when force is true', async () => {
		const fn = jest.fn(() => true);

		await open(testPlaceFile, { ...options, checkFn: fn, force: true });

		expect(fn).not.toHaveBeenCalled();
	});
});

describe('log', () => {
	it('should log before calling spawn function', async () => {
		const fn = jest.fn(async () => {});

		await open(testPlaceFile, { ...options, _spawnFn: fn, force: true });

		expect(console.log).toHaveBeenCalledWith('[open-rbxl] Opening Roblox Studio...');
	});

	it('should log when check function is called and returns true', async () => {
		const fn = jest.fn(() => true);

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(console.log).toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});

	it("should not log when check function is called and doesn't return true", async () => {
		const fn = jest.fn(() => false);

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(console.log).not.toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});
});

describe('log parameter', () => {
	it('should call the log function passed as a parameter', async () => {
		const logFn = jest.fn();
		const checkFn = jest.fn(() => false);
		const spawnFn = jest.fn(async () => {});

		await open(testPlaceFile, { _spawnFn: spawnFn, checkFn: checkFn, force: false, log: logFn });

		expect(logFn).toHaveBeenCalledWith('[open-rbxl] Opening Roblox Studio...');
	});

	it('should call the log function when checkFn returns true', async () => {
		const logFn = jest.fn();
		const checkFn = jest.fn(() => true);
		const spawnFn = jest.fn(async () => {});

		await open(testPlaceFile, { _spawnFn: spawnFn, checkFn: checkFn, force: false, log: logFn });

		expect(logFn).toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});
});
