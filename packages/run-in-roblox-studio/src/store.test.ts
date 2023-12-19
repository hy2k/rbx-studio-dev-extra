import { beforeEach, describe, expect, it } from '@jest/globals';

import { TestStore } from './store.js';

describe('run-in-roblox-studio/store', () => {
	let store: TestStore;

	beforeEach(() => {
		store = new TestStore();
	});

	it('should get and set luaSource', () => {
		const source = `print(${Math.random()}`;
		store.luaSource = source;

		expect(store.luaSource).toBe(source);
	});

	it('should throw when accessing luaSource before it is set', () => {
		expect(() => {
			store.luaSource;
		}).toThrow('luaSource is not set');
	});
});
