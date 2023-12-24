import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROBLOX_STUDIO_PATH } from './constants.js';
import { InvalidStudioRootError, PlatformNotSupportedError } from './errors.js';
import * as windows from './platform/windows.js';

const getDefaultStudioRootWindows = vi.spyOn(windows, 'getDefaultStudioRootWindows');
const getRobloxStudioPathWindows = vi.spyOn(windows, 'getRobloxStudioPathWindows');

const originalEnv = process.env;

beforeEach(() => {
	vi.resetAllMocks();

	vi.stubEnv(ROBLOX_STUDIO_PATH, "");

	vi.mock('node:fs/promises', async () => {
		const { Volume, createFsFromVolume } = await import('memfs');

		const vol = Volume.fromNestedJSON({
			Roblox: {},
			'file.txt': '',
		});

		const fs = createFsFromVolume(vol).promises;
		return fs;
	});
});

afterEach(() => {
	process.env = originalEnv;
});

describe('Windows', () => {
	it('should throw when studio root does not exist', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: 'does-not-exist',
		});
		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');

		expect(getRobloxStudioPathWindows).not.toHaveBeenCalled();
	});

	it('should throw when studio root is not a directory', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: 'file.txt',
		});

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Not a directory');

		expect(getRobloxStudioPathWindows).not.toHaveBeenCalled();
	});

	it('should call windows function when studio root is directory', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		await getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: 'Roblox',
		});

		expect(getRobloxStudioPathWindows).toHaveBeenCalledTimes(1);
		expect(getRobloxStudioPathWindows).toHaveBeenCalledWith('Roblox');
	});

	it('should call default root when studio root is not provided', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		await getRobloxStudioPathInternal({
			platform: 'win32',
		});

		expect(getDefaultStudioRootWindows).toHaveBeenCalledTimes(1);
		expect(getRobloxStudioPathWindows).toHaveBeenCalledWith(getDefaultStudioRootWindows.getMockImplementation()?.());
	});

	it('should not call default root when studio root is provided', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		await getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: 'Roblox',
		});

		expect(getDefaultStudioRootWindows).not.toHaveBeenCalled();
		expect(getRobloxStudioPathWindows).toHaveBeenCalledWith('Roblox');
	});
});

describe('WSL', () => {
	it('should throw when studio root dos not exist on WSL', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: 'does-not-exist',
		});

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');

		expect(getRobloxStudioPathWindows).not.toHaveBeenCalled();
	});

	it('should throw when studio root is not a directory', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: 'file.txt',
		});

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Not a directory');

		expect(getRobloxStudioPathWindows).not.toHaveBeenCalled();
	});

	it("should throw an error when studio root isn't provided", async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
		});

		await expect(fn).rejects.toThrow(Error);
		await expect(fn).rejects.toThrow('studioRoot is required when using WSL');

		expect(getRobloxStudioPathWindows).not.toHaveBeenCalled();
	});

	it('should call windows function when studio root is directory', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		await getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: 'Roblox',
		});

		expect(getRobloxStudioPathWindows).toHaveBeenCalledTimes(1);
		expect(getRobloxStudioPathWindows).toHaveBeenCalledWith('Roblox');
	});

	it('should not throw when environment variable for studio root is provided', async () => {
		vi.stubEnv(ROBLOX_STUDIO_PATH, 'Roblox');

		const { getRobloxStudioPathInternal } = await import('./internal.js');
		await getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
		});

		expect(getRobloxStudioPathWindows).toHaveBeenCalledTimes(1);
		expect(getRobloxStudioPathWindows).toHaveBeenCalledWith('Roblox');
	});
});

describe('Unsupported platform', () => {
	it('should throw PlatFormNotSupportedError on linux but not WSL', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			isWsl: false,
			platform: 'linux',
		});

		await expect(fn).rejects.toThrow(PlatformNotSupportedError);
		await expect(fn).rejects.toThrow("Linux isn't supported without WSL");

		expect(getRobloxStudioPathWindows).not.toHaveBeenCalled();
	});

	it('should throw PlatFormNotSupportedError when platform is not supported', async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			platform: 'freebsd',
		});

		await expect(fn).rejects.toThrow(PlatformNotSupportedError);
		await expect(fn).rejects.toThrow("Platform freebsd isn't supported");
	});

	it("should throw PlatFormNotSupportedError even if a valid studio root is provided when platform isn't supported", async () => {
		const { getRobloxStudioPathInternal } = await import('./internal.js');
		const fn = getRobloxStudioPathInternal({
			platform: 'freebsd',
			studioRoot: 'Roblox',
		});

		await expect(fn).rejects.toThrow(PlatformNotSupportedError);
		await expect(fn).rejects.toThrow("Platform freebsd isn't supported");
	});
});
