import type { FastifyServerOptions } from 'fastify';

import Fastify from 'fastify';

import { store } from './store.js';

export function getServer(options?: FastifyServerOptions) {
	const fastify = Fastify(options);

	fastify.post(
		'/start',
		{
			schema: {
				body: {
					additionalProperties: false,
					properties: {
						placeName: {
							type: 'string',
						},
					},
					required: ['placeName'],
					type: 'object',
				},
			},
		},
		async (request, reply) => {
			const data = request.body as { placeName: string };

			if (data.placeName !== store.placeName) {
				// Multiple studio instances may be running at the same time. Ignore requests from other
				// instances.
				return reply.status(400).send(`Skipping request from ${data.placeName}`);
			}

			return reply.status(200).send({
				source: store.luaSource,
			});
		},
	);

	fastify.post('/stop', async (_request, reply) => {
		return reply.status(204).send();
	});

	fastify.addHook('onResponse', (request, _reply, done) => {
		if (request.url === '/stop' && request.method === 'POST') {
			process.nextTick(() => {
				process.exit(0);
			});
		}
		done();
	});

	return fastify;
}
