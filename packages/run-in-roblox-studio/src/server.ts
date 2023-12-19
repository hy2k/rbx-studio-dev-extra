import Fastify from 'fastify';

import { store } from './store.js';

const fastify = Fastify({
	logger: {},
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
	reply.status(204).send();
});

fastify.addHook('onSend', (request) => {
	if (request.url === '/end' && request.method === 'POST') {
		process.nextTick(() => {
			process.exit(0);
		});
	}
});

process.on('SIGINT', () => {
	fastify.close();
});

export const server = fastify;
