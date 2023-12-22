import Fastify from 'fastify';

import { logger } from './logger.js';
import { store } from './store.js';

const fastify = Fastify({
	logger: logger,
});

fastify.get('/poll', async (_request, reply) => {
	return reply.status(204).send();
});

fastify.post('/start', async (_request, reply) => {
	return reply.status(200).send({
		source: store.luaSource,
	});
});

fastify.post('/end', async (_request, reply) => {
	return reply.status(204).send();
});

fastify.addHook('onSend', (request) => {
	if (request.url === '/end' && request.method === 'POST') {
		process.nextTick(() => {
			process.exit(0);
		});
	}
});

process.on('SIGINT', () => {
	logger.info('SIGINT received, closing server');
	void fastify.close();
});

export const server = fastify;
