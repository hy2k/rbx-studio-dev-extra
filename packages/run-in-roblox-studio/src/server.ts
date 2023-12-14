import Fastify from 'fastify';

import { store } from './store.js';

const fastify = Fastify({
	logger: true,
});

fastify.get('/poll', async (_request, reply) => {
	return reply.status(204).send();
});

fastify.get('/start', async (_request, reply) => {
	return reply.status(200).send({
		source: store.luaSource,
	});
});

process.on('SIGINT', () => {
	fastify.close();
});

export const server = fastify;
