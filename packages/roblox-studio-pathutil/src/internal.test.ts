import assert from 'node:assert';
import path from 'node:path';
import { describe, it } from 'node:test';

import { InvalidStudioRootError, PlatformNotSupportedError, StudioNotFoundError } from './errors.js';
import { getRobloxStudioPathInternal } from './internal.js';

describe('Windows', () => {
	it('should return paths for Windows', async () => {
		const robloxStudioPath = await getRobloxStudioPathInternal({
			platform: 'win32',
			studioRoot: path.resolve('./fixtures/Windows/Roblox'),
		});

		assert.ok(robloxStudioPath);
	});

	it('should throw when studio root path is invalid', async () => {
		await assert.rejects(
			async () => {
				await getRobloxStudioPathInternal({
					platform: 'win32',
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
					platform: 'win32',
					studioRoot: path.resolve('./fixtures/Windows/no-studio-exe'),
				});
			},
			{
				name: StudioNotFoundError.name,
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
				name: StudioNotFoundError.name,
			},
		);
	});
});

describe('Unsupported platform', () => {
	it('should throw when linux but not WSL', async () => {
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

	it('should throw when platform is not supported', async () => {
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
});
