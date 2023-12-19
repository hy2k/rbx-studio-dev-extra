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

jest.spyOn(console, 'warn');

describe('open-rbxl', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should call spawn function when force is true', async () => {
		const fn = jest.fn(async () => {});

		await open(testPlaceFile, { ...options, _spawnFn: fn, force: true });

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(testPlaceFile);
	});

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

	it('should warn when check function is called and returns true', async () => {
		const fn = jest.fn(() => true);

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(console.warn).toHaveBeenCalledWith('[open-rbxl] Roblox Studio is already open');
	});

	it("should not warn when check function is called and doesn't return true", async () => {
		const fn = jest.fn(() => false);

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		expect(console.warn).not.toHaveBeenCalled();
	});

	it('should throw when place file does not exist', async () => {
		await expect(open('./fixtures/does-not-exist.rbxl', options)).rejects.toThrow(
			new OpenRbxlError('Invalid place path'),
		);
	});

	it("should throw when place file isn't a file", async () => {
		await expect(open('./fixtures', options)).rejects.toThrow(new OpenRbxlError('Not a file'));
	});
});
