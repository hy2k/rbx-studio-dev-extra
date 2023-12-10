import assert from 'node:assert';
import path from 'node:path';
import { describe, it } from 'node:test';

import { InvalidStudioRootError, PlatformNotSupportedError, StudioNotInstalledError } from './errors.js';
import { getRobloxStudioPathInternal } from './internal.js';

describe('All supported platforms', () => {
	it('should throw when studio root does not exist', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					platform: 'win32',
					studioRoot: path.resolve('./fixtures/Windows/does-not-exist'),
				});
			},
			{
				message: 'Does not exist',
				name: InvalidStudioRootError.name,
			},
		);
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					isWsl: true,
					platform: 'linux',
					studioRoot: path.resolve('./fixtures/Windows/does-not-exist'),
				});
			},
			{
				message: 'Does not exist',
				name: InvalidStudioRootError.name,
			},
		);
	});

	it('should throw when studio root is not a directory', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					platform: 'win32',
					studioRoot: path.resolve('./fixtures/Windows/Roblox/Versions/version-hash1/RobloxStudioBeta.exe'),
				});
			},
			{
				message: 'Not a directory',
				name: InvalidStudioRootError.name,
			},
		);
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					isWsl: true,
					platform: 'linux',
					studioRoot: path.resolve('./fixtures/Windows/Roblox/Versions/version-hash1/RobloxStudioBeta.exe'),
				});
			},
			{
				message: 'Not a directory',
				name: InvalidStudioRootError.name,
			},
		);
	});
});

describe('Windows', () => {
	it('should return paths for Windows', async () => {
		const robloxStudioPath = await getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: path.resolve('./fixtures/Windows/Roblox'),
		});

		assert.ok(robloxStudioPath);
	});

	it('should throw when studio root does not have Versions directory', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					platform: 'win32',
					studioRoot: path.resolve('./fixtures/Windows/no-version-dir'),
				});
			},
			{
				message: 'Versions directory does not exist',
				name: InvalidStudioRootError.name,
			},
		);
	});

	it('should throw when studio executable is not found', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					platform: 'win32',
					studioRoot: path.resolve('./fixtures/Windows/no-studio-exe'),
				});
			},
			{
				message: 'Roblox Studio is not installed',
				name: StudioNotInstalledError.name,
			},
		);
	});
});

describe('WSL', () => {
	it('should return paths for WSL', async () => {
		const robloxStudioPath = await getRobloxStudioPathInternal({
			isWsl: true,
			platform: 'linux',
			studioRoot: path.resolve('./fixtures/Windows/Roblox'),
		});

		assert.ok(robloxStudioPath);
	});

	it("should throw an error when studio root isn't provided", async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					isWsl: true,
					platform: 'linux',
				});
			},
			{
				message: 'studioRoot is required when using WSL',
			},
		);
	});

	it('should throw when studio root path is invalid', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					isWsl: true,
					platform: 'linux',
					studioRoot: path.resolve('./fixtures/Windows/rbx'),
				});
			},
			{
				name: InvalidStudioRootError.name,
			},
		);
	});

	it('should throw when studio executable is not found', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					isWsl: true,
					platform: 'linux',
					studioRoot: path.resolve('./fixtures/Windows/no-studio-exe'),
				});
			},
			{
				name: StudioNotInstalledError.name,
			},
		);
	});
});

describe('Unsupported platform', () => {
	it('should throw PlatFormNotSupportedError on linux but not WSL', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					isWsl: false,
					platform: 'linux',
				});
			},
			{
				name: PlatformNotSupportedError.name,
			},
		);
	});

	it('should throw PlatFormNotSupportedError when platform is not supported', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					platform: 'freebsd',
				});
			},
			{
				name: PlatformNotSupportedError.name,
			},
		);
	});

	it("should throw PlatFormNotSupportedError even if a valid studio root is provided when platform isn't supported", async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					platform: 'freebsd',
					studioRoot: path.resolve('./fixtures/Windows/Roblox'),
				});
			},
			{
				name: PlatformNotSupportedError.name,
			},
		);
	});
});
