import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { TestStore } from './store.js';

describe('run-in-roblox-studio/store', () => {
	let store: TestStore;

	beforeEach(() => {
		store = new TestStore();
	});

	it('should get and set luaSource', () => {
		const source = `print(${Math.random()}`;
		store.luaSource = source;

		assert.strictEqual(store.luaSource, source);
	});

	it('should throw when getting luaSource before it is set', () => {
		assert.throws(
			() => {
				store.luaSource;
			},
			{
				message: 'luaSource is not set',
			},
		);
	});
});
