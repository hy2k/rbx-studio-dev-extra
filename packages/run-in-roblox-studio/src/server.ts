import Fastify from 'fastify';

import { IS_DEV } from './constants.js';
import { store } from './store.js';

const fastify = Fastify({
	logger: true,
});

fastify.get('/poll', async (_request, reply) => {
	return reply.status(200).send({
		isDev: IS_DEV,
	});
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
