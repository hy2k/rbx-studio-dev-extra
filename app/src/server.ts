import Fastify from 'fastify';

const fastify = Fastify({
	logger: true,
});

fastify.get('/', async () => {
	return { hello: 'world' };
});

process.on('SIGINT', () => {
	fastify.close();
});

export async function startServer() {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
	}
}
