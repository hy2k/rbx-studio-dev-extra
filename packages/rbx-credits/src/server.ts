import Fastify from 'fastify';

import { emitAssetCredits } from './data.js';
import { logger } from './logger.js';

let isStarted = false;

const fastify = Fastify({
	logger: logger,
});

fastify.get('/poll', async (_request, reply) => {
	if (isStarted) {
		return reply.status(400).send('Already started');
	}

	return reply.status(204).send();
});

fastify.post(
	'/submit',
	{
		// Accept any object and let Zod handle parsing
		preValidation: (request, reply, done) => {
			if (request.body === null) {
				void reply.status(400).send('Body must not be null');
			}
			done();
		},
		schema: {
			body: {
				additionalProperties: true,
				type: 'object',
			},
		},
	},
	async (request, reply) => {
		const data = request.body;

		// Prevent plugin from running multiple times. This may happen when another polling request
		// is sent before the previous one is finished.
		isStarted = true;

		emitAssetCredits(data as object).catch((err: unknown) => {
			logger.fatal(err);
		});

		return reply.status(204).send();
	},
);

fastify.addHook('onSend', async (request, reply) => {
	if (request.url === '/submit' && request.method === 'POST') {
		// If reply is not success, the schema validation fails.
		if (reply.statusCode !== 204) {
			// Must after reply or plugin keeps waiting for the request to finish
			process.nextTick(() => {
				process.exit(1);
			});
		}
	}
});

process.on('SIGINT', () => {
	logger.info('SIGINT received, closing server');
	void fastify.close();
});

export const server = fastify;
