const script = process.argv[2];

import concurrently from 'concurrently';
import fs from 'fs';

const workspaces = fs
	.readdirSync('./packages')
	.filter((workspace) => {
		try {
			return fs.existsSync(`./packages/${workspace}/package.json`);
		} catch (e) {
			return false;
		}
	})
	.filter(Boolean);

concurrently(
	workspaces.map((workspace) => ({
		command: `npm run ${script} -w ${workspace} --if-present`,
		name: `${workspace}`,
	})),
	{
		prefixColors: 'auto',
	},
);
