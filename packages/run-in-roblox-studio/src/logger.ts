import type { LoggerOptions } from 'pino';

import { pino } from 'pino';

const isDev = process.env.NODE_ENV === 'development';

/** @internal */
export const loggerOption: LoggerOptions = {
	level: isDev ? 'trace' : 'warn',
	transport: isDev ? { target: 'pino-pretty' } : undefined,
};

export const logger = pino(loggerOption);
