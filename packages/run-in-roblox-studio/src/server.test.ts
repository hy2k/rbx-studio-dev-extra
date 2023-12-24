import { beforeEach, describe, expect, it, vi } from 'vitest';

import { store } from './store.js';

vi.spyOn(process, 'exit').mockImplementation((_code?: number) => undefined as never);

vi.mock('./store.js', async (importOriginal) => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const { TestStore } = await importOriginal<typeof import('./store.js')>();

	const testStore = new TestStore();

	return {
		store: testStore,
	};
});

beforeEach(() => {
	vi.resetAllMocks();

	store._reset();
});

async function getTestServer() {
	const { getServer } = await import('./server.js');
	return getServer();
}

describe('start', () => {
	it('should return status 400 when placeName does not match', async () => {
		store.luaSource = 'print("Hello, world!")';
		store.placeName = 'test place';

		const server = await getTestServer();

		const response = await server.inject({
			method: 'POST',
			payload: {
				placeName: 'other place',
			},
			url: '/start',
		});

		expect(response.statusCode).toBe(400);
		expect(response.body).toBe('Skipping request from other place');
	});

	it('should return status 200 when placeName is provided', async () => {
		store.luaSource = 'print("Hello, world!")';
		store.placeName = 'test place';

		const server = await getTestServer();

		const response = await server.inject({
			method: 'POST',
			payload: { placeName: 'test place' },
			url: '/start',
		});

		expect(response.statusCode).toBe(200);
	});

	it('should error when store is not initialized', async () => {
		const server = await getTestServer();

		const response = await server.inject({
			method: 'POST',
			payload: { placeName: 'test place' },
			url: '/start',
		});

		expect(response.statusCode).toBe(500);
	});

	it('should return 400 when the payload is an array', async () => {
		store.luaSource = 'print("Hello, world!")';
		store.placeName = 'test place';

		const server = await getTestServer();

		const response = await server.inject({
			method: 'POST',
			payload: [],
			url: '/start',
		});

		expect(response.statusCode).toBe(400);
		expect(response.body).toContain('body must be object');
	});

	it('should return 400 when the payload has missing required props', async () => {
		store.luaSource = 'print("Hello, world!")';
		store.placeName = 'test place';

		const server = await getTestServer();

		const response = await server.inject({
			method: 'POST',
			payload: {},
			url: '/start',
		});

		expect(response.statusCode).toBe(400);
		expect(response.body).toContain('required property');
	});
});

describe('stop', () => {
	it('should return status 204', async () => {
		const server = await getTestServer();

		const response = await server.inject({
			method: 'POST',
			payload: { isError: false },
			url: '/stop',
		});

		expect(response.statusCode).toBe(204);
	});

	it('should return 400 when isError is not provided', async () => {
		const server = await getTestServer();

		const response = await server.inject({
			method: 'POST',
			payload: {},
			url: '/stop',
		});

		expect(response.statusCode).toBe(400);
	});

	it('should exit the process after send', async () => {
		const server = await getTestServer();

		await server.inject({
			method: 'POST',
			payload: { isError: false },
			url: '/stop',
		});

		expect(process.exit).toHaveBeenCalledWith(0);
	});

	it('should exit the process with code 1 when isError is true', async () => {
		const server = await getTestServer();

		await server.inject({
			method: 'POST',
			payload: { isError: true },
			url: '/stop',
		});

		expect(process.exit).toHaveBeenCalledWith(1);
	});
});
