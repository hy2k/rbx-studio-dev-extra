import * as assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';

import type { RbxlOptions } from './index.js';

import { open } from './index.js';

const options: Readonly<RbxlOptions> = {
	// Prevents Roblox Studio from opening in tests.
	_spawnFn: async () => {},

	// Uses fake, platform-agnostic check function in tests.
	checkFn: async () => {
		return true;
	},
};

describe('open-rbxl', () => {
	beforeEach(() => {
		mock.restoreAll();
	});

	it('should call spawn function when force is true', async () => {
		const fn = mock.fn(async () => {});

		await open('./place.rbxl', { ...options, _spawnFn: fn, force: true });

		assert.strictEqual(fn.mock.callCount(), 1);
		assert.deepStrictEqual(fn.mock.calls[0]?.arguments, ['./place.rbxl']);
	});

	it('should call check function when force is false', async () => {
		const fn = mock.fn(async () => {
			return true;
		});

		await open('./place.rbxl', { ...options, checkFn: fn, force: false });

		assert.strictEqual(fn.mock.callCount(), 1);
		assert.deepStrictEqual(fn.mock.calls[0]?.arguments, ['./place.rbxl']);
	});

	it('should not call check function when force is true', async () => {
		const fn = mock.fn(async () => {
			return true;
		});

		await open('./place.rbxl', { ...options, checkFn: fn, force: true });

		assert.strictEqual(fn.mock.callCount(), 0);
	});
});
