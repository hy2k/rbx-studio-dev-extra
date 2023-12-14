import Fastify from 'fastify';

const fastify = Fastify({
	logger: true,
});

fastify.get('/poll', async (_request, reply) => {
	return reply.status(204).send();
});

process.on('SIGINT', () => {
	fastify.close();
});

export const server = fastify;
