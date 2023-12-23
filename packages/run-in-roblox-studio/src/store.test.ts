import { beforeEach, describe, expect, it } from 'vitest';

import { TestStore } from './store.js';

let store: TestStore;

beforeEach(() => {
	store = new TestStore();
});

describe('luaSource', () => {
	it("should return luaSource when it's set", () => {
		const source = `print("Hello, world!")`;
		store.luaSource = source;

		expect(store.luaSource).toBe(source);
	});

	it('should throw when accessing luaSource before it is set', () => {
		expect(() => {
			store.luaSource;
		}).toThrow('luaSource is not set');
	});

	it('should throw when reassigning luaSource', () => {
		const source = `print("Hello, world!")`;
		store.luaSource = source;

		expect(() => {
			store.luaSource = `print("Hello, world!")`;
		}).toThrow('Cannot set luaSource multiple times');
	});

	it('should not throw when assigning luaSource for the first time', () => {
		const source = `print("Hello, world!")`;

		expect(() => {
			store.luaSource = source;
		}).not.toThrow();
	});
});

describe('placeName', () => {
	it("should return placeName when it's set", () => {
		const placeName = 'placeName';
		store.placeName = placeName;

		expect(store.placeName).toBe(placeName);
	});

	it('should throw when accessing placeName before it is set', () => {
		expect(() => {
			store.placeName;
		}).toThrow('placePath is not set');
	});

	it('should throw when reassigning placeName', () => {
		const placeName = 'placeName';
		store.placeName = placeName;

		expect(() => {
			store.placeName = placeName;
		}).toThrow('Cannot set placePath multiple times');
	});

	it('should not throw when assigning placeName for the first time', () => {
		const placeName = 'placeName';

		expect(() => {
			store.placeName = placeName;
		}).not.toThrow();
	});
});
