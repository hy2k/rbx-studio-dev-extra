import { describe, expect, it } from '@jest/globals';
import path from 'node:path';

import { InvalidStudioRootError, PlatformNotSupportedError, StudioNotInstalledError } from './errors.js';
import { getRobloxStudioPathInternal } from './internal.js';

describe('Windows', () => {
	it('should throw when studio root does not exist on windows', async () => {
		const fn = getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: path.resolve('./fixtures/Windows/does-not-exist'),
		});
		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');
	});

	it('should throw when studio root is not a directory', async () => {
		const fn = getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: path.resolve('./fixtures/Windows/Roblox/Versions/version-hash1/RobloxStudioBeta.exe'),
		});

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Not a directory');
	});

	it('should return paths for Windows', async () => {
		const robloxStudioPath = await getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: path.resolve('./fixtures/Windows/Roblox'),
		});

		expect(robloxStudioPath).toBeTruthy();
	});

	it('should throw when studio root does not have Versions directory', async () => {
		const fn = getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: path.resolve('./fixtures/Windows/no-version-dir'),
		});
		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Versions directory does not exist');
	});

	it('should throw when studio executable is not found', async () => {
		const fn = getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: path.resolve('./fixtures/Windows/no-studio-exe'),
		});
		await expect(fn).rejects.toThrow(StudioNotInstalledError);
		await expect(fn).rejects.toThrow('Roblox Studio is not installed');
	});
});

describe('WSL', () => {
	it('should throw when studio root dos not exist on WSL', async () => {
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: path.resolve('./fixtures/Windows/does-not-exist'),
		});

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');
	});

	it("should throw when studio root isn't a directory on WSL", async () => {
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: path.resolve('./fixtures/Windows/Roblox/Versions/version-hash1/RobloxStudioBeta.exe'),
		});

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Not a directory');
	});

	it('should return paths for WSL', async () => {
		const robloxStudioPath = await getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: path.resolve('./fixtures/Windows/Roblox'),
		});

		expect(robloxStudioPath).toBeTruthy();
	});

	it("should throw an error when studio root isn't provided", async () => {
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
		});

		await expect(fn).rejects.toThrow(Error);
		await expect(fn).rejects.toThrow('studioRoot is required when using WSL');
	});

	it('should throw when studio root path is invalid', async () => {
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: path.resolve('./fixtures/Windows/rbx'),
		});

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');
	});

	it('should throw when studio executable is not found', async () => {
		const fn = getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: path.resolve('./fixtures/Windows/no-studio-exe'),
		});

		await expect(fn).rejects.toThrow(StudioNotInstalledError);
		await expect(fn).rejects.toThrow('Roblox Studio is not installed');
	});
});

describe('Unsupported platform', () => {
	it('should throw PlatFormNotSupportedError on linux but not WSL', async () => {
		const fn = getRobloxStudioPathInternal({
			isWsl: false,
			platform: 'linux',
		});

		await expect(fn).rejects.toThrow(PlatformNotSupportedError);
		await expect(fn).rejects.toThrow("Linux isn't supported without WSL");
	});

	it('should throw PlatFormNotSupportedError when platform is not supported', async () => {
		const fn = getRobloxStudioPathInternal({
			platform: 'freebsd',
		});

		await expect(fn).rejects.toThrow(PlatformNotSupportedError);
		await expect(fn).rejects.toThrow("Platform freebsd isn't supported");
	});

	it("should throw PlatFormNotSupportedError even if a valid studio root is provided when platform isn't supported", async () => {
		const fn = getRobloxStudioPathInternal({
			platform: 'freebsd',
			studioRoot: path.resolve('./fixtures/Windows/Roblox'),
		});

		await expect(fn).rejects.toThrow(PlatformNotSupportedError);
		await expect(fn).rejects.toThrow("Platform freebsd isn't supported");
	});
});
