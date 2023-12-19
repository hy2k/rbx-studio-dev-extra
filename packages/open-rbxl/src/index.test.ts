import * as assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';

import type { RbxlOptions } from './index.js';

import { OpenRbxlError, open } from './index.js';

const options: Readonly<RbxlOptions> = {
	// Prevents Roblox Studio from opening in tests.
	_spawnFn: async () => {},

	// Uses fake, platform-agnostic check function in tests.
	checkFn: () => {
		return true;
	},
};

const testPlaceFile = './fixtures/place.rbxl';

describe('open-rbxl', () => {
	beforeEach(() => {
		mock.restoreAll();
	});

	it('should call spawn function when force is true', async () => {
		const fn = mock.fn(async () => {});

		await open(testPlaceFile, { ...options, _spawnFn: fn, force: true });

		assert.strictEqual(fn.mock.callCount(), 1);
		assert.deepStrictEqual(fn.mock.calls[0]?.arguments, [testPlaceFile]);
	});

	it('should call check function when force is false', async () => {
		const fn = mock.fn(() => {
			return true;
		});

		await open(testPlaceFile, { ...options, checkFn: fn, force: false });

		assert.strictEqual(fn.mock.callCount(), 1);
		assert.deepStrictEqual(fn.mock.calls[0]?.arguments, [testPlaceFile]);
	});

	it('should not call check function when force is true', async () => {
		const fn = mock.fn(() => {
			return true;
		});

		await open(testPlaceFile, { ...options, checkFn: fn, force: true });

		assert.strictEqual(fn.mock.callCount(), 0);
	});

	it('should throw when place file does not exist', () => {
		assert.rejects(() => open('./fixtures/does-not-exist.rbxl', options), {
			message: 'Invalid place path',
			name: OpenRbxlError.name,
		});
	});

	it("should throw when place file isn't a file", () => {
		assert.rejects(() => open('./fixtures', options), {
			message: 'Not a file',
			name: OpenRbxlError.name,
		});
	});
});
