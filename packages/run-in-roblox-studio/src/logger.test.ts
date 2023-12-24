import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('logger', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('should have level "trace" and transport defined when NODE_ENV is "development"', async () => {
		vi.stubEnv('NODE_ENV', 'development');

		const { loggerOption } = await import('./logger.js');

		expect(loggerOption.level).toBe('trace');
		expect(loggerOption.transport).toBeDefined();
	});

	it('should have level "warn" and transport undefined when NODE_ENV is not "development"', async () => {
		vi.stubEnv('NODE_ENV', '');

		const { loggerOption } = await import('./logger.js');

		expect(loggerOption.level).toBe('warn');
		expect(loggerOption.transport).toBeUndefined();
	});
});
