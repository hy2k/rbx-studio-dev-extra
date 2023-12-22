import Fastify from 'fastify';

import { logger } from './logger.js';
import { store } from './store.js';

const fastify = Fastify({
	logger: logger,
});

fastify.post('/start', async (_request, reply) => {
	return reply.status(200).send({
		source: store.luaSource,
	});
});

fastify.post('/stop', async (_request, reply) => {
	return reply.status(204).send();
});

fastify.addHook('onSend', (request) => {
	if (request.url === '/stop' && request.method === 'POST') {
		process.nextTick(() => {
			process.exit(0);
		});
	}
});

export const server = fastify;
