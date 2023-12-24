import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InvalidStudioRootError, StudioNotInstalledError } from '../errors.js';

vi.mock('node:fs/promises', async () => {
	const { Volume, createFsFromVolume } = await import('memfs');

	const vol = Volume.fromNestedJSON({
		Roblox: {
			Versions: {
				'version-hash1': {
					'RobloxStudioBeta.exe': '',
				},
				'version-hash2': {
					'RobloxStudioBeta.exe': '',
				},
			},
		},
		'file.txt': '',
		'no-studio-exe': {
			Versions: {
				'version-hash1': {},
			},
		},
		'no-version-dir': {},
	});

	return createFsFromVolume(vol).promises;
});

beforeEach(() => {
	vi.resetAllMocks();
});

describe('getRobloxStudioPathWindows', () => {
	it('should return paths for Windows', async () => {
		const { getRobloxStudioPathWindows } = await import('./windows.js');
		const robloxStudioPath = await getRobloxStudioPathWindows('Roblox');

		expect(robloxStudioPath.plugins).toContain('Plugins');
		expect(robloxStudioPath.application).toContain('RobloxStudio');
	});

	it('should throw when studio root does not exist', async () => {
		const { getRobloxStudioPathWindows } = await import('./windows.js');
		const fn = getRobloxStudioPathWindows('does-not-exist');
		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');
	});

	it('should throw when studio root is not a directory', async () => {
		const { getRobloxStudioPathWindows } = await import('./windows.js');
		const fn = getRobloxStudioPathWindows('file.txt');

		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');
	});

	it('should throw when studio root does not have Versions directory', async () => {
		const { getRobloxStudioPathWindows } = await import('./windows.js');
		const fn = getRobloxStudioPathWindows('no-version-dir');
		await expect(fn).rejects.toThrow(InvalidStudioRootError);
		await expect(fn).rejects.toThrow('Does not exist');
	});

	it('should throw when studio executable is not found', async () => {
		const { getRobloxStudioPathWindows } = await import('./windows.js');
		const fn = getRobloxStudioPathWindows('no-studio-exe');
		await expect(fn).rejects.toThrow(StudioNotInstalledError);
		await expect(fn).rejects.toThrow('Roblox Studio is not installed');
	});
});

describe('getDefaultStudioRootWindows', () => {
	it('should return default studio root', async () => {
		const { getDefaultStudioRootWindows } = await import('./windows.js');
		const studioRoot = getDefaultStudioRootWindows();
		expect(studioRoot).toContain('AppData');
		expect(studioRoot).toContain('Local');
		expect(studioRoot).toContain('Roblox');
	});
});
