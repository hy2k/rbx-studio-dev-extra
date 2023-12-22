import { pino } from 'pino';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
	level: isDev ? 'trace' : 'warn',

	transport: isDev
		? {
				target: 'pino-pretty',
			}
		: undefined,
});
