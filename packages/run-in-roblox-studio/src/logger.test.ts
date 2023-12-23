import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('logger', () => {
	const originalNodeEnv = process.env;

	beforeEach(() => {
		// Module registry is cached between tests, so reset or NODE_ENV will stay the same between
		// tests.
		vi.resetModules();
	});

	afterEach(() => {
		process.env = originalNodeEnv;
	});

	it('should have level "trace" and transport defined when NODE_ENV is "development"', async () => {
		process.env = { ...originalNodeEnv, NODE_ENV: 'development' };

		const { loggerOption } = await import('./logger.js');

		expect(loggerOption.level).toBe('trace');
		expect(loggerOption.transport).toBeDefined();
	});

	it('should have level "warn" and transport undefined when NODE_ENV is not "development"', async () => {
		process.env = { ...originalNodeEnv, NODE_ENV: undefined };

		const { loggerOption } = await import('./logger.js');

		expect(loggerOption.level).toBe('warn');
		expect(loggerOption.transport).toBeUndefined();
	});
});
