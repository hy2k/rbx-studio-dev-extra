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

	fastify.post(
		'/stop',
		{
			schema: {
				body: {
					properties: {
						isError: {
							type: 'boolean',
						},
					},
					required: ['isError'],
					type: 'object',
				},
			},
		},
		async (_request, reply) => {
			return reply.status(204).send();
		},
	);

	fastify.addHook('onResponse', (request, _reply, done) => {
		if (request.url === '/stop' && request.method === 'POST') {
			const data = request.body as { isError: boolean };
			const exitCode = data.isError ? 1 : 0;
			process.nextTick(() => {
				process.exit(exitCode);
			});
		}
		done();
	});

	return fastify;
}
